let wheels = {}

wheels.inherits = function (ChildClass, BaseClass) {
    function Surrogate() { this.constructor = ChildClass }
    Surrogate.prototype = BaseClass.prototype
    ChildClass.prototype = new Surrogate()
};

wheels.spectrum = (place, first, second) => {
    // If place = 0, return first, if place = 1, return second,
    // if place = .5 return the mean of the two, etc.
    return (first * (1 - place)) + (second * place)
}

wheels.distanceBetween = (first, second) => {
    let a = first.x - second.x
    let b = first.y - second.y
    return Math.sqrt(a * a + b * b)
}

wheels.dice = num => {
    return Math.floor(Math.random() * num) + 1
}

wheels.random = list => {
    if (Array.isArray(list)) {
        return list[Math.floor(Math.random() * list.length)]
    } else if (Object.keys(list)) {
        return list[wheels.random(Object.keys(list))]
    }
}

wheels.floor = (val, floor) => {
    return val > floor ? val : floor
}

wheels.ceiling = (val, ceiling) => {
    return val < ceiling ? val : ceiling
}

wheels.article = (word) => {
    return ['a', 'e', 'i', 'o', 'u'].includes(word[0]) ? `an ${word}` : `a ${word}`
}

wheels.commaList = (list) => {
    let output = ''
    if (list.length === 0) {
        return ''
    }
    if (list.length === 1) {
        return wheels.article(list[0])
    }
    list.forEach((item, index) => {
        if (index < list.length - 1) {
            output += `${wheels.article(item)}${list.length === 2 ? ' ' : ', '}`
        } else {
            output += `and ${wheels.article(item)}`
        }
    })
    return output
}
