from __future__ import annotations

from pydantic import BaseModel, EmailStr


class UserOut(BaseModel):
    id: int
    tenant_id: int | None
    email: EmailStr
    full_name: str | None
    role: str
    is_active: bool

    model_config = {"from_attributes": True}

