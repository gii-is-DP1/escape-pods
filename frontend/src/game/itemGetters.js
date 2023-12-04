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


}
const itemGetters = new ItemGetters();
export default itemGetters;
