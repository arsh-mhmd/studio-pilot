from typing import List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from database import get_db, SessionLocal
import crud
import schemas
import auth
import models
import asyncio

router = APIRouter(prefix="/api/projects", tags=["projects"])

async def mock_ai_generation_task(project_id: int):
    """Mocks the workflow of AI voice and video generation"""
    await asyncio.sleep(8) 
    db = SessionLocal()
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if project:
        project.status = "Completed"
        project.video_url = "https://www.w3schools.com/html/mov_bbb.mp4" 
        db.commit()
    db.close()

@router.post("/", response_model=schemas.ProjectResponse, status_code=201)
def create_project(project: schemas.ProjectCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_project = crud.create_project(db=db, project=project, user_id=current_user.id)
    background_tasks.add_task(mock_ai_generation_task, db_project.id)
    return db_project

@router.get("/", response_model=List[schemas.ProjectResponse])
def read_projects(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.get_projects_by_user(db, user_id=current_user.id)

@router.get("/{project_id}", response_model=schemas.ProjectResponse)
def read_project(project_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    project = crud.get_project(db, project_id=project_id, user_id=current_user.id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project
