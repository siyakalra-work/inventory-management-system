from __future__ import annotations

from decimal import Decimal

from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    sku: str = Field(min_length=1, max_length=100)
    name: str = Field(min_length=1, max_length=255)
    description: str | None = None
    category: str | None = Field(default=None, max_length=100)
    unit_cost: Decimal | None = None
    reorder_point: int = Field(default=0, ge=0)


class ProductUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    category: str | None = Field(default=None, max_length=100)
    unit_cost: Decimal | None = None
    reorder_point: int | None = Field(default=None, ge=0)


class ProductOut(BaseModel):
    id: int
    sku: str
    name: str
    description: str | None
    category: str | None
    unit_cost: Decimal | None
    reorder_point: int

    model_config = {"from_attributes": True}

