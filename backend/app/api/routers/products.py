from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_tenant_id
from app.db.session import get_db
from app.models.product import Product
from app.models.user import User
from app.schemas.product import ProductCreate, ProductOut, ProductUpdate

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/", response_model=list[ProductOut])
def list_products(
    q: str | None = Query(default=None, max_length=200),
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_tenant_id),
) -> list[Product]:
    query = db.query(Product).filter(Product.tenant_id == tenant_id)
    if q:
        like = f"%{q}%"
        query = query.filter((Product.name.ilike(like)) | (Product.sku.ilike(like)))
    return query.order_by(Product.id.desc()).all()


@router.post("/", response_model=ProductOut, status_code=201)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_tenant_id),
) -> Product:
    if db.query(Product).filter(Product.tenant_id == tenant_id, Product.sku == payload.sku).first():
        raise HTTPException(status_code=409, detail="SKU already exists")
    product = Product(tenant_id=tenant_id, **payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.get("/{product_id}", response_model=ProductOut)
def get_product(
    product_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_tenant_id),
) -> Product:
    product = db.query(Product).filter(Product.tenant_id == tenant_id, Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Not found")
    return product


@router.patch("/{product_id}", response_model=ProductOut)
def update_product(
    product_id: int,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_tenant_id),
) -> Product:
    product = db.query(Product).filter(Product.tenant_id == tenant_id, Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Not found")
    data = payload.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(product, k, v)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=204)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_tenant_id),
) -> None:
    product = db.query(Product).filter(Product.tenant_id == tenant_id, Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(product)
    db.commit()
    return Response(status_code=204)
