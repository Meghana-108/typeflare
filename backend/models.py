from pydantic import BaseModel
from typing import Optional

# Request body schemas
class RegisterUser(BaseModel):
    username: str
    email: str
    password: str

class LoginUser(BaseModel):
    username: str
    password: str

# Response schema
class UserOut(BaseModel):
    username: str
    email: str
