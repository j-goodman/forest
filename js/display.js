window.addEventListener('load', () => {
    document.getElementById('start-button').addEventListener('click', event => {
        document.getElementsByClassName('start-screen')[0].classList.toggle('hidden')
        document.getElementsByClassName('game-screen')[0].classList.toggle('hidden')
    })
    display = {
        message: document.getElementById('main-message'),
        paths: document.getElementById('paths'),
        monsters: document.getElementById('monsters'),
        items: document.getElementById('items'),
        inventory: document.getElementById('inventory'),
        shield: document.getElementById('shield'),
        weapon: document.getElementById('weapon'),
        hitpoints: document.getElementById('hitpoints'),
        recover: document.getElementById('recover'),
        room: document.getElementById('room'),
        statBackButton: document.getElementById('back-from-stats-button'),
        attack: {},
        defense: {},
        data: {},
    }
    let damages = ['pierce', 'slash', 'crush', 'burn', 'poison', 'curse',]
    damages.map(dam => {
        display.attack[dam] = document.getElementById(`attack-${dam}`)
        display.defense[dam] = document.getElementById(`defense-${dam}`)
    })
    updateRoom()
    updateInventory()
    display.message.innerText = `You\'re lost in the forest.

    ${display.message.innerText}`
});
//
// clearType = () => {}
//
// drawString = string => {
//     if (display.newMessage) {
//         display.message.innerText += `
//         ${string}`
//     } else {
//         display.message.innerText = string
//         display.message.style.color = '#d00'
//         window.scrollTo(0, 0)
//         display.newMessage = true;
//         window.setTimeout(() => {
//           display.message.style.color = '#fff'
//           display.newMessage = false;
//         }, 1000)
//     }
// }
//
// updateRecover = () => {
//     display.recover.innerHTML = ''
//     if (
//         game.player.room.mana > 0 &&
//         game.player.stats.hitpoints < 20 &&
//         !game.player.room.monsters.length
//     ) {
//         let button = document.createElement('a')
//         button.className = 'action-button'
//         button.innerText = 'RECOVER'
//         button.addEventListener('click', game.player.recover.bind(game.player))
//         display.recover.appendChild(button)
//     }
// }
//
updateRoom = () => {
    let room = lookup(game.player.location)
    display.message.innerText = `You're in ${wheels.article(room.info)}.`
    display.message.innerText += `

    There\'s ${wheels.commaList(room.paths.map(path => { return path.name }), 'a')}.`
    updateTravelers()
    updateItems()
    updatePaths()
    // updateRecover()

    // if (game.player.room.monsters.length > 0 || game.player.room.type.length < 25) {
    //     display.room.innerText = `${game.player.room.type[0].toUpperCase() + game.player.room.type.slice(1,game.player.room.type.length)}.`
    // } else {
    //     display.room.innerText = ''
    // }
}

updateRoomContents = () => {
    updateTravelers()
    updateItems()
    updatePaths()
    // updateRecover()
}

updatePaths = () => {
    display.paths.innerHTML = ''
    lookup(game.player.location).paths.map(path => {
        display.paths.append(pathCard(path))
    })
}

updateTravelers = () => {
    display.monsters.innerHTML = ''
    let monsters = lookup(game.player.location).contents.filter(id => {
        return (lookup(id).objectType === 'traveler' && id !== game.player.id)
    })
    monsters.map(monsterId => {
        display.monsters.append(monsterCard(lookup(monsterId)))
    })
}

