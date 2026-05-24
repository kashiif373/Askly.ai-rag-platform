from pydantic import BaseModel

# Register Schema
class RegisterSchema(BaseModel):

    name: str
    email: str
    password: str

# Login Schema
class LoginSchema(BaseModel):

    email: str
    password: str