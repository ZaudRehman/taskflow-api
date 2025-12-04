from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.session import get_db
from api.deps import get_current_user
from models.user import User
from models.category import Category
from schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from core.exceptions import NotFoundException, ForbiddenException, ConflictException
from uuid import UUID

router = APIRouter()


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category_data: CategoryCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new category."""
    # Check if category name already exists for user
    result = await db.execute(
        select(Category).where(
            Category.user_id == current_user.id,
            Category.name == category_data.name
        )
    )
    if result.scalar_one_or_none():
        raise ConflictException("Category with this name already exists")
    
    new_category = Category(
        user_id=current_user.id,
        name=category_data.name,
        color=category_data.color,
        description=category_data.description
    )
    
    db.add(new_category)
    await db.commit()
    await db.refresh(new_category)
    
    return new_category


@router.get("", response_model=list[CategoryResponse])
async def list_categories(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List all categories for authenticated user."""
    result = await db.execute(
        select(Category).where(Category.user_id == current_user.id).order_by(Category.name)
    )
    categories = result.scalars().all()
    
    return categories


@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(
    category_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific category by ID."""
    result = await db.execute(select(Category).where(Category.id == category_id))
    category = result.scalar_one_or_none()
    
    if not category:
        raise NotFoundException("Category not found")
    
    if category.user_id != current_user.id:
        raise ForbiddenException("You don't have permission to access this category")
    
    return category


@router.patch("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: UUID,
    category_data: CategoryUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a category."""
    result = await db.execute(select(Category).where(Category.id == category_id))
    category = result.scalar_one_or_none()
    
    if not category:
        raise NotFoundException("Category not found")
    
    if category.user_id != current_user.id:
        raise ForbiddenException("You don't have permission to update this category")
    
    # Check for name conflict if name is being updated
    if category_data.name and category_data.name != category.name:
        result = await db.execute(
            select(Category).where(
                Category.user_id == current_user.id,
                Category.name == category_data.name
            )
        )
        if result.scalar_one_or_none():
            raise ConflictException("Category with this name already exists")
    
    # Update only provided fields
    update_data = category_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(category, field, value)
    
    await db.commit()
    await db.refresh(category)
    
    return category


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a category."""
    result = await db.execute(select(Category).where(Category.id == category_id))
    category = result.scalar_one_or_none()
    
    if not category:
        raise NotFoundException("Category not found")
    
    if category.user_id != current_user.id:
        raise ForbiddenException("You don't have permission to delete this category")
    
    await db.delete(category)
    await db.commit()
    
    return None
