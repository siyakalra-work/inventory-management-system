from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import require_role
from app.db.session import get_db
from app.models.tenant import Tenant
from app.schemas.tenant import TenantCreate, TenantOut

router = APIRouter(prefix="/tenants", tags=["tenants"])


@router.get("/", response_model=list[TenantOut], dependencies=[Depends(require_role("super_admin"))])
def list_tenants(db: Session = Depends(get_db)) -> list[Tenant]:
    return db.query(Tenant).order_by(Tenant.id.asc()).all()


@router.post("/", response_model=TenantOut, status_code=201, dependencies=[Depends(require_role("super_admin"))])
def create_tenant(payload: TenantCreate, db: Session = Depends(get_db)) -> Tenant:
    if db.query(Tenant).filter(Tenant.slug == payload.slug).first():
        raise HTTPException(status_code=409, detail="Tenant slug already exists")
    tenant = Tenant(name=payload.name, slug=payload.slug, is_active=payload.is_active)
    db.add(tenant)
    db.commit()
    db.refresh(tenant)
    return tenant
