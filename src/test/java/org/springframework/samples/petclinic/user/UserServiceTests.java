package org.springframework.samples.petclinic.user;

import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.owner.Owner;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@SpringBootTest
@AutoConfigureTestDatabase
class UserServiceTests {

	@Autowired
	private UserService userService;

	@Autowired
	private AuthoritiesService authService;

	@Test
	@WithMockUser(username = "owner1", password = "0wn3r")
	void shouldFindCurrentUser() {
		User user = this.userService.findCurrentUser();
		assertEquals("owner1", user.getUsername());
	}

	@Test
	@WithMockUser(username = "prueba")
	void shouldNotFindCorrectCurrentUser() {
		assertThrows(ResourceNotFoundException.class, () -> this.userService.findCurrentUser());
	}

	@Test
	void shouldNotFindAuthenticated() {
		assertThrows(ResourceNotFoundException.class, () -> this.userService.findCurrentUser());
	}

	@Test
	void shouldFindAllUsers() {

		Pageable paging = PageRequest.of(0, 19);
		List<User> users = (List<User>) this.userService.findAll(paging);
		assertEquals(19, users.size());
	}

	@Test
	void shouldFindUsersByUsername() {
		List<User> user = this.userService.findUserToList("owner1");
		assertEquals("owner1", user.get(0).getUsername());
	}

	@Test
	void shouldFindUsersByAuthority() {
		Pageable paging = PageRequest.of(0, 10);
		List<User> owners = (List<User>) this.userService.findAllByAuthority("OWNER", paging);
		assertEquals(10, owners.size());

		List<User> admins = (List<User>) this.userService.findAllByAuthority("ADMIN", paging);
		assertEquals(1, admins.size());

		List<User> vets = (List<User>) this.userService.findAllByAuthority("VET", paging);
		assertEquals(6, vets.size());
	}

	@Test
	void shouldNotFindUserByIncorrectUsername() {
		assertThrows(ResourceNotFoundException.class, () -> this.userService.findUserToList("usernotexists"));
	}

	@Test
	void shouldFindSingleOwnerByUsername() {
		Owner owner = this.userService.findOwnerByUser("owner1");
		assertEquals("owner1", owner.getUser().getUsername());
	}

	@Test
	void shouldNotFindSingleOwnerWithBadUsername() {
		assertThrows(ResourceNotFoundException.class, () -> this.userService.findOwnerByUser("badusername"));
	}

	@Test
	void shouldFindSingleOwnerByUserId() {
		Owner owner = this.userService.findOwnerByUser(4);
		assertEquals("owner1", owner.getUser().getUsername());
	}

	@Test
	void shouldNotFindSingleUserOwnerWithBadUserId() {
		assertThrows(ResourceNotFoundException.class, () -> this.userService.findOwnerByUser(100));
	}

	@Test
	void shouldFindSingleUser() {
		User user = this.userService.findUser(4);
		assertEquals("owner1", user.getUsername());
	}

	@Test
	void shouldNotFindSingleUserWithBadID() {
		assertThrows(ResourceNotFoundException.class, () -> this.userService.findUser(100));
	}

	@Test
	void shouldExistUser() {
		assertEquals(true, this.userService.existsUser("owner1"));
	}

	@Test
	void shouldNotExistUser() {
		assertEquals(false, this.userService.existsUser("owner10000"));
	}

	@Test
	@Transactional
	void shouldUpdateUser() {
		User user = this.userService.findUser(2);
		user.setUsername("Change");
		userService.updateUser(user, 2);
		user = this.userService.findUser(2);
		assertEquals("Change", user.getUsername());
	}

	@Test
	@Transactional
	void shouldInsertUser() {
		User user = new User();
		user.setUsername("Sam");
		user.setPassword("password");
		user.setAuthority(authService.findByAuthority("ADMIN"));

		userService.saveUser(user);
		assertNotEquals(0, user.getId().longValue());
		assertNotNull(user.getId());
		assertEquals("Sam", user.getUsername());

	}

}
