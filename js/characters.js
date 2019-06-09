var CharacterTemplate = function (ob) {
    this.name = ob.name;
    this.attack = ob.attack;
    this.defense = ob.defense;
    this.baseAttack = ob.baseAttack;
    this.baseDefense = ob.baseDefense;
    this.weaponTypes = ob.weaponTypes;
    this.shieldTypes = ob.shieldTypes;
}

game.characterTemplates = {
    'traveler': new CharacterTemplate ({
        name: 'traveler',
        baseAttack: [0,0,0,0,0,0],
        baseDefense: [0,0,0,0,0,0],
        weaponTypes: [],
        shieldTypes: [],
    }),
    'forest knight': new CharacterTemplate ({
        name: 'forest knight',
        baseAttack: [0,0,0,0,0,0],
        baseDefense: [0,0,0,0,0,0],
        weaponTypes: ['iron sword'],
        shieldTypes: ['wooden shield'],
    }),
}
