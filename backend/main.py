from fastapi import FastAPI
from fastapi import UploadFile
from fastapi import File
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from fastapi.security import OAuth2PasswordBearer

from fastapi.middleware.cors import CORSMiddleware

from fastapi.responses import StreamingResponse

from dotenv import load_dotenv

from openai import OpenAI

from pypdf import PdfReader

from sqlalchemy.orm import Session

import chromadb
import shutil
import os

from jose import jwt
from jose import JWTError

from database import (
    SessionLocal,
    engine
)

from models import (
    Base,
    User
)

Base.metadata.create_all(bind=engine)

from auth import (
    hash_password,
    verify_password,
    create_access_token,
    SECRET_KEY,
    ALGORITHM
)

from schemas import (
    RegisterSchema,
    LoginSchema
)

# Load ENV
load_dotenv()

# OpenRouter Client
client = OpenAI(
    api_key=os.getenv(
        "OPENROUTER_API_KEY"
    ),
    base_url=
    "https://openrouter.ai/api/v1"
)

# FastAPI App
app = FastAPI()

# Create DB Tables
Base.metadata.create_all(
    bind=engine
)

# Database Session
def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()

# CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )




app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=False,

    allow_methods=["*"],

    allow_headers=["*"]

)


# Upload Folder
UPLOAD_DIR = "uploads"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)

# ChromaDB
chroma_client = chromadb.PersistentClient(
    path="chroma_db"
)

collection = (
    chroma_client
    .get_or_create_collection(
        name="rag_collection"
    )
)

# Home API
@app.get("/")
def home():

    return {
        "message":
        "Enterprise AI Running"
    }

# =========================
# USER DEPENDENCY
# =========================

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="login"
)

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

# =========================
# AUTH APIs
# =========================

# Register
@app.post("/register")
def register(
    user: RegisterSchema
):

    db = SessionLocal()

    # Existing Email
    existing_user = (
        db.query(User)
        .filter(
            User.email == user.email
        )
        .first()
    )

    if existing_user:

        return {
            "error":
            "Email already exists"
        }

    # Hash Password
    hashed_password = (
        hash_password(
            user.password
        )
    )

    # Create User
    new_user = User(
        name=user.name,
        email=user.email,
        password=hashed_password
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {
        "message":
        "User registered successfully"
    }

# Login
@app.post("/login")
def login(
    user: LoginSchema
):

    db = SessionLocal()

    db_user = (
        db.query(User)
        .filter(
            User.email == user.email
        )
        .first()
    )

    # Invalid Email
    if not db_user:

        return {
            "error":
            "Invalid email"
        }

    # Invalid Password
    if not verify_password(
        user.password,
        db_user.password
    ):

        return {
            "error":
            "Invalid password"
        }

    # JWT Token
    token = create_access_token({

        "user_id": db_user.id,
        "email": db_user.email

    })

    return {

        "access_token": token,

        "user": {

            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email
        }
    }

# =========================
# EMBEDDINGS
# =========================

# Generate Embeddings
def get_embeddings(texts):

    response = (
        client.embeddings.create(
            model=
            "openai/text-embedding-3-small",
            input=texts
        )
    )

    return [
        item.embedding
        for item in response.data
    ]

# =========================
# PDF Upload
# =========================

@app.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):

    try:

        # Save File
        user_dir = os.path.join(
            UPLOAD_DIR,
            str(current_user.id)
        )
        
        os.makedirs(user_dir, exist_ok=True)
        
        file_path = os.path.join(
            user_dir,
            file.filename
        )

        with open(
            file_path,
            "wb"
        ) as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

        # Read PDF
        reader = PdfReader(file_path)

        full_text = ""

        for page in reader.pages:

            text = page.extract_text()

            if text:

                full_text += text

        # Chunking
        chunk_size = 800

        overlap = 200

        chunks = []

        start = 0

        while start < len(full_text):

            end = start + chunk_size

            chunk = full_text[start:end]

            chunks.append(chunk)

            start += (
                chunk_size - overlap
            )

        # Embeddings
        embeddings = (
            get_embeddings(chunks)
        )

        # Store in ChromaDB
        collection.add(

            documents=chunks,

            embeddings=embeddings,

            metadatas=[{"user_id": current_user.id} for _ in chunks],

            ids=[
                f"{current_user.id}_{file.filename}_{i}"
                for i in range(
                    len(chunks)
                )
            ]
        )

        return {

            "message":
            "PDF uploaded successfully",

            "total_pages":
            len(reader.pages),

            "chunks_created":
            len(chunks)
        }

    except Exception as e:

        return {
            "error": str(e)
        }

# =========================
# ASK AI
# =========================

@app.post("/ask")
async def ask_question(
    question: str,
    current_user: User = Depends(get_current_user)
):

    try:

        # Question Embedding
        question_embedding = (
            get_embeddings(
                [question]
            )[0]
        )

        # Search
        results = collection.query(

            query_embeddings=[
                question_embedding
            ],

            n_results=10,
            
            where={"user_id": current_user.id}
        )

        retrieved_docs = (
            results["documents"][0]
        )

        # Context
        context = "\n\n".join(
            retrieved_docs
        )

        # Prompt
        prompt = f"""
        You are a highly intelligent AI assistant.

        Use ONLY the provided context to answer the question.

        If information is unavailable,
        say:
        "Information not found."

        Context:
        {context}

        Question:
        {question}
        """

        # Stream Response
        def generate():

            stream = (
                client.chat.completions.create(

                    model=
                    "openai/gpt-4o-mini",

                    messages=[

                        {
                            "role": "system",
                            "content":
                            "You are a RAG assistant."
                        },

                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],

                    temperature=0.2,

                    stream=True
                )
            )

            for chunk in stream:

                if (
                    chunk.choices[0]
                    .delta.content
                ):

                    yield (
                        chunk.choices[0]
                        .delta.content
                    )

        return StreamingResponse(
            generate(),
            media_type="text/plain"
        )

    except Exception as e:

        return {
            "error": str(e)
        }

# =========================
# DOCUMENTS
# =========================

# Get Documents
@app.get("/documents")
def get_documents(
    current_user: User = Depends(get_current_user)
):

    try:

        user_dir = os.path.join(
            UPLOAD_DIR,
            str(current_user.id)
        )
        
        if not os.path.exists(user_dir):
            return {"documents": []}

        files = os.listdir(
            user_dir
        )

        pdf_files = [

            file for file in files

            if file.endswith(".pdf")
        ]

        return {
            "documents": pdf_files
        }

    except Exception as e:

        return {
            "error": str(e)
        }

# Delete Document
@app.delete(
    "/delete-document/{filename}"
)
def delete_document(
    filename: str,
    current_user: User = Depends(get_current_user)
):

    try:

        # File Path
        user_dir = os.path.join(
            UPLOAD_DIR,
            str(current_user.id)
        )
        
        file_path = os.path.join(
            user_dir,
            filename
        )

        # Delete PDF
        if os.path.exists(file_path):

            os.remove(file_path)

        # Delete Vectors
        all_ids = (
            collection.get()["ids"]
        )

        delete_ids = [

            id for id in all_ids

            if id.startswith(f"{current_user.id}_{filename}")
        ]

        if delete_ids:

            collection.delete(
                ids=delete_ids
            )

        return {
            "message":
            f"{filename} deleted successfully"
        }

    except Exception as e:

        return {
            "error": str(e)
        }