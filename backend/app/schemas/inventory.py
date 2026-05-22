from __future__ import annotations

from pydantic import BaseModel, Field


class TransactionCreate(BaseModel):
    product_id: int
    type: str = Field(pattern=r"^(stock_in|stock_out|adjustment)$")
    quantity: int = Field(ge=1)
    note: str | None = None


class TransactionOut(BaseModel):
    id: int
    product_id: int
    user_id: int | None
    type: str
    quantity: int
    note: str | None

    model_config = {"from_attributes": True}

