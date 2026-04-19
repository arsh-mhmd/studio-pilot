from fastapi import FastAPI
from database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
from routers import auth_router, project_router, stripe_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Studio Pilot API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(project_router.router)
app.include_router(stripe_router.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Studio Pilot API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
