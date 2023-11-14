package org.springframework.samples.petclinic.slotInfo;



import org.springframework.samples.petclinic.crewmate.Role;
import org.springframework.samples.petclinic.model.BaseEntity;
import org.springframework.samples.petclinic.shelterCard.ShelterCard;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

@Entity
public class SlotInfo extends BaseEntity{ 

    @NotNull
    @Min(0)
    @Max(4)
    Integer position;

    @NotNull
    Role role;

    @NotNull
    Boolean roleNeeded;

    @ManyToOne
    @NotEmpty
    ShelterCard shelter;
    
}
