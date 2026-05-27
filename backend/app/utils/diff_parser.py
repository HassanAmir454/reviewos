from dataclasses import dataclass, field


@dataclass
class DiffFile:
    filename: str
    status: str          # added | modified | removed | renamed
    additions: int
    deletions: int
    patch: str


def parse_diff(raw_diff: str) -> list[DiffFile]:
    """Parse a unified diff string into a list of DiffFile objects."""
    files: list[DiffFile] = []
    current_file: str | None = None
    current_status = 'modified'
    additions = 0
    deletions = 0
    patch_lines: list[str] = []

    def flush():
        if current_file is not None:
            files.append(DiffFile(
                filename=current_file,
                status=current_status,
                additions=additions,
                deletions=deletions,
                patch='\n'.join(patch_lines),
            ))

    for line in raw_diff.splitlines():
        if line.startswith('diff --git'):
            flush()
            current_file = None
            additions = 0
            deletions = 0
            patch_lines = []
            current_status = 'modified'
        elif line.startswith('+++ b/'):
            current_file = line[6:]
        elif line.startswith('--- /dev/null'):
            current_status = 'added'
        elif line.startswith('+++ /dev/null'):
            current_status = 'removed'
        elif line.startswith('+') and not line.startswith('+++'):
            additions += 1
            patch_lines.append(line)
        elif line.startswith('-') and not line.startswith('---'):
            deletions += 1
            patch_lines.append(line)
        else:
            patch_lines.append(line)

    flush()
    return files
