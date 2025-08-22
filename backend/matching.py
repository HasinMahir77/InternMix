from __future__ import annotations

from datetime import date
from typing import Any, Dict, List, Tuple

from rapidfuzz import fuzz, process


_MODEL = None  # Lazy-loaded embedding model; stays None if unavailable


def _get_model():
    global _MODEL
    if _MODEL is None:
        try:
            # Local import to avoid importing optional heavy deps at module import time
            from sentence_transformers import SentenceTransformer  # type: ignore
            _MODEL = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
        except Exception:
            _MODEL = False  # sentinel meaning "unavailable"
    return _MODEL


ALIASES = {
    "reactjs": "react",
    "react.js": "react",
    "nextjs": "next.js",
    "next": "next.js",
    "ts": "typescript",
    "js": "javascript",
    "nodejs": "node.js",
    "tailwind css": "tailwind",
    "postgres": "postgresql",
}


def _normalize_skill(skill: str) -> str:
    s = (skill or "").lower().strip()
    return ALIASES.get(s, s)


def _flatten_applicant_skills(applicant: Dict[str, Any]) -> List[str]:
    names: List[str] = []
    for item in applicant.get("skills", []) or []:
        raw = (item.get("name") or "").replace("(", "").replace(")", "")
        tokens = raw.replace("/", ",").replace("+", ",").split(",")
        for tok in tokens:
            tok = tok.strip()
            if tok:
                names.append(tok)
    # also consider GitHub languages as skills signals
    gh = applicant.get("github") or {}
    for lang in gh.get("languages", []) or []:
        if isinstance(lang, str) and lang.strip():
            names.append(lang.strip())
    return sorted({ _normalize_skill(x) for x in names })


def _coverage(required_list: List[str], candidate_list: List[str], threshold: int = 85) -> Tuple[float, List[str], List[str]]:
    if not required_list:
        return 1.0, [], []
    req = [_normalize_skill(x) for x in required_list]
    cand = [_normalize_skill(x) for x in candidate_list]
    matched: List[str] = []
    missing: List[str] = []
    hits = 0
    for r in req:
        if r in cand:
            hits += 1
            matched.append(r)
            continue
        best = process.extractOne(r, cand, scorer=fuzz.token_set_ratio)
        if best and best[1] >= threshold:
            hits += 1
            matched.append(f"{r}~{best[0]}")
        else:
            missing.append(r)
    return hits / max(1, len(req)), matched, missing


def _canonicalize_jd(jd: Dict[str, Any]) -> str:
    required = ", ".join(jd.get("required_skills", []) or [])
    optional = ", ".join(jd.get("optional_skills", []) or [])
    return (
        f"Title: {jd.get('title','')}. "
        f"Description: {jd.get('description','')}. "
        f"Requirements: {required}. "
        f"Preferences: {optional}. "
        f"Degree: {jd.get('degree','')}; Major: {jd.get('major','')}. "
        f"Location: {jd.get('location','')} (remote={bool(jd.get('is_remote'))}). "
        f"Duration: {jd.get('duration_months','')} months. "
        f"Recommended CGPA: {jd.get('recommended_cgpa','')}."
    )


def _get_text_content(field: Any) -> str | None:
    if isinstance(field, dict) and "#text" in field:
        return str(field["#text"]) or None
    if isinstance(field, str):
        return field
    return None


def _canonicalize_cv(app: Dict[str, Any]) -> Tuple[str, List[str]]:
    edu_line = ""
    education = (app.get("education") or [])
    if education:
        e = education[0] or {}
        edu_line = f"{e.get('title','')} at {e.get('organisation','')} ({e.get('start','')} to {e.get('end','')}). "

    exp_lines: List[str] = []
    for w in (app.get("experience") or []):
        exp_lines.append(
            f"{w.get('title','')} at {w.get('company','')} ({w.get('start','')} to {w.get('end','') or 'present'}). { _get_text_content(w.get('description')) or '' }"
        )

    cand_skills = _flatten_applicant_skills(app)
    cv_text = (
        f"Education: {edu_line}"
        f"Experience: " + " ".join(exp_lines) + " "
        f"Skills: {', '.join(cand_skills)}."
    )
    return cv_text, cand_skills


