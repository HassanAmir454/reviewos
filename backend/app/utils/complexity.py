import re
from dataclasses import dataclass

# Decision points per language
DECISION_KEYWORDS = {
    '.py':   [r'\bif\b', r'\belif\b', r'\bfor\b', r'\bwhile\b', r'\bexcept\b', r'\bwith\b', r'\band\b', r'\bor\b'],
    '.ts':   [r'\bif\b', r'\belse\b', r'\bfor\b', r'\bwhile\b', r'\bcatch\b', r'\bcase\b', r'&&', r'\|\|', r'\?[^:]'],
    '.tsx':  [r'\bif\b', r'\belse\b', r'\bfor\b', r'\bwhile\b', r'\bcatch\b', r'&&', r'\|\|', r'\?[^:]'],
    '.js':   [r'\bif\b', r'\belse\b', r'\bfor\b', r'\bwhile\b', r'\bcatch\b', r'&&', r'\|\|', r'\?[^:]'],
    '.jsx':  [r'\bif\b', r'\belse\b', r'\bfor\b', r'\bwhile\b', r'\bcatch\b', r'&&', r'\|\|', r'\?[^:]'],
    '.go':   [r'\bif\b', r'\bfor\b', r'\bcase\b', r'\bselect\b', r'&&', r'\|\|'],
    '.rs':   [r'\bif\b', r'\bfor\b', r'\bwhile\b', r'\bmatch\b', r'\bloop\b', r'&&', r'\|\|'],
    '.java': [r'\bif\b', r'\bfor\b', r'\bwhile\b', r'\bcatch\b', r'\bcase\b', r'&&', r'\|\|', r'\?'],
    '.rb':   [r'\bif\b', r'\bunless\b', r'\bfor\b', r'\bwhile\b', r'\brescue\b', r'&&', r'\|\|'],
}


@dataclass
class ComplexityResult:
    total_score: float          # 1-10 normalised
    decision_points: int
    file_breakdown: dict[str, float]


def _get_extension(filename: str) -> str:
    for ext in DECISION_KEYWORDS:
        if filename.endswith(ext):
            return ext
    return '.js'  # default fallback


def _count_decisions(code_lines: list[str], ext: str) -> int:
    patterns = DECISION_KEYWORDS.get(ext, DECISION_KEYWORDS['.js'])
    count = 1  # Base path = 1
    for line in code_lines:
        for pattern in patterns:
            count += len(re.findall(pattern, line))
    return count


def calculate_complexity(diff: str) -> ComplexityResult:
    """
    Parse unified diff and compute cyclomatic complexity
    for added lines only (new code introduced by this PR).
    Returns a normalised 1–10 score.
    """
    file_breakdown: dict[str, float] = {}
    current_file = 'unknown'
    current_ext = '.js'
    added_lines: list[str] = []

    for raw in diff.splitlines():
        if raw.startswith('+++ b/'):
            if added_lines:
                decisions = _count_decisions(added_lines, current_ext)
                file_breakdown[current_file] = _normalise(decisions)
            current_file = raw[6:]
            current_ext = _get_extension(current_file)
            added_lines = []
        elif raw.startswith('+') and not raw.startswith('+++'):
            added_lines.append(raw[1:])

    # flush last file
    if added_lines:
        decisions = _count_decisions(added_lines, current_ext)
        file_breakdown[current_file] = _normalise(decisions)

    if not file_breakdown:
        return ComplexityResult(total_score=1.0, decision_points=0, file_breakdown={})

    avg = sum(file_breakdown.values()) / len(file_breakdown)
    total_decisions = sum(_count_decisions([], '.js') for _ in file_breakdown)

    return ComplexityResult(
        total_score=round(avg, 2),
        decision_points=total_decisions,
        file_breakdown=file_breakdown,
    )


def _normalise(decisions: int) -> float:
    """Map raw decision count to 1–10 scale."""
    if decisions <= 2:
        return 1.0
    if decisions >= 50:
        return 10.0
    return round(1 + (decisions - 2) * (9 / 48), 2)
