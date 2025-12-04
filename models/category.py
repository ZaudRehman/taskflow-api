from sqlalchemy import Column, String, Text, UUID, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from database.base import Base, TimestampMixin
import uuid


class Category(Base, TimestampMixin):
    __tablename__ = "categories"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    color = Column(String(7), nullable=True)  # Hex color code
    description = Column(Text, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="categories")
    tasks = relationship("Task", back_populates="category")
    
    __table_args__ = (
        UniqueConstraint('user_id', 'name', name='unique_user_category'),
    )
