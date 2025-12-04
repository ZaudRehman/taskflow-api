from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from database.session import get_db
from api.deps import get_current_user
from models.user import User
from models.task import Task, TaskStatus, TaskPriority
from schemas.task import TaskCreate, TaskUpdate, TaskResponse, TaskListResponse
from core.exceptions import NotFoundException, ForbiddenException
from typing import Optional
from uuid import UUID
from math import ceil

router = APIRouter()


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new task."""
    new_task = Task(
        user_id=current_user.id,
        title=task_data.title,
        description=task_data.description,
        status=task_data.status,
        priority=task_data.priority,
        due_date=task_data.due_date,
        category_id=task_data.category_id
    )
    
    db.add(new_task)
    await db.commit()
    await db.refresh(new_task, ["category"])
    
    return new_task


@router.get("", response_model=TaskListResponse)
async def list_tasks(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[TaskStatus] = None,
    priority: Optional[TaskPriority] = None,
    category_id: Optional[UUID] = None,
    sort_by: str = Query("created_at", regex="^(created_at|due_date|priority)$"),
    order: str = Query("desc", regex="^(asc|desc)$"),
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List all tasks for authenticated user with filtering and pagination."""
    # Build query
    query = select(Task).where(Task.user_id == current_user.id)
    
    # Apply filters
    if status:
        query = query.where(Task.status == status)
    if priority:
        query = query.where(Task.priority == priority)
    if category_id:
        query = query.where(Task.category_id == category_id)
    if search:
        search_term = f"%{search}%"
        query = query.where(
            or_(
                Task.title.ilike(search_term),
                Task.description.ilike(search_term)
            )
        )
    
    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total_items = total_result.scalar()
    
    # Apply sorting
    order_column = getattr(Task, sort_by)
    if order == "desc":
        query = query.order_by(order_column.desc())
    else:
        query = query.order_by(order_column.asc())
    
    # Apply pagination
    offset = (page - 1) * limit
    query = query.offset(offset).limit(limit)
    
    # Execute query
    result = await db.execute(query)
    tasks = result.scalars().all()
    
    # Calculate pagination metadata
    total_pages = ceil(total_items / limit) if total_items > 0 else 0
    
    return TaskListResponse(
        tasks=tasks,
        pagination={
            "currentPage": page,
            "totalPages": total_pages,
            "totalItems": total_items,
            "itemsPerPage": limit
        }
    )


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific task by ID."""
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    
    if not task:
        raise NotFoundException("Task not found")
    
    if task.user_id != current_user.id:
        raise ForbiddenException("You don't have permission to access this task")
    
    return task


@router.patch("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: UUID,
    task_data: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a task."""
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    
    if not task:
        raise NotFoundException("Task not found")
    
    if task.user_id != current_user.id:
        raise ForbiddenException("You don't have permission to update this task")
    
    # Update only provided fields
    update_data = task_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)
    
    await db.commit()
    await db.refresh(task, ["category"])
    
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a task."""
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    
    if not task:
        raise NotFoundException("Task not found")
    
    if task.user_id != current_user.id:
        raise ForbiddenException("You don't have permission to delete this task")
    
    await db.delete(task)
    await db.commit()
    
    return None
