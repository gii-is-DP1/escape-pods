import itemGetters from "../game/itemGetters";

class ScoringFunction {
    async getScores(gameId, jwt) {
        const gamePlayers = await itemGetters.fetchGamePlayers(gameId, jwt);
        const crewmates = await itemGetters.fetchCrewmates(gameId, jwt);
        const shelterCards = await itemGetters.fetchShelterCards(gameId, jwt);
        const slotInfos = await itemGetters.fetchSlotInfos(gameId, jwt);
        console.log(slotInfos)
        console.log(shelterCards)
        console.log(crewmates)
        console.log(gamePlayers)

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


        console.log(asignments)
        const sortedPlayerScores = Object.entries(playerScores)
            .sort(([, a], [, b]) => b - a)
            .reduce((ac, [key, value]) => ({ ...ac, [key]: value }), {});
        return sortedPlayerScores;
    }
}
const scoringFunction = new ScoringFunction();
export default scoringFunction;