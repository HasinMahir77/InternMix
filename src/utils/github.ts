type Repo = {
  name: string;
  language: string | null;
};

type Output = {
  languages: string[]; // unique list
  repos: string[];     // repo names
  repoLanguageMap: Record<string, string>; // repo:language mapping
};

export async function getUserReposSummary(
  username: string,
  token?: string
): Promise<Output> {
  const url = `https://api.github.com/users/${encodeURIComponent(
    username
  )}/repos?per_page=100&page=1`;

  const res = await fetch(url, {
    headers: {
      "Accept": "application/vnd.github+json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${text}`);
  }

  const reposData = (await res.json()) as Repo[];

  const repos = reposData.map(r => r.name).sort((a, b) => a.localeCompare(b));

  const languages = Array.from(
    new Set(
      reposData
        .map(r => r.language)
        .filter((x): x is string => !!x) // drop nulls
    )
  ).sort((a, b) => a.localeCompare(b));

  // Create repo:language mapping
  const repoLanguageMap: Record<string, string> = {};
  reposData.forEach(repo => {
    if (repo.language) {
      repoLanguageMap[repo.name] = repo.language;
    }
  });

  return { languages, repos, repoLanguageMap };
}

// Extract username from GitHub URL
export function extractUsernameFromUrl(githubUrl: string): string | null {
  try {
    const url = new URL(githubUrl);
    if (url.hostname === 'github.com') {
      const pathParts = url.pathname.split('/').filter(part => part);
      return pathParts[0] || null;
    }
  } catch (error) {
    // Invalid URL
  }
  return null;
}


