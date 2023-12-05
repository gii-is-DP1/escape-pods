class ItemGetters {
    async fetchSectors(gameId, jwt) {
        const response = await fetch("/api/v1/sectors?gameid=" + gameId, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET"
        })
        const fetchedSectors = await response.json();
        return fetchedSectors
    }

    async fetchBeacons(gameId, jwt) {
        const response = await fetch("/api/v1/beacons?gameid=" + gameId, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET"
        })
        const fetchedBeacons = await response.json();
        return fetchedBeacons
    }

    async fetchedLines(gameId, jwt) {
        const response = await fetch("/api/v1/lines?gameid=" + gameId, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET"
        })
        const fetchedLines = await response.json();
        return fetchedLines
    }

    async fetchPods(gameId, jwt) {
        const response = await fetch("/api/v1/pods?gameid=" + gameId, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET"
        })
        const fetchedPods = await response.json();
        return fetchedPods
    }

    async fetchCrewmates(gameId, jwt) {
        const response = await fetch("/api/v1/crewmates?gameid=" + gameId, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET"
        })
        const fetchedCrewmates = await response.json();
        return fetchedCrewmates
    }

    async fetchGamePlayers(gameId, jwt) {
        const response = await fetch("/api/v1/gamePlayers?gameid=" + gameId, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET"
        })
        const fetchedGamePlayers = await response.json();
        return fetchedGamePlayers
    }

    async fetchShelterCards(gameId, jwt) {
        const response = await fetch("/api/v1/shelterCards?gameid=" + gameId, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET"
        })
        const fetchedShelterCards = await response.json();
        return fetchedShelterCards
    }

    async fetchedSlotInfos(gameId, jwt) {
        const response = await fetch("/api/v1/slotInfos?gameid=" + gameId, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET"
        })
        const fetchedSlotInfos = await response.json();
        return fetchedSlotInfos
    }

}
const itemGetters = new ItemGetters();
export default itemGetters;
