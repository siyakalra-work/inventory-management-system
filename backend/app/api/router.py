from __future__ import annotations

from fastapi import APIRouter

from app.api.routers import auth, inventory, products, tenants

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth.router)
api_router.include_router(tenants.router)
api_router.include_router(products.router)
api_router.include_router(inventory.router)

