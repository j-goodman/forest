game = {}

var ItemTemplate = function (ob) {
    this.name = ob.name;
    this.bonus = ob.bonus;
    this.ammo = ob.ammo;
    this.info = ob.info;
    this.slot = ob.slot;
    this.spentMessage = ob.spentMessage;
    this.onDestroy = ob.onDestroy ? ob.onDestroy : false;
    this.onUse = ob.onUse ? ob.onUse : false;
    this.onInstantiate = ob.onInstantiate ? ob.onInstantiate : false;
    this.onDrop = ob.onDrop ? ob.onDrop : false;
};

var Item = function (type) {
    this.name = type.name;
    this.slot = type.slot;
    this.objectType = 'item'
    this.bonus = type.bonus;
    this.ammo = type.ammo;
    this.spentMessage = type.spentMessage;
    this.info = type.info;
    this.data = {
        pickedUp: false
    }
    this.onDestroy = type.onDestroy ? type.onDestroy : false;
    this.onUse = type.onUse ? type.onUse : false;
    this.onInstantiate = type.onInstantiate ? type.onInstantiate : false;
    this.onDrop = type.onDrop ? type.onDrop : false;
    assignId(this)
    if (this.onInstantiate) {
        this.onInstantiate(this);
    }
};

game.itemTemplates = {
    // pierce, slash, crush, burn, poison, curse

    /*///
    WEAPONS
    /*///

    'iron sword': new ItemTemplate ({
        name: 'iron sword',
        slot: 'weapon',
        bonus: [3,5,0,0,0,0],
        ammo: 15,
        spentMessage: 'Your sword breaks.',
        info: 'A heavy old iron shortsword.'
    }),

    'oak branch': new ItemTemplate ({
        name: 'oak branch',
        slot: 'weapon',
        bonus: [1,0,4,0,0,0],
        ammo: 15,
        spentMessage: 'Your oak branch breaks.',
        info: 'A straight and heavy tree branch, about four feet long.'
    }),

    /*///
    SHIELDS
    /*///

    'wooden shield': new ItemTemplate ({
        name: 'wooden shield',
        slot: 'shield',
        bonus: [0,4,5,0,0,0],
        ammo: 14,
        spentMessage: 'Your shield breaks.',
        info: 'A heavy oak shield.'
    }),
};
