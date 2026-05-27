from fastapi import APIRouter, HTTPException, Query


from app.schemas.pr import PRListItem, PRDetail
from app.services.github_service import github_service

router = APIRouter(prefix="/prs", tags=["pull_requests"])


@router.get("", response_model=list[PRListItem])
async def list_prs(
    repo: str = Query(..., description="Repository in owner/name format"),
    state: str = Query("open"),
):
    try:
        owner, name = repo.split("/", 1)
        return await github_service.get_pull_requests(owner, name, state)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid repo format. Use owner/name")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/{number}", response_model=PRDetail)
async def get_pr(
    number: int,
    repo: str = Query(..., description="Repository in owner/name format"),
):
    try:
        owner, name = repo.split("/", 1)
        return await github_service.get_pr_detail(owner, name, number)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid repo format. Use owner/name")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
