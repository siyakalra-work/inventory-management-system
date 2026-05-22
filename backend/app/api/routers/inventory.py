from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_tenant_id
from app.db.session import get_db
from app.models.inventory_transaction import InventoryTransaction
from app.models.product import Product
from app.models.user import User
from app.schemas.inventory import TransactionCreate, TransactionOut

router = APIRouter(prefix="/inventory", tags=["inventory"])


@router.post("/transactions", response_model=TransactionOut, status_code=201)
def create_transaction(
    payload: TransactionCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_tenant_id),
    user: User = Depends(get_current_user),
) -> InventoryTransaction:
    product = db.query(Product).filter(Product.tenant_id == tenant_id, Product.id == payload.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    sign = 1 if payload.type in ("stock_in", "adjustment") else -1
    quantity = payload.quantity * sign
    txn = InventoryTransaction(
        tenant_id=tenant_id,
        product_id=payload.product_id,
        user_id=user.id,
        type=payload.type,
        quantity=quantity,
        note=payload.note,
    )
    db.add(txn)
    db.commit()
    db.refresh(txn)
    return txn


@router.get("/transactions", response_model=list[TransactionOut])
def list_transactions(
    product_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_tenant_id),
) -> list[InventoryTransaction]:
    q = db.query(InventoryTransaction).filter(InventoryTransaction.tenant_id == tenant_id)
    if product_id is not None:
        q = q.filter(InventoryTransaction.product_id == product_id)
    return q.order_by(InventoryTransaction.id.desc()).limit(200).all()


@router.get("/stock/{product_id}")
def get_stock(
    product_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_tenant_id),
) -> dict:
    product = db.query(Product).filter(Product.tenant_id == tenant_id, Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    total = (
        db.query(InventoryTransaction)
        .filter(InventoryTransaction.tenant_id == tenant_id, InventoryTransaction.product_id == product_id)
        .with_entities((InventoryTransaction.quantity).label("q"))
        .all()
    )
    stock = sum((row.q for row in total), 0)
    return {"product_id": product_id, "stock": stock, "reorder_point": product.reorder_point}

