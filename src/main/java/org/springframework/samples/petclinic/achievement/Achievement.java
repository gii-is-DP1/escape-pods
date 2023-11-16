package org.springframework.samples.petclinic.achievement;

import org.springframework.samples.petclinic.model.BaseEntity;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;

@Entity
public class Achievement extends BaseEntity{
    @NotNull
    String name;
    @NotNull
    String description;
    @NotNull
    String picture;
    @NotNull
    AchievementType type;
    @NotNull
    Integer milestone;
    
}
