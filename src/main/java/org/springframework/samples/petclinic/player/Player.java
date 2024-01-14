package org.springframework.samples.petclinic.player;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.samples.petclinic.model.BaseEntity;
import org.springframework.samples.petclinic.user.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "players")
public class Player extends BaseEntity {

	@Column(name = "profile_description")
	@NotEmpty
	@Size(max = 80)
	private String profileDescription;

	@Lob
	@Column(name = "profile_picture", columnDefinition = "TEXT")
	@NotEmpty
	private String profilePicture;

	@OneToOne(cascade = { CascadeType.DETACH, CascadeType.REFRESH, CascadeType.PERSIST, CascadeType.REMOVE })
	@JoinColumn(name = "user_id", referencedColumnName = "id")
	@OnDelete(action = OnDeleteAction.CASCADE)
	private User user;
}
