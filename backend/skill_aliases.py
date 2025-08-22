from __future__ import annotations

from typing import Dict, List


"""
Canonical skill sets and aliases used for normalized matching across CVs and JDs.

Usage:
- Keep canonical keys lowercase
- Add as many variants as needed under each canonical key
"""

CANONICAL_TO_ALIASES: Dict[str, List[str]] = {
    # Web frameworks / libraries
    "react": ["react", "reactjs", "react.js", "react js"],
    "next.js": ["next.js", "nextjs", "next js", "next"],
    "vue": ["vue", "vuejs", "vue.js", "vue js"],
    "angular": ["angular", "angularjs", "angular.js", "angular js", "ng"],

    # Languages
    "javascript": ["javascript", "js", "ecmascript", "es6", "es2015"],
    "typescript": ["typescript", "ts"],
    "python": ["python", "py"],
    "java": ["java"],
    "cpp": ["cpp", "c++", "c plus plus"],
    "csharp": ["csharp", "c#", "c sharp"],
    "go": ["go", "golang"],
    "ruby": ["ruby"],
    "php": ["php"],
    "swift": ["swift"],
    "kotlin": ["kotlin"],
    "rust": ["rust"],

    # Back-end frameworks
    "express": ["express", "expressjs", "express.js"],
    "fastapi": ["fastapi", "fast api"],
    "django": ["django", "django rest", "drf"],
    "flask": ["flask", "flask rest", "flaskrest"],
    "spring boot": ["spring boot", "springboot"],
    "dotnet": [".net", "dotnet", "asp.net", "aspnet"],

    # Styling / UI
    "tailwind": ["tailwind", "tailwindcss", "tailwind css"],
    "bootstrap": ["bootstrap", "bootstrap 5", "bootstrap5", "bootstrap 4", "bootstrap4"],
    "material ui": ["material ui", "mui", "material-ui"],
    "chakra ui": ["chakra ui", "chakra-ui", "chakra"],

    # Databases
    "postgresql": ["postgresql", "postgres", "postgre sql", "pg"],
    "mysql": ["mysql", "my sql"],
    "mongodb": ["mongodb", "mongo", "mongo db"],
    "sqlserver": ["sqlserver", "ms sql", "mssql", "microsoft sql server"],
    "sqlite": ["sqlite", "sqlite3"],
    "redis": ["redis"],
    "elasticsearch": ["elasticsearch", "elastic search", "es"],

    # Cloud / DevOps
    "amazon web services": ["amazon web services", "aws", "amazon web service"],
    "google cloud": ["google cloud", "gcp", "google cloud platform"],
    "azure": ["azure", "microsoft azure", "azure devops"],
    "kubernetes": ["kubernetes", "k8s", "kube"],
    "docker": ["docker"],
    "cicd": ["cicd", "ci/cd", "ci cd"],
    "terraform": ["terraform"],
    "github actions": ["github actions", "gh actions"],

    # Data / ML
    "numpy": ["numpy"],
    "pandas": ["pandas"],
    "tensorflow": ["tensorflow", "tf"],
    "pytorch": ["pytorch", "torch"],
    "scikit-learn": ["scikit-learn", "sklearn", "scikit learn"],
    "xgboost": ["xgboost", "xgb"],
    "lightgbm": ["lightgbm", "lgbm"],
    "matplotlib": ["matplotlib", "mpl"],
    "seaborn": ["seaborn"],

    # Tools
    "git": ["git"],
    "github": ["github", "git hub"],
    "gitlab": ["gitlab", "gitlab ci"],
    "jira": ["jira"],

    # Markup / Styling
    "html": ["html", "html5"],
    "css": ["css", "css3"],
    "sass": ["sass", "scss"],
}


# Build reverse lookup: alias -> canonical
REVERSE_ALIAS_MAP: Dict[str, str] = {}
for canonical, variants in CANONICAL_TO_ALIASES.items():
    for v in variants:
        REVERSE_ALIAS_MAP[v.lower().strip()] = canonical


def normalize_skill(skill: str) -> str:
    """Normalize a skill token to its canonical label using alias sets.

    - Lowercases and trims the input
    - Uses REVERSE_ALIAS_MAP to map variants to canonical keys
    - Falls back to the cleaned token if unknown
    """
    cleaned = (skill or "").lower().strip()
    return REVERSE_ALIAS_MAP.get(cleaned, cleaned)


__all__ = ["CANONICAL_TO_ALIASES", "normalize_skill"]


