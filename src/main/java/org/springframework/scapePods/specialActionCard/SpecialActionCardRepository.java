package org.springframework.scapePods.specialActionCard;

import org.springframework.stereotype.Repository;

import org.springframework.data.repository.CrudRepository;

@Repository
public interface SpecialActionCardRepository extends CrudRepository<SpecialActionCard, Integer> {
    //el repositorio nos aporta varios metodos prehechos que no hacen falta implemetar con el findbyPlayerId

    //la unica opercion de lectura que necesitamos es la que nos relaciona un player con la card
    SpecialActionCard findByPlayerId(Integer id);
    //TODO OPERACION PENDIENTE DE DOTAR DE FUNCIONALIDAD
}
