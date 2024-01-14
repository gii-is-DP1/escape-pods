package org.springframework.samples.petclinic.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;


import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.samples.petclinic.auth.payload.request.SignupRequest;
import org.springframework.samples.petclinic.clinic.Clinic;
import org.springframework.samples.petclinic.clinic.ClinicService;
import org.springframework.samples.petclinic.clinic.PricingPlan;
import org.springframework.samples.petclinic.clinicowner.ClinicOwner;
import org.springframework.samples.petclinic.clinicowner.ClinicOwnerService;
import org.springframework.samples.petclinic.owner.OwnerService;
import org.springframework.samples.petclinic.user.AuthoritiesService;
import org.springframework.samples.petclinic.user.User;
import org.springframework.samples.petclinic.user.UserService;
import org.springframework.samples.petclinic.vet.VetService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;


@SpringBootTest
public class AuthServiceTests {

	@Autowired
	protected AuthService authService;
	@Autowired
	protected UserService userService;
	@Autowired
	protected VetService vetService;
	@Autowired
	protected OwnerService ownerService;
	@Autowired
	protected ClinicService clinicService;
	@Autowired
	protected ClinicOwnerService clinicOwnerService;
	@Autowired
	protected AuthoritiesService authoritiesService;

	@Test
	@Transactional
	public void shouldCreateAdminUser() {
		Pageable paging;
        paging = PageRequest.of(0, 10);
		SignupRequest request = createRequest("ADMIN", "admin2");
		int userFirstCount = ( this.userService.findAll(paging)).size();
		this.authService.createUser(request);
		int userLastCount = ( this.userService.findAll(paging)).size();
		assertEquals(userFirstCount + 1, userLastCount);
	}
	
	private SignupRequest createRequest(String auth, String username) {
		SignupRequest request = new SignupRequest();
		request.setAddress("prueba");
		request.setAuthority(auth);
		request.setCity("prueba");
		request.setFirstName("prueba");
		request.setLastName("prueba");
		request.setPassword("prueba");
		request.setTelephone("123123123");
		request.setUsername(username);

		if(auth == "OWNER" || auth == "VET") {
			User clinicOwnerUser = new User();
			clinicOwnerUser.setUsername("clinicOwnerTest");
			clinicOwnerUser.setPassword("clinicOwnerTest");
			clinicOwnerUser.setAuthority(authoritiesService.findByAuthority("CLINIC_OWNER"));
			userService.saveUser(clinicOwnerUser);
			ClinicOwner clinicOwner = new ClinicOwner();
			Clinic clinic = new Clinic();
			clinicOwner.setFirstName("Test Name");
			clinicOwner.setLastName("Test Surname");
			clinicOwner.setUser(clinicOwnerUser);
			clinicOwnerService.saveClinicOwner(clinicOwner);
			clinic.setName("Clinic Test");
			clinic.setAddress("Test Address");
			clinic.setPlan(PricingPlan.PLATINUM);
			clinic.setTelephone("123456789");
			clinic.setClinicOwner(clinicOwner);
			clinicService.save(clinic);
			request.setClinic(clinic);
		}

		return request;
	}

}