updateItems = () => {
    display.items.innerHTML = ''
    let room = lookup(game.player.location)
    let items = room.contents.filter(ob => {
        return lookup(ob).objectType === 'item'
    })
    items.forEach(itemId => {
        display.items.append(itemCard(itemId))
    })
}
//
updateInventory = () => {
    // updateRecover()
    updateItems()
    // display.inventory.innerHTML = ''
    // game.player.holding.map(item => {
    //     display.inventory.append(itemCard(item, true))
    // })
    display.weapon.innerHTML = ''
    if (game.player.weapon) {
        display.weapon.append(itemCard(game.player.weapon, true))
    }
    display.shield.innerHTML = ''
    if (game.player.shield) {
        display.shield.append(itemCard(game.player.shield, true))
    }
    let damages = ['pierce', 'slash', 'crush', 'burn', 'poison', 'curse',]
    damages.map((dam, index) => {
        if (game.player.stats.attack[index]) {
            if (game.player.weapon && lookup(game.player.weapon).bonus[index]) {
                display.attack[dam].innerHTML = dam + '|' + game.player.stats.baseAttack[index] + '<b class="green">+' + lookup(game.player.weapon).bonus[index] + '</b>'
            } else {
                display.attack[dam].innerText = `${dam}|${game.player.stats.attack[index]}`
            }
        } else {
            display.attack[dam].innerText = ``
        }
        if (game.player.shield && lookup(game.player.shield).bonus[index]) {
            display.defense[dam].innerHTML = dam + '|' + game.player.stats.baseDefense[index] + '<b class="blue">+' + lookup(game.player.shield).bonus[index] + '</b>'
        } else {
            display.defense[dam].innerText = game.player.stats.defense[index] ? `${dam}|${game.player.stats.defense[index]}` : ``
        }
    })
    display.hitpoints.innerText = `HITPOINTS|${game.player.stats.hitpoints}`
}
//
// gameOver = () => {
//     let element = document.createElement('div')
//     element.className = 'door-card card game-over-card'
//     let header = document.createElement('div')
//     header.innerText = 'Try to kill the dragon again?'
//     element.appendChild(header)
//
//     let again = document.createElement('a')
//     again.className = 'action-button'
//     again.innerText = 'GO'
//     updateRoom = () => {}
//     updateRoomContents = () => {}
//     updateInventory = () => {}
//     again.addEventListener('click', () => {
//         // instantiateNewGame()
//         // updateRoom()
//         // updateInventory()
//         window.location.reload()
//     })
//
//     element.appendChild(again)
//     display.paths.innerHTML = ''
//     display.paths.appendChild(element)
// }
//
pathCard = path => {
    let element = document.createElement('div')
    element.className = 'path-card card'
    let header = document.createElement('div')
    header.innerText = path.name
    element.appendChild(header)
    if (path.locked) {
        let locked = document.createElement('a')
        locked.innerText = 'LOCKED'
        element.appendChild(locked)
    } else {
        let goto = document.createElement('a')
        goto.className = 'action-button'
        goto.innerText = 'GO'
        goto.addEventListener('click', () => {
          game.player.travel(path.id)
        })
        element.appendChild(goto)
    }
    return element
}

monsterCard = monster => {
    let element = document.createElement('div')
    element.className = 'monster-card card'
    let header = document.createElement('div')
    header.innerText = monster.name.toUpperCase()
    element.appendChild(header)
    let hitpoints = document.createElement('li')
    hitpoints.innerText = `HITPOINTS|${monster.hitpoints}`
    element.appendChild(hitpoints)
    let paragraph = document.createElement('p')
    paragraph.innerText = monster.info
    element.appendChild(paragraph)

    let actions = document.createElement('section')
    actions.className = 'actions'

    let fight = document.createElement('a')
    fight.className = 'action-button'
    fight.innerText = 'FIGHT'
    fight.addEventListener('click', () => {
        game.player.fight(monster)
        updateTravelers()
    })
    actions.appendChild(fight)

    let stats = document.createElement('a')
    stats.className = 'action-button'
    stats.innerText = 'STATS'
    stats.addEventListener('click', () => {
        paragraph.innerText = (paragraph.innerText === monster.info) ?
            `ATTACK
            ${game.player.statObjString(monster.attack)}
            DEFENSE
            ${game.player.statObjString(monster.defense)}`:
            monster.info
        stats.innerText = (paragraph.innerText === monster.info) ? 'STATS' : 'INFO'
    })
    actions.appendChild(stats)

    element.appendChild(actions)
    return element
}


itemCard = (itemId, inventory) => {
    let item = lookup(itemId)
    let element = document.createElement('div')
    let room = lookup(game.player.location)
    let roomItems = room.contents.filter(id => {
        return lookup(id).objectType === 'item'
    })
    element.className = 'item-card card'
    element.className += item.slot === 'shield' ? ' shield' : ' weapon'
    let header = document.createElement('div')
    header.innerText = item.name
    element.appendChild(header)

    if ((game.player.weapon && game.player.weapon === item.id) || (game.player.shield && game.player.shield === item.id)) {
        let paragraph = document.createElement('p')
        paragraph.className = 'item-card-description'
        paragraph.innerText = item.info
        element.appendChild(paragraph)
    }

    let actions = document.createElement('section')
    actions.className = 'actions'

    if (game.player.weapon !== item.id && game.player.shield !== item) {
        let get = document.createElement('a')
        get.className = 'action-button'
        get.innerText = 'EQUIP'
        get.addEventListener('click', () => {
            if (roomItems.includes(itemId)) {
                game.player.get(itemId)
            } else if (game.player.holding(itemId)) {
                game.player.drop(itemId)
                game.player.get(itemId)
            }
            updateRoomContents()
            updateInventory()
        })
        actions.appendChild(get)
    }

    if (inventory) {
        let drop = document.createElement('a')
        drop.className = 'action-button'
        drop.innerText = 'DROP'
        drop.addEventListener('click', () => {
            game.player.drop(itemId)
            updateRoomContents()
            updateInventory()
        })
        actions.appendChild(drop)
    } else {
        let hold = document.createElement('a')
        hold.className = 'action-button'
        hold.innerText = 'HOLD'
        hold.addEventListener('click', () => {
            game.player.hold(item)
            updateRoomContents()
            updateInventory()
        })
        actions.appendChild(hold)
    }

    element.append(actions)
    return element
}
