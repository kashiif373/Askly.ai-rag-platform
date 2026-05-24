from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import Text

from database import Base

# =========================
# USERS TABLE
# =========================

class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(255)
    )

    email = Column(
        String(255),
        unique=True
    )

    password = Column(
        String(255)
    )

# =========================
# CHATS TABLE
# =========================

class Chat(Base):

    __tablename__ = "chats"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    title = Column(
        String(255)
    )

# =========================
# MESSAGES TABLE
# =========================

class Message(Base):

    __tablename__ = "messages"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    chat_id = Column(
        Integer,
        ForeignKey("chats.id")
    )

    role = Column(
        String(50)
    )

    content = Column(Text)

# =========================
# DOCUMENTS TABLE
# =========================

class Document(Base):

    __tablename__ = "documents"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    filename = Column(
        String(255)
    )