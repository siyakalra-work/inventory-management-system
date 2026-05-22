from __future__ import annotations

from pydantic import BaseModel


class TenantOut(BaseModel):
    id: int
    name: str
    slug: str
    is_active: bool

    model_config = {"from_attributes": True}


class TenantCreate(BaseModel):
    name: str
    slug: str
    is_active: bool = True
