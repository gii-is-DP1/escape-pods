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
        let value = 1;
        for (let i = 0; i < 26; i++) {
            const i = {
                game: game,
                number: value

            }
            fetch("/api/v1/lines", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
                method: "POST",
                body: JSON.stringify(i)
            })
            value = value + 1;
        }

    }
    createSectors(game, jwt) {
        let lines = null
        fetch("/api/v1/lines?gameid=" + game.id, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET"
        })
            .then(response => response.json())
            .then(response => lines = response)

        //let sectors = []
        const sector1 = {
            number: 1,
            scrap: null,
            game: game,
            lines: [lines.some((line) => line.number === 1),
            lines.some((line) => line.number === 2),
            lines.some((line) => line.number === 3)]
        }
        fetch("/api/v1/sectors", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "POST",
            body: JSON.stringify(sector1)
        })

    }
}

const itemsInitializers = new GameItemsInitializers();
export default itemsInitializers;
