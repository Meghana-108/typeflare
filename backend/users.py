from fastapi import APIRouter, HTTPException, Depends
from models import RegisterUser, LoginUser, UserOut
from auth import hash_password, verify_password, create_access_token, decode_access_token
from fastapi.security import OAuth2PasswordBearer
from datetime import timedelta

router = APIRouter()

# Simulated in-memory "DB"
fake_users_db = []

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/register")
def register(user: RegisterUser):
    for u in fake_users_db:
        if u["username"] == user.username or u["email"] == user.email:
            raise HTTPException(status_code=400, detail="Username or email already exists")
    
    user_dict = {
        "username": user.username,
        "email": user.email,
        "hashed_password": hash_password(user.password)
    }
    fake_users_db.append(user_dict)
    return {"message": "User registered successfully"}

@router.post("/login")
def login(user: LoginUser):
    for u in fake_users_db:
        if u["username"] == user.username:
            if verify_password(user.password, u["hashed_password"]):
                token = create_access_token({"sub": u["username"]})
                return {"access_token": token, "token_type": "bearer"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@router.get("/me")
def get_me(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    username = payload.get("sub")
    user = next((u for u in fake_users_db if u["username"] == username), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"username": user["username"], "email": user["email"]}
