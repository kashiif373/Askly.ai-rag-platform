from datetime import datetime
from datetime import timedelta

from jose import jwt
from passlib.context import CryptContext

# Secret Key
SECRET_KEY = "enterprise_ai_secret"

# Algorithm
ALGORITHM = "HS256"

# Token Expiry
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

# Password Hashing
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

# Hash Password
def hash_password(password: str):

    return pwd_context.hash(password)

# Verify Password
def verify_password(
    plain_password,
    hashed_password
):

    return pwd_context.verify(
        plain_password,
        hashed_password
    )

# Create JWT Token
def create_access_token(data: dict):

    to_encode = data.copy()

    expire = (
        datetime.utcnow() +
        timedelta(
            minutes=
            ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    to_encode.update({
        "exp": expire
    })

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt