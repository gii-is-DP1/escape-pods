package org.springframework.scapePods.beacon;
import org.springframework.samples.petclinic.model.BaseEntity;
import org.springframework.scapePods.enums.Color;

import jakarta.persistence.Entity;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@EqualsAndHashCode(of="id")
public class Beacon extends BaseEntity {
    Color color1;
    Color color2;
}