def _semantic_sim(a: str, b: str) -> float:
    model = _get_model()
    if not model or model is False:
        # Fallback when embedding model cannot be loaded
        return 0.0
    # encode returns normalized vectors if normalize_embeddings=True
    ea = model.encode(a, normalize_embeddings=True)
    eb = model.encode(b, normalize_embeddings=True)
    # Manual cosine (inputs normalized -> cosine == dot)
    try:
        # ea, eb are 1D numpy arrays
        return float((ea * eb).sum())
    except Exception:
        return 0.0


def _soft_constraints_penalty(jd: Dict[str, Any], app: Dict[str, Any]) -> Tuple[float, List[str]]:
    notes: List[str] = []
    penalty = 0.0

    # degree / major
    target_deg = (jd.get("degree") or "").lower()
    target_major = (jd.get("major") or "").lower()
    edu_title = ((app.get("education") or [{}])[0] or {}).get("title", "").lower()
    if target_deg and target_deg not in edu_title:
        penalty += 0.03
        notes.append("degree differs")
    if target_major and target_major not in edu_title:
        penalty += 0.05
        notes.append("major differs")

    # CGPA
    rec = jd.get("recommended_cgpa")
    got = (app.get("personal") or {}).get("cgpa")
    if isinstance(rec, (int, float)) and isinstance(got, (int, float)) and got < rec:
        gap = rec - got
        penalty += min(0.08, 0.04 + 0.04 * gap)
        notes.append("cgpa below recommendation")

    # Location (if non-remote)
    if not jd.get("is_remote") and jd.get("location"):
        cand_city = ((app.get("education") or [{}])[0] or {}).get("city", "").lower()
        jd_city = str(jd.get("location") or "").lower()
        if jd_city and jd_city not in cand_city:
            penalty += 0.04
            notes.append("location likely mismatch (non-remote)")

    # Deadline (past postings)
    try:
        y, m, d = map(int, str(jd.get("deadline") or "1970-01-01").split("-"))
        days_left = (date(y, m, d) - date.today()).days
        if days_left < 0:
            penalty += 0.05
            notes.append("deadline passed")
    except Exception:
        pass

    return min(penalty, 0.2), notes


def score_match(payload: Dict[str, Any]) -> Dict[str, Any]:
    jd = payload["internship"]
    app = payload["applicant"]

    jd_text = _canonicalize_jd(jd)
    cv_text, cand_skills = _canonicalize_cv(app)

    req_cov, matched_req, missing_req = _coverage(jd.get("required_skills", []) or [], cand_skills)
    opt_cov, matched_opt, _ = _coverage(jd.get("optional_skills", []) or [], cand_skills)

    sem_skills = _semantic_sim(
        "Skills: " + ", ".join([*(jd.get("required_skills", []) or []), *(jd.get("optional_skills", []) or [])]),
        "Skills: " + ", ".join(cand_skills),
    )
    sem_overall = _semantic_sim(jd_text, cv_text)

    penalty, notes = _soft_constraints_penalty(jd, app)

    base = 0.45 * req_cov + 0.15 * opt_cov + 0.20 * sem_skills + 0.20 * sem_overall
    final_score = max(0.0, min(1.0, base - penalty))

    return {
        "final_score": round(final_score, 3),
        "components": {
            "required_coverage": round(req_cov, 3),
            "optional_coverage": round(opt_cov, 3),
            "semantic_skills": round(sem_skills, 3),
            "semantic_overall": round(sem_overall, 3),
            "constraint_penalty": round(penalty, 3),
        },
        "explanations": {
            "matched_required": matched_req,
            "matched_optional": matched_opt,
            "missing_required": missing_req,
            "notes": notes,
        },
    }


__all__ = [
    "score_match",
]


