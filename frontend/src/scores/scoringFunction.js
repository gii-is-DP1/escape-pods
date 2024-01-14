import itemGetters from "../game/itemGetters";

class ScoringFunction {
    async getScores(gameId, jwt) {
        const gamePlayers = await itemGetters.fetchGamePlayers(gameId, jwt);
        const crewmates = await itemGetters.fetchCrewmates(gameId, jwt);
        const shelterCards = await itemGetters.fetchShelterCards(gameId, jwt);
        const slotInfos = await itemGetters.fetchSlotInfos(gameId, jwt);

        let asignments = shelterCards.reduce((ac, shelterCard) => {
            ac[shelterCard.id] = slotInfos.filter(slotInfo => slotInfo.shelter.id === shelterCard.id)
                .reduce((ac, slotInfo) => {
                    ac[slotInfo.id] = null
                    return ac;
                }, {});
            return ac;
        }, {});

        const playerScores = gamePlayers.reduce((ac, gamePlayer) => {
            const username = gamePlayer.player.user.username;
            ac[username] = 0;
            return ac;
        }, {});

        function setAssignmentEntry(crewmate, shelter) {
            const validSlots = slotInfos.filter(slotInfo => slotInfo.shelter
                && !asignments[shelter.id][slotInfo.id] && (slotInfo.shelter.id === shelter.id) && (slotInfo.role === crewmate.role));
            if (validSlots.length > 0) {
                const bestSlot = validSlots.reduce((max, slot) => slot.slotScore > max.slotScore ? slot : max, validSlots[0]);
                let maxScore = bestSlot.slotScore;
                asignments[shelter.id][bestSlot.id] = [crewmate.id, maxScore];
            }
        }

        for (const shelterCard of shelterCards) {
            const sortedShelterCrewmates = crewmates.filter(crewmate => crewmate.shelterCard && (crewmate.shelterCard.id === shelterCard.id))
                .sort((a, b) => a.arrivalOrder - b.arrivalOrder);
            for (const crewmate of sortedShelterCrewmates) {
                if (crewmate.shelterCard && (crewmate.shelterCard.id === shelterCard.id)) {
                    setAssignmentEntry(crewmate, shelterCard);
                }
            }
        }

        //special refuges
        for (const shelterCard of shelterCards) {
            if (shelterCard.type === "BLUE") {
                let specialSlots = slotInfos.filter(slotInfo => slotInfo.shelter.id === shelterCard.id).map(slotInfo => slotInfo.id).slice(0, 2);
                if (asignments[shelterCard.id][specialSlots[0]] && asignments[shelterCard.id][specialSlots[1]]) {
                    blueModifier(shelterCard);
                }
            } else if (shelterCard.type === "YELLOW") {
                let specialSlots = slotInfos.filter(slotInfo => slotInfo.shelter.id === shelterCard.id).map(slotInfo => slotInfo.id).slice(1, 3);
                if (!asignments[shelterCard.id][specialSlots[0]] || !asignments[shelterCard.id][specialSlots[1]]) {
                    yellowModifier(shelterCard);
                }
            } else if (shelterCard.type === "ORANGE") {
                let specialSlots = slotInfos.filter(slotInfo => slotInfo.shelter.id === shelterCard.id).map(slotInfo => slotInfo.id)[2];
                if (!asignments[shelterCard.id][specialSlots]) {
                    orangeModifier(shelterCard);
                }
            } else if (shelterCard.type === "GREEN") {
                greenModifier(shelterCard);
            }
        }

        function blueModifier(shelter) {
            for (const slotId of Object.keys(asignments[shelter.id])) {
                if (asignments[shelter.id][slotId]) {
                    asignments[shelter.id][slotId][1] = asignments[shelter.id][slotId][1] + 1;
                }
            }
        }

        function yellowModifier(shelter) {
            for (const slotId of Object.keys(asignments[shelter.id])) {
                if (asignments[shelter.id][slotId]) {
                    asignments[shelter.id][slotId][1] = 0;
                }
            }
        }

        function orangeModifier(shelter) {
            for (const slotId of Object.keys(asignments[shelter.id])) {
                if (asignments[shelter.id][slotId]) {
                    asignments[shelter.id][slotId][1] = asignments[shelter.id][slotId][1] - 1;
                }
            }
        }

        function greenModifier(shelter) {
            let numberOfDistinctPlayers = new Set(crewmates.filter(crewmate => crewmate.shelterCard && (crewmate.shelterCard.id === shelter.id)).map(crewmate => crewmate.player.id)).size;
            for (const slotId of Object.keys(asignments[shelter.id])) {
                if (asignments[shelter.id][slotId]) {
                    asignments[shelter.id][slotId][1] = asignments[shelter.id][slotId][1] + numberOfDistinctPlayers;
                }
            }
        }

        for (const shelterId of Object.keys(asignments)) {
            for (const slotId of Object.keys(asignments[shelterId])) {
                if (asignments[shelterId][slotId]) {
                    const crewmateId = asignments[shelterId][slotId][0];
                    const crewmate = crewmates.find(crewmate => crewmate.id === crewmateId);
                    const username = crewmate.player.player.user.username;
                    const score = asignments[shelterId][slotId][1];
                    playerScores[username] += score;
                }
            }
        }

        let sortedPlayerScores = Object.entries(playerScores)
            .sort(([, a], [, b]) => b - a)
            .reduce((ac, [key, value]) => ({ ...ac, [key]: value }), {});

        //tie breakers
        function getNumberOfShelterCrewmates(username) {
            return crewmates.filter(crewmate => crewmate.shelterCard && crewmate.player.player.user.username === username).length;
        }

        function getNumberOfAssignments(username) {
            return Object.keys(asignments).reduce((ac, shelterId) => {
                return ac + Object.keys(asignments[shelterId]).reduce((ac, slotId) => {
                    if (asignments[shelterId][slotId] && (crewmates.find(crewmate => crewmate.id === asignments[shelterId][slotId][0]).player.player.user.username === username)) {
                        return ac + 1;
                    }
                    return ac;
                }, 0);
            }, 0);
        }

        function getNumberOfDifferentShelters(username) {
            return new Set(crewmates.filter(crewmate => crewmate.shelterCard && crewmate.player.player.user.username === username).map(crewmate => crewmate.shelterCard.id)).size;
        }

        if (sortedPlayerScores[Object.keys(sortedPlayerScores)[0]] === sortedPlayerScores[Object.keys(sortedPlayerScores)[1]]) {
            let tieBreakerScores = Object.entries(sortedPlayerScores)
                .sort(([, a], [, b]) => getNumberOfShelterCrewmates(b) - getNumberOfShelterCrewmates(a))
                .reduce((ac, [key, value]) => ({ ...ac, [key]: value }), {});

            if (getNumberOfShelterCrewmates(Object.keys(tieBreakerScores)[0]) === getNumberOfShelterCrewmates(Object.keys(tieBreakerScores)[1])) {
                tieBreakerScores = Object.entries(tieBreakerScores)
                    .sort(([, a], [, b]) => getNumberOfAssignments(b) - getNumberOfAssignments(a))
                    .reduce((ac, [key, value]) => ({ ...ac, [key]: value }), {});

                if (getNumberOfAssignments(Object.keys(tieBreakerScores)[0]) === getNumberOfAssignments(Object.keys(tieBreakerScores)[1])) {
                    tieBreakerScores = Object.entries(tieBreakerScores)
                        .sort(([, a], [, b]) => getNumberOfDifferentShelters(b) - getNumberOfDifferentShelters(a))
                        .reduce((ac, [key, value]) => ({ ...ac, [key]: value }), {});
                }
            }
            sortedPlayerScores = tieBreakerScores;
        }

        return sortedPlayerScores;
    }
}
const scoringFunction = new ScoringFunction();
export default scoringFunction;