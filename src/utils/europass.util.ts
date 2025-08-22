// europass.util.ts
// Deps: npm i pdfjs-dist fast-xml-parser
// For Vite/Next: worker import below uses ?url. For CRA, see note at bottom.

import { getDocument, GlobalWorkerOptions, PDFDocumentProxy } from "pdfjs-dist";
import { XMLParser } from "fast-xml-parser";

// --- Types -------------------------------------------------------------------

export type InternMixCV = {
  personal: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    address?: string;
    dob?: string;
    nationality?: string;
    cgpa?: number;
  };
  education: Array<{
    organisation?: string;
    title?: string;
    start?: string;
    end?: string;
    city?: string;
    description?: string;
    level?: string;
    website?: string;
  }>;
  experience: Array<{
    title?: string;
    company?: string;
    start?: string;
    end?: string;
    city?: string;
    description?: string;
  }>;
  languages: Array<{
    code?: string;
    listening?: string;
    reading?: string;
    interaction?: string;
    production?: string;
    writing?: string;
  }>;
  skills?: Array<{
    name?: string;
    taxonomy?: string;
    competencyId?: string;
  }>;
  github?: {
    languages: string[];
    repos: string[];
    repoLanguageMap: Record<string, string>;
  };
  meta?: { template?: string };
};

// --- Worker setup -------------------------------------------------------------

