from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/repos", tags=["repositories"])


class ConnectRepoRequest(BaseModel):
    owner: str
    repo: str


class RepoResponse(BaseModel):
    id: str
    full_name: str


# In-memory store for demo (replace with DB in production)
_connected_repos: dict[str, RepoResponse] = {}


@router.post("/connect", response_model=RepoResponse)
async def connect_repo(body: ConnectRepoRequest):
    full_name = f"{body.owner}/{body.repo}"
    repo = RepoResponse(id=full_name, full_name=full_name)
    _connected_repos[full_name] = repo
    return repo


@router.get("", response_model=list[RepoResponse])
async def list_repos():
    return list(_connected_repos.values())
