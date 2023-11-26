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
    /*
    getLineOfGameByNumber(lines, num) {
       
        let res = {}
        for (let i = 0; i < lines.length; i++) {
            console.log(lines[i])
            if (lines[i].number === num) {
                res = lines[i];
                console.log(lines[i].number)
            }
        }
        return res;
    }*/
    generateines(game,jwt){
        var lines= []
    
        fetch("/api/v1/lines?gameid=" + game.id, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET",
           
        })
            .then(response => response.json())
            .then(data=> {
                for(const l of data){
                   lines.push(l);
                   
                }
                console.log(lines)
                console.log(lines.find(line=> {return line.number===1}))
            })
          return lines;
    }

    async createSectors(game, jwt) {

        var lines= []
    
        await fetch("/api/v1/lines?gameid=" + game.id, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            method: "GET",
           
        })
            .then(response => response.json())
            .then(data=> {
                for(const l of data){
                   lines.push(l);
                   
                }
                console.log(lines)
                console.log(lines.find(line=> {return line.number===1}))
            })
          

        const sector1 = {
            number:1,
            scrap: false,
            game: game,
            lines: [lines.find(line=> {return line.number===1}),
                lines.find(line=> {return line.number===2}),
                lines.find(line=> {return line.number===3}) ]
        }
        console.log(sector1)

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
