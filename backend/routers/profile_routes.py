from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

import schemas
from database import get_db
from models import User, Skill, Project, Experience, Education
from routers.user import get_current_user

# --- Router Setup ---
router = APIRouter(
    prefix="/api/profile",
    tags=["Profile Management"]
)

# Helper function to get a profile item by ID
def get_profile_item(db: Session, model, item_id: int, user_id: int):
    item = db.query(model).filter(
        model.user_id == user_id, 
        getattr(model, f"{model.__tablename__[:-1]}_id" if model.__tablename__.endswith('s') else f"{model.__tablename__}_id") == item_id
    ).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{model.__name__} not found")
    return item

# --- Skills Endpoints ---

@router.post("/skills", response_model=schemas.SkillSchema, status_code=status.HTTP_201_CREATED)
def add_skill_to_profile(
    skill_data: schemas.SkillBase,  # Corrected from SkillCreate
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_skill = Skill(**skill_data.model_dump(), user_id=current_user.user_id)
    db.add(new_skill)
    db.commit()
    db.refresh(new_skill)
    return new_skill

@router.put("/skills/{skill_id}", response_model=schemas.SkillSchema)
def update_skill_in_profile(
    skill_id: int,
    skill_data: schemas.SkillBase, # Corrected from SkillCreate
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    skill_to_update = get_profile_item(db, Skill, skill_id, current_user.user_id)
    skill_to_update.skill_name = skill_data.skill_name
    skill_to_update.proficiency = skill_data.proficiency
    db.commit()
    db.refresh(skill_to_update)
    return skill_to_update

@router.delete("/skills/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill_from_profile(
    skill_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    skill_to_delete = get_profile_item(db, Skill, skill_id, current_user.user_id)
    db.delete(skill_to_delete)
    db.commit()
    return

# --- Projects Endpoints ---

@router.post("/projects", response_model=schemas.ProjectSchema, status_code=status.HTTP_201_CREATED)
def add_project_to_profile(
    project_data: schemas.ProjectBase, # Corrected from ProjectCreate
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_project = Project(**project_data.model_dump(), user_id=current_user.user_id)
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

# --- Experience Endpoints ---

@router.post("/experience", response_model=schemas.ExperienceSchema, status_code=status.HTTP_201_CREATED)
def add_experience_to_profile(
    experience_data: schemas.ExperienceBase, # Corrected from ExperienceCreate
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_experience = Experience(**experience_data.model_dump(), user_id=current_user.user_id)
    db.add(new_experience)
    db.commit()
    db.refresh(new_experience)
    return new_experience

# --- Education Endpoints ---

@router.post("/education", response_model=schemas.EducationSchema, status_code=status.HTTP_201_CREATED)
def add_education_to_profile(
    education_data: schemas.EducationBase, # Corrected from EducationCreate
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_education = Education(**education_data.model_dump(), user_id=current_user.user_id)
    db.add(new_education)
    db.commit()
    db.refresh(new_education)
    return new_education

