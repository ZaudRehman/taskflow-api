from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.session import get_db
from schemas.user import UserCreate, UserResponse
from schemas.auth import LoginRequest, TokenResponse, RefreshTokenRequest
from models.user import User
from core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token
)
from core.exceptions import ConflictException, AuthenticationException
from config.settings import settings
from utils.rate_limiter import limiter


router = APIRouter()


@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
@limiter.limit(f"{settings.LOGIN_RATE_LIMIT}/hour")
async def register(
    request: Request,
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """Register a new user."""
    # Check if username exists
    result = await db.execute(select(User).where(User.username == user_data.username))
    if result.scalar_one_or_none():
        raise ConflictException("Username already registered")
    
    # Check if email exists
    result = await db.execute(select(User).where(User.email == user_data.email))
    if result.scalar_one_or_none():
        raise ConflictException("Email already registered")
    
    # Create new user
    hashed_password = hash_password(user_data.password)
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed_password,
        first_name=user_data.first_name,
        last_name=user_data.last_name
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    return {
        "message": "User registered successfully",
        "userId": str(new_user.id),
        "email": new_user.email
    }


@router.post("/login", response_model=TokenResponse)
@limiter.limit(f"{settings.LOGIN_RATE_LIMIT}/15 minutes")
async def login(
    request: Request,
    login_data: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    """Authenticate user and return JWT tokens."""
    # Find user by email
    result = await db.execute(select(User).where(User.email == login_data.email))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(login_data.password, user.password_hash):
        raise AuthenticationException("Incorrect email or password")
    
    # Create tokens
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="Bearer",
        expires_in=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user={
            "id": str(user.id),
            "username": user.username,
            "email": user.email,
            "firstName": user.first_name,
            "lastName": user.last_name
        }
    )


@router.post("/refresh", response_model=dict)
async def refresh_token(
    refresh_data: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
):
    """Refresh access token using refresh token."""
    payload = decode_token(refresh_data.refresh_token)
    
    if payload is None:
        raise AuthenticationException("Invalid refresh token")
    
    if payload.get("type") != "refresh":
        raise AuthenticationException("Invalid token type")
    
    user_id = payload.get("sub")
    if user_id is None:
        raise AuthenticationException("Token missing user information")
    
    # Create new access token
    new_access_token = create_access_token(data={"sub": user_id})
    
    return {
        "accessToken": new_access_token,
        "tokenType": "Bearer",
        "expiresIn": settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }


@router.post("/logout")
async def logout():
    """Logout user (client should discard tokens)."""
    return {"message": "Successfully logged out"}
