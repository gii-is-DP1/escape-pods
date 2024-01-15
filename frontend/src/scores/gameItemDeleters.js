class ItemDeleters {
    async deleteSectors(gameId, jwt) {
        await fetch("/api/v1/sectors?gameid=" + gameId, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "DELETE"
        })
    }

    async deleteBeacons(gameId, jwt) {
        await fetch("/api/v1/beacons?gameid=" + gameId, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "DELETE"
        })
    }

    async deleteLines(gameId, jwt) {
        await fetch("/api/v1/lines?gameid=" + gameId, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "DELETE"
        })
    }

    async deletePods(gameId, jwt) {
        await  fetch("/api/v1/pods?gameid=" + gameId, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "DELETE"
        })
    }

    async deleteCrewmates(gameId, jwt) {
        await fetch("/api/v1/crewmates?gameid=" + gameId, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "DELETE"
        })
    }

    async deleteGamePlayers(gameId, jwt) {
        await fetch("/api/v1/gamePlayers?gameid=" + gameId, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "DELETE"
        })
    }

    async deleteShelterCards(gameId, jwt) {
        await fetch("/api/v1/shelterCards?gameid=" + gameId, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "DELETE"
        })
    }

    async deleteSlotInfos(gameId, jwt) {
        await fetch("/api/v1/slotInfos?gameid=" + gameId, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "DELETE"
        })
    }

    async deleteAll(gameId, jwt) {
        await this.deleteSlotInfos(gameId, jwt);
        await this.deleteCrewmates(gameId, jwt);
        await this.deletePods(gameId, jwt);
        await this.deleteShelterCards(gameId, jwt);
        await this.deleteSectors(gameId, jwt);
        await this.deleteGamePlayers(gameId, jwt);
        await this.deleteLines(gameId, jwt);
        await this.deleteBeacons(gameId, jwt);
    }
}
const itemDeleters = new ItemDeleters();
export default itemDeleters;