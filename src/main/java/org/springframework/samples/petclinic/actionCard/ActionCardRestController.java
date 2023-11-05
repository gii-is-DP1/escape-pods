package org.springframework.samples.petclinic.actionCard;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.samples.petclinic.game.GameService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/actionCard")
@Tag(name = "ActionCards", description = "API for the  management of actionCards.")
@SecurityRequirement(name = "bearerAuth")
public class ActionCardRestController {

    ActionCardService acs;

    @Autowired
    public ActionCardRestController(ActionCardService acs){
        this.acs=acs;
    }
    
}
