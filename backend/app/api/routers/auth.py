from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from jose import JWTError
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.db.session import get_db
from app.models.tenant import Tenant
from app.models.user import User
from app.schemas.auth import LoginRequest, RefreshRequest, RegisterRequest, TokenPair
from app.schemas.user import UserOut
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenPair, status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> TokenPair:
    if db.query(Tenant).filter(Tenant.slug == payload.tenant_slug).first():
        raise HTTPException(status_code=409, detail="Tenant slug already exists")
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=409, detail="Email already exists")

    tenant = Tenant(name=payload.tenant_name, slug=payload.tenant_slug, is_active=True)
    db.add(tenant)
    db.flush()

    user = User(
        tenant_id=tenant.id,
        email=payload.email,
        full_name=payload.full_name,
        password_hash=hash_password(payload.password),
        role="retailer_admin",
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return TokenPair(
        access_token=create_access_token(subject=str(user.id), tenant_id=user.tenant_id, role=user.role),
        refresh_token=create_refresh_token(subject=str(user.id), tenant_id=user.tenant_id, role=user.role),
    )


@router.post("/login", response_model=TokenPair)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenPair:
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not user.is_active or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    return TokenPair(
        access_token=create_access_token(subject=str(user.id), tenant_id=user.tenant_id, role=user.role),
        refresh_token=create_refresh_token(subject=str(user.id), tenant_id=user.tenant_id, role=user.role),
    )


@router.post("/refresh", response_model=TokenPair)
def refresh(payload: RefreshRequest) -> TokenPair:
    try:
        data = decode_token(payload.refresh_token)
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    if data.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
    subject = data.get("sub")
    return TokenPair(
        access_token=create_access_token(subject=str(subject), tenant_id=data.get("tenant_id"), role=data.get("role")),
        refresh_token=create_refresh_token(subject=str(subject), tenant_id=data.get("tenant_id"), role=data.get("role")),
    )


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)) -> User:
    return user
