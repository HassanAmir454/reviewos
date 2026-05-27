from typing import Any, Literal
from pydantic import BaseModel


class WSMessage(BaseModel):
    type: str
    data: dict[str, Any]