/** Call once (e.g., in App.tsx useEffect) before using pdf.js */
export function setupPdfWorker() {
  // Use local worker file for better compatibility
  GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

// --- Low-level helpers --------------------------------------------------------

async function loadPdfFromFile(file: File): Promise<PDFDocumentProxy> {
  const ab = await file.arrayBuffer();
  return await getDocument({ data: ab }).promise;
}

/** Extract embedded Europass XML from a Europass PDF; throws if missing. */
async function extractEuropassXmlFromPdf(file: File): Promise<string> {
  const pdf = await loadPdfFromFile(file);
  const attachments = await pdf.getAttachments();
  if (!attachments || Object.keys(attachments).length === 0) {
    throw new Error("No attachments found. This is likely not a Europass PDF.");
  }

  const entries = Object.entries(attachments) as Array<
    [string, { content: Uint8Array; filename?: string }]
  >;

  let xmlBytes: Uint8Array | null = null;
  for (const [name, att] of entries) {
    const fname = (att.filename || name || "").toLowerCase();
    if (fname.endsWith(".xml") || fname.includes("europass")) {
      xmlBytes = att.content;
      break;
    }
  }
  if (!xmlBytes) {
    if (entries.length === 1) xmlBytes = entries[0][1].content;
    else throw new Error("Europass XML attachment not found.");
  }

  return new TextDecoder("utf-8").decode(xmlBytes);
}

/** Parse Europass XML string into raw JSON (schema-as-is). */
function parseEuropassXml(xml: string): Record<string, unknown> {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
  const json = parser.parse(xml);
  if (!json || !json.Candidate) {
    throw new Error("Invalid Europass XML (Candidate root missing).");
  }
  return json;
}

// --- Mapper (raw JSON -> InternMixCV) ----------------------------------------

const ensureArray = <T>(data: T | T[] | undefined | null): T[] => {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
};

const getTextContent = (field: unknown): string | undefined => {
    if (typeof field === 'object' && field !== null && '#text' in field) {
      return (field as { '#text': string })['#text'];
    }
    if(typeof field === 'string') {
        return field;
    }
    return undefined;
  };

function mapEuropass(raw: Record<string, unknown>): InternMixCV {
  const candidate = (raw.Candidate as Record<string, unknown>) ?? {};
  const candidatePerson = (candidate.CandidatePerson as Record<string, unknown>) ?? {};
  const candidateProfile = (candidate.CandidateProfile as Record<string, unknown>) ?? {};

  // Extract personal information
  const personName = (candidatePerson.PersonName as Record<string, unknown>) ?? {};
  const communications = ensureArray(
    candidatePerson.Communication as Record<string, unknown>[] | Record<string, unknown>
  );

  let email: string | undefined;
  let phone: string | undefined;
  let address: string | undefined;
  
  for (const comm of communications) {
    const channelCode = comm.ChannelCode as string;
    if (channelCode === 'Email') {
      email = comm['oa:URI'] as string;
    } else if (channelCode === 'Telephone') {
      const countryDialing = comm.CountryDialing as string;
      const dialNumber = comm['oa:DialNumber'] as string;
      phone = `+${countryDialing || ''}${dialNumber || ''}`;
    } else if (comm.Address) {
      const addr = comm.Address as Record<string, unknown>;
      const addressLines = ensureArray(addr['oa:AddressLine'] as string[] | string);
      const city = addr['oa:CityName'] as string;
      const postalCode = addr['oa:PostalCode'] as string;
      address = [...addressLines, city, postalCode].filter(Boolean).join(', ');
    }
  }

  // Extract education
  const educationHistory = (candidateProfile.EducationHistory as Record<string, unknown>) ?? {};
  const educationAttendance = ensureArray(
    educationHistory.EducationOrganizationAttendance as Record<string, unknown>[] | Record<string, unknown>
  );
  
  const eduArr = educationAttendance.map((edu: Record<string, unknown>) => {
    const orgContact = (edu.OrganizationContact as Record<string, unknown>) ?? {};
    const orgCommunications = ensureArray(
      orgContact.Communication as Record<string, unknown>[] | Record<string, unknown>
    );
    let website: string | undefined;
    
    for (const comm of orgCommunications) {
      if (comm.ChannelCode === 'Web') {
        website = comm['oa:URI'] as string;
        break;
      }
    }

    const educationDegree = (edu.EducationDegree as Record<string, unknown>) ?? {};
    const attendancePeriod = (edu.AttendancePeriod as Record<string, unknown>) ?? {};
    const startDate = (attendancePeriod.StartDate as Record<string, unknown>) ?? {};
    const endDate = (attendancePeriod.EndDate as Record<string, unknown>) ?? {};
    const orgAddressComm = orgCommunications.find(c => c.Address);
    const orgAddress = (orgAddressComm?.Address as Record<string, unknown>) ?? {};

    return {
      organisation: edu['hr:OrganizationName'] as string | undefined,
      title: educationDegree['hr:DegreeName'] as string | undefined,
      start: startDate['hr:FormattedDateTime'] as string | undefined,
      end: endDate['hr:FormattedDateTime'] as string | undefined,
      city: orgAddress['oa:CityName'] as string | undefined,
      description: undefined, // Not available in this format
      level: edu.EducationLevelCode as string | undefined,
      website: website,
    };
  });

  // Extract work experience
  const employmentHistory = (candidateProfile.EmploymentHistory as Record<string, unknown>) ?? {};
  const employerHistory = ensureArray(
    employmentHistory.EmployerHistory as Record<string, unknown>[] | Record<string, unknown>
  );
  
  const weArr = employerHistory.map((emp: Record<string, unknown>) => {
    const positionHistory = (emp.PositionHistory as Record<string, unknown>) ?? {};
    const orgContact = (emp.OrganizationContact as Record<string, unknown>) ?? {};
    const employmentPeriod = (positionHistory['eures:EmploymentPeriod'] as Record<string, unknown>) ?? {};
    const startDate = (employmentPeriod['eures:StartDate'] as Record<string, unknown>) ?? {};
    const orgCommunications = ensureArray(
        orgContact.Communication as Record<string, unknown>[] | Record<string, unknown>
    );
    const orgAddressComm = orgCommunications.find(c => c.Address);
    const orgAddress = (orgAddressComm?.Address as Record<string, unknown>) ?? {};
    
    return {
      title: getTextContent(positionHistory.PositionTitle),
      company: emp['hr:OrganizationName'] as string | undefined,
      start: startDate['hr:FormattedDateTime'] as string | undefined,
      end: undefined, // Current job, no end date
      city: orgAddress['oa:CityName'] as string | undefined,
      description: getTextContent(positionHistory['oa:Description']),
    };
  });

  // Extract languages
  const personQualifications = (candidateProfile.PersonQualifications as Record<string, unknown>) ?? {};
  const personCompetencies = ensureArray(
    personQualifications.PersonCompetency as Record<string, unknown>[] | Record<string, unknown>
  );
  
  const langArr = personCompetencies.map((comp: Record<string, unknown>) => {
    const competencyDimensions = ensureArray(
      comp['eures:CompetencyDimension'] as Record<string, unknown>[] | Record<string, unknown>
    );
    let listening: string | undefined;
    let reading: string | undefined;
    let interaction: string | undefined;
    let production: string | undefined;
    let writing: string | undefined;

    for (const dim of competencyDimensions) {
      const typeCode = dim['hr:CompetencyDimensionTypeCode'] as string;
      const score = (dim['eures:Score'] as Record<string, unknown>) ?? {};
      const scoreText = score['hr:ScoreText'] as string;
      
      if (typeCode === 'CEF-Understanding-Listening') listening = scoreText;
      else if (typeCode === 'CEF-Understanding-Reading') reading = scoreText;
      else if (typeCode === 'CEF-Speaking-Interaction') interaction = scoreText;
      else if (typeCode === 'CEF-Speaking-Production') production = scoreText;
      else if (typeCode === 'CEF-Writing-Production') writing = scoreText;
    }

    return {
      code: getTextContent(comp.CompetencyID),
      listening: listening,
      reading: reading,
      interaction: interaction,
      production: production,
      writing: writing,
    };
  });

  // Extract skills
  const skillsRoot = (candidateProfile.Skills as Record<string, unknown>) ?? {};
  const skillsCompetencies = ensureArray(
    skillsRoot.PersonCompetency as Record<string, unknown>[] | Record<string, unknown>
  );
  const skillsArr = skillsCompetencies.map((comp: Record<string, unknown>) => {
    const name = (comp['hr:CompetencyName'] as string) || getTextContent(comp['hr:CompetencyName']);
    const taxonomy = (comp['hr:TaxonomyID'] as string) || getTextContent(comp['hr:TaxonomyID']);
    const competencyId = (comp['CompetencyID'] as string) || getTextContent(comp['CompetencyID']);
    return {
      name,
      taxonomy,
      competencyId,
    };
  }).filter(s => s.name || s.taxonomy || s.competencyId);

  // Extract template information
  const renderingInfo = (candidate.RenderingInformation as Record<string, unknown>) ?? {};
  const design = (renderingInfo.Design as Record<string, unknown>) ?? {};

  return {
    personal: {
      first_name: personName['oa:GivenName'] as string | undefined,
      last_name: personName['hr:FamilyName'] as string | undefined,
      email: email,
      phone: phone,
      address: address,
      dob: candidatePerson['hr:BirthDate'] as string | undefined,
      nationality: candidatePerson.NationalityCode as string | undefined,
    },
    education: eduArr,
    experience: weArr,
    languages: langArr,
    skills: skillsArr,
    meta: { template: design.Template as string | undefined },
  };
}

// --- One-call high-level API --------------------------------------------------

/** Parse a Europass PDF (with embedded XML) to a clean InternMixCV object. */
export async function parseEuropassPdf(file: File): Promise<InternMixCV> {
  const xml = await extractEuropassXmlFromPdf(file);
  const raw = parseEuropassXml(xml);
  return mapEuropass(raw);
}
