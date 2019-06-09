game.objects = {}
game.builder = {}
globalId = 1
assignId = object => {
    object.id = globalId
    game.objects[object.id] = object
    globalId++
}

let lookup = id => {
    return game.objects[id]
}

let placeIn = (objectId, roomId) => {
    lookup(objectId).location = roomId
    lookup(roomId).contents.push(objectId)
}

let removeFrom = (objectId, roomId) => {
    let room = lookup(roomId)
    room.contents = room.contents.filter(ob => {
        return ob !== objectId
    })
}

let Room = function (ob) {
    this.info = ob.info
    this.contents = ob.contents || []
    this.paths = ob.paths || []
    assignId(this)
}

let Path = function (toId, fromId) {
    this.name = ''
    this.to = toId
    this.from = fromId
    lookup(this.to).paths.push(this)
    lookup(this.from).paths.push(this)
    assignId(this)
}

let Traveler = function (template) {
    this.name = template.name
    this.weapon = null
    this.shield = null
    this.objectType = 'traveler'
    this.stats = {
        baseAttack: template.baseAttack,
        baseDefense: template.baseAttack,
        attack: template.baseAttack,
        defense: template.baseAttack,
    }
    if (template.weaponTypes.length) {
        this.weapon = new Item (game.itemTemplates[wheels.random(template.weaponTypes)])
    }
    if (template.shieldTypes.length) {
        this.shield = new Item (game.itemTemplates[wheels.random(template.shieldTypes)])
    }
    assignId(this)
}

Traveler.prototype.travel = function (pathId) {
    let path = lookup(pathId)
    let room = lookup(this.location)
    let destinationId = path.from === this.location ? path.to : path.from
    placeIn(this.id, destinationId)
    removeFrom(this.id, room.id)
    updateRoom()
}

Traveler.prototype.holding = function (itemId) {
    return (this.weapon === itemId || this.shield === itemId)
}

Traveler.prototype.get = function (itemId) {
    let item = lookup(itemId)
    if (item.slot === 'weapon') {
        if (this.weapon) {
            placeIn(this.weapon, this.location)
        }
        this.weapon = itemId
    } else if (item.slot === 'shield') {
        this.shield = itemId
        placeIn(this.shield, this.location)
    }
    lookup(this.location).contents = lookup(this.location).contents.filter(id => {
        return id !== itemId
    })
}

Traveler.prototype.drop = function (itemId) {
    if (this.weapon === itemId) {
        placeIn(itemId, this.location)
        this.weapon = null
    } else if (this.shield === itemId) {
        placeIn(itemId, this.location)
        this.shield = null
    }
}

game.player = new Traveler (game.characterTemplates['traveler'])
let clearing = new Room ({
    info: 'muddy clearing with an extinguished stone campfire ring.',
})
placeIn(game.player.id, clearing.id)
let sword = new Item (game.itemTemplates['iron sword'])
let branch = new Item (game.itemTemplates['oak branch'])
let shield = new Item (game.itemTemplates['wooden shield'])

let Biome = function (ob) {
    this.name = ob.name
    this.roomNames = ob.roomNames
    this.pathNames = ob.pathNames
    this.encounterTemplates = ob.encounterTemplates
    this.initialize = ob.initialize
    assignId(this)
}
let riverForest = new Biome ({
    roomNames: [
        `dark overgrown forest`,
        `damp mushroom-filled forest hollow`,
        `dense forest overgrown with thick roots`,
        `dark forest`,
        `fern-filled clearing`,
    ],
    pathNames: [
        `narrow path`,
        `rocky path`,
        `dirt trail`,
        `dried-up stream`,
        `overgrown path`
    ],
    encounterTypes: [
        `forest knight`,
    ],
    initialize: function (rooms) {
        rooms[Math.ceil(rooms.length / 2)].info = `old forest clearing with a river running through it. There\'s ${wheels.article(wheels.random([
            'old brick bridge',
            'green moss-covered stone bridge',
            'mushroom-covered rotting wooden bridge'
        ]))} over it`
        rooms[0].info = `a shallow ${wheels.random([
            'pebble-filled',
            'frog-filled',
            'leaf-choked',
            'stony',
            'ice-cold',
        ])} riverbed`
        let knight = new Traveler (game.characterTemplates['forest knight'])
        let knightRoom = wheels.random(rooms)
        placeIn(knight.id, knightRoom.id)
    }
})

game.builder.buildLoop = (biome, length) => {
    let rooms = []
    let i = 0
    let pathCount = 0
    while (i < length) {
        rooms.push(new Room ({
            info: wheels.random(biome.roomNames),
        }))
        if (i > 0) {
            let path = new Path (rooms[i].id, rooms[i - 1].id)
            path.name = biome.pathNames[pathCount % biome.pathNames.length]
            pathCount ++
        }
        if (i === length - 1) {
            let path = new Path (rooms[0].id, rooms[i].id)
            path.name = biome.pathNames[pathCount % biome.pathNames.length]
            pathCount ++
        }
        i++
    }
    biome.initialize(rooms)
    return wheels.random(rooms)
}

let entry = game.builder.buildLoop(riverForest, 7)
let windingPath = new Path (clearing.id, entry.id)
windingPath.name = 'long winding cobblestone path'
placeIn(sword.id, entry.id)
// placeIn(branch.id, entry.id)
// placeIn(shield.id, entry.id)


/* Biome shapes:
- ring
- line
- tunnel (like a line but no branch-offs)
- tree (branch-offs that are more than one room long)
- plane (like a grid)
- clump (many rooms off of one or two central ones)
*/
