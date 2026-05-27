"""
Simple token estimation before sending to Claude.
Uses ~4 chars per token as a rough average for English/code.
"""

CHARS_PER_TOKEN = 4
MAX_CONTEXT_TOKENS = 180_000  # claude-sonnet-4-20250514 context window
SAFE_PROMPT_TOKENS = 12_000   # Leave room for instructions + response


def estimate_tokens(text: str) -> int:
    """Estimate token count from character count."""
    return max(1, len(text) // CHARS_PER_TOKEN)


def truncate_to_budget(text: str, max_tokens: int = SAFE_PROMPT_TOKENS) -> str:
    """Trim text so it fits within the token budget."""
    max_chars = max_tokens * CHARS_PER_TOKEN
    if len(text) <= max_chars:
        return text
    truncated = text[:max_chars]
    return truncated + "\n\n... [diff truncated to fit context window] ..."


def fits_in_context(diff: str, instructions_tokens: int = 500) -> bool:
    """Return True if diff + instructions fit in Claude's context."""
    return (estimate_tokens(diff) + instructions_tokens) < MAX_CONTEXT_TOKENS
