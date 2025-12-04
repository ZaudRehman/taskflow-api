from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.session import get_db
from core.security import decode_token
from core.exceptions import AuthenticationException
from models.user import User
from typing import Optional
from uuid import UUID

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Dependency to get current authenticated user."""
    token = credentials.credentials
    payload = decode_token(token)
    
    if payload is None:
        raise AuthenticationException("Invalid token")
    
    if payload.get("type") != "access":
        raise AuthenticationException("Invalid token type")
    
    user_id_str = payload.get("sub")
    if user_id_str is None:
        raise AuthenticationException("Token missing user information")
    
    try:
        user_id = UUID(user_id_str)
    except ValueError:
        raise AuthenticationException("Invalid user ID in token")
    
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if user is None:
        raise AuthenticationException("User not found")
    
    return user
