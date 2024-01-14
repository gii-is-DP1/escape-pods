package org.springframework.samples.petclinic.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import org.springframework.samples.petclinic.model.BaseEntity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "authorities")
public class Authorities extends BaseEntity {

	@Column(length = 20)
	String authority;

}
