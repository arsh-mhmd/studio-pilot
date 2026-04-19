from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import crud
import schemas
import auth
import models

router = APIRouter(prefix="/api/projects", tags=["projects"])

@router.post("/", response_model=schemas.ProjectResponse, status_code=201)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.create_project(db=db, project=project, user_id=current_user.id)

@router.get("/", response_model=List[schemas.ProjectResponse])
def read_projects(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.get_projects_by_user(db, user_id=current_user.id)

@router.get("/{project_id}", response_model=schemas.ProjectResponse)
def read_project(project_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    project = crud.get_project(db, project_id=project_id, user_id=current_user.id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project
