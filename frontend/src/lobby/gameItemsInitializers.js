class GameItemsInitializers {
    createBeacons(game, jwt) {
        let beacons = []
        const beacon1 = {
            color1: "YELLOW",
            color2: "PINK",
            game: game
        }
        beacons.push(beacon1);

        const beacon2 = {
            color1: "PINK",
            color2: "BLUE",
            game: game
        }
        beacons.push(beacon2);

        const beacon3 = {
            color1: "YELLOW",
            color2: "BLUE",
            game: game
        }
        beacons.push(beacon3);

        const beacon4 = {
            color1: "BLACK",
            color2: "PINK",
            game: game
        }
        beacons.push(beacon4);

        const beacon5 = {
            color1: "BLACK",
            color2: "WHITE",
            game: game
        }
        beacons.push(beacon5);

        const beacon6 = {
            color1: "BLACK",
            color2: "YELLOW",
            game: game
        }
        beacons.push(beacon6);

        const beacon7 = {
            color1: "WHITE",
            color2: "BLUE",
            game: game
        }
        beacons.push(beacon7);

        const beacon8 = {
            color1: "WHITE",
            color2: "YELLOW",
            game: game
        }
        beacons.push(beacon8);

        const beacon9 = {
            color1: "BLACK",
            color2: "BLUE",
            game: game
        }
        beacons.push(beacon9);

        const beacon10 = {
            color1: "WHITE",
            color2: "PINK",
            game: game
        }
        beacons.push(beacon10);
        for (let i = 0; i < beacons.length; i++) {
            fetch("/api/v1/beacons", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
                method: "POST",
                body: JSON.stringify(beacons[i])
            })
        }
    }

    createLines(game, jwt) {
        let n = 1;
        for (let i = 0; i < 26; i++) {
            const i = {
                game: game,
                number: n
            }
            fetch("/api/v1/lines", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
                method: "POST",
                body: JSON.stringify(i)
            })
            n = n + 1;
        }
    }

    async getLines(game,jwt){
        const fetchedLines = await fetch("/api/v1/lines?gameid=" + game.id, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET",
        })
        return await fetchedLines.json()
    }

    async createSectors(game, jwt) {
        const lines = await this.getLines(game, jwt)
        let sectors = []

        const sector1 = {
            number: 1,
            scrap: false,
            lines: [lines.find(line => line.number === 1),
            lines.find(line => line.number === 4),
            lines.find(line => line.number === 5)],
            game: game
        }
        sectors.push(sector1)

        const sector2 = {
            number: 2,
            scrap: false,
            lines: [lines.find(line => line.number === 1),
            lines.find(line => line.number === 2),
            lines.find(line => line.number === 3)],
            game: game
        }
        sectors.push(sector2)

        const sector3 = {
            number: 3,
            scrap: false,
            lines: [lines.find(line => line.number === 3),
            lines.find(line => line.number === 6),
            lines.find(line => line.number === 7)],
            game: game
        }
        sectors.push(sector3)

        const sector4 = {
            number: 4,
            scrap: false,
            lines: [lines.find(line => line.number === 4),
            lines.find(line => line.number === 8),
            lines.find(line => line.number === 10),
            lines.find(line => line.number === 11)],
            game: game
        }
        sectors.push(sector4)

        const sector5 = {
            number: 5,
            scrap: false,
            lines: [lines.find(line => line.number === 2),
            lines.find(line => line.number === 5),
            lines.find(line => line.number === 6),
            lines.find(line => line.number === 8),
            lines.find(line => line.number === 9),
            lines.find(line => line.number === 12)],
            game: game
        }
        sectors.push(sector5)

        const sector6 = {
            number: 6,
            scrap: false,
            lines: [lines.find(line => line.number === 7),
            lines.find(line => line.number === 9),
            lines.find(line => line.number === 13),
            lines.find(line => line.number === 14)],
            game: game
        }
        sectors.push(sector6)

        const sector7 = {
            number: 7,
            scrap: false,
            lines: [lines.find(line => line.number === 10),
            lines.find(line => line.number === 15),
            lines.find(line => line.number === 18),
            lines.find(line => line.number === 19)],
            game: game
        }
        sectors.push(sector7)

        const sector8 = {
            number: 8,
            scrap: false,
            lines: [lines.find(line => line.number === 12),
            lines.find(line => line.number === 11),
            lines.find(line => line.number === 13),
            lines.find(line => line.number === 15),
            lines.find(line => line.number === 16),
            lines.find(line => line.number === 17)],
            game: game
        }
        sectors.push(sector8)

        const sector9 = {
            number: 9,
            scrap: false,
            lines: [lines.find(line => line.number === 14),
            lines.find(line => line.number === 17),
            lines.find(line => line.number === 20),
            lines.find(line => line.number === 21)],
            game: game
        }
        sectors.push(sector9)

        const sector10 = {
            number: 10,
            scrap: false,
            lines: [lines.find(line => line.number === 16),
            lines.find(line => line.number === 19),
            lines.find(line => line.number === 20),
            lines.find(line => line.number === 22),
            lines.find(line => line.number === 23),
            lines.find(line => line.number === 24)],
            game: game
        }
        sectors.push(sector10)

        const sector11 = {
            number: 11,
            scrap: false,
            lines: [lines.find(line => line.number === 25),
            lines.find(line => line.number === 22),
            lines.find(line => line.number === 18)],
            game: game
        }
        sectors.push(sector11)

        const sector12 = {
            number: 12,
            scrap: false,
            lines: [lines.find(line => line.number === 25),
            lines.find(line => line.number === 26),
            lines.find(line => line.number === 23)],
            game: game
        }
        sectors.push(sector12)

        const sector13 = {
            number: 13,
            scrap: false,
            lines: [lines.find(line => line.number === 26),
            lines.find(line => line.number === 21),
            lines.find(line => line.number === 24)],
            game: game
        }
        sectors.push(sector13)
        
        for (let i = 0; i < sectors.length; i++) {
            fetch("/api/v1/sectors", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
                method: "POST",
                body: JSON.stringify(sectors[i])
            })
        }
    }

    createPods(game, jwt) {
        let pods = []

        for (let i = 0; i < 2; i++) {
            pods.push({
                emptySlots: 2,
                capacity: 2,
                game: game,
                sector: null
            })
        }
        for (let i = 0; i < 5; i++) {
            pods.push({
                emptySlots: 1,
                capacity: 1,
                game: game,
                sector: null
            })
        }
        pods.push({
            emptySlots: 3,
            capacity: 3,
            game: game,
            sector: null
        })

        for (let i = 0; i < pods.length; i++) {
            fetch("/api/v1/pods", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
                method: "POST",
                body: JSON.stringify(pods[i])
            })
        }
    }

    shuffleColors(colors) {
        return colors.sort(() => Math.random() - 0.5);
    }

    createGamePlayers(game, jwt) {
        const colors = this.shuffleColors(["YELLOW", "PINK", "BLUE", "BLACK", "WHITE"])

        for (let i = 0; i < game.players.length; i++) {
            fetch("/api/v1/gamePlayers", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
                method: "POST",
                body: JSON.stringify({
                    actions: 2,
                    points: 0,
                    color: colors[i],
                    game: game,
                    player: game.players[i]

                })
            })
        }
    }

    async getGamePlayers(game, jwt) {
        const gamePlayers = await fetch("/api/v1/gamePlayers?gameid=" + game.id, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET",
        })
        return await gamePlayers.json()
    }

    async createCrewmates(game, jwt) {

        const roles = ["CAPTAIN", "ENGINEER", "SCIENTIST"]
        const players = game.players
        const gamePlayers = await this.getGamePlayers(game, jwt)

        for (let i = 0; i < players.length; i++) {
            for (let j = 0; j < roles.length; j++) {
                for (let f = 0; f < 3; f++) {

                    fetch("/api/v1/crewmates", {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${jwt}`,
                        },
                        method: "POST",
                        body: JSON.stringify({
                            color: gamePlayers[i].color,
                            role: roles[j],
                            player: gamePlayers[i],
                            game: game,
                        })
                    })
                }
            }
        }
    }

    async getSectors(game, jwt) {
        const sectors = await fetch("/api/v1/sectors?gameid=" + game.id, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET",

        })
        return await sectors.json()
    }

    async createShelters(game, jwt) {
        var shelters = []
        const types = this.shuffleColors(["YELLOW", "PINK", "BLUE", "GREEN", "ORANGE"])
        const sectors= await this.getSectors(game,jwt)

       
        const shelter1 = {
            explosion:3,
            type:types[0],
            game:game,
            sector: sectors.find(sector => sector.number === 11)
        }
        shelters.push(shelter1)

        const shelter2 = {
            explosion:4,
            type:types[0],
            game:game,
            sector: sectors.find(sector => sector.number === 12)
        }
        shelters.push(shelter2)

        const shelter3 = {
            explosion:3,
            type:types[0],
            game:game,
            sector: sectors.find(sector => sector.number === 12)
        }
        shelters.push(shelter3)

        const shelter4 = {
            explosion:5,
            type:types[0],
            game:game,
            sector: sectors.find(sector => sector.number === 13)
        }
        shelters.push(shelter4)

        for(let i=0; i<shelters.length; i++){
            fetch("/api/v1/shelterCards", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
                method: "POST",
                body: JSON.stringify(shelters[i])
            })
        }

    }

    async GameItemsInitializer(game,jwt){
        await this.createBeacons(game,jwt)
        await this.createLines(game,jwt)
        await this.createSectors(game,jwt)
        await this.createPods(game, jwt)
        await this.createGamePlayers(game, jwt)
        await this.createCrewmates(game, jwt)
        await this.createShelters(game, jwt)
    }

}



const itemsInitializers = new GameItemsInitializers();
export default itemsInitializers;
