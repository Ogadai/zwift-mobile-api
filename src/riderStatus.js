const zwiftProtobuf = require('./zwiftProtobuf')

const Status = zwiftProtobuf.lookup('PlayerState')

const TURN_SIGNALS = {
    RIGHT: 'right',
    LEFT: 'left',
    STRAIGHT: 'straight'
}

const COURSES = {
    WATOPIA: 3,
    RICHMOND: 4,
    LONDON: 5
}

const COURSE_TO_WORLD = {
    3: 1,
    4: 2,
    5: 3,
    6: 1
}

class PlayerStateWrapper {
    constructor(state) {
        this.riderStatus = state
    }

    get rideOns() {
        // eslint-disable-next-line no-bitwise
        return ((this.riderStatus.f19 >> 24) & 0xfff)
    }

    get isTurning() {
        // eslint-disable-next-line no-bitwise
        return ((this.riderStatus.f19 & 8) !== 0)
    }

    get isForward() {
        // eslint-disable-next-line no-bitwise
        return ((this.riderStatus.f19 & 4) !== 0)
    }

    get course() {
        // eslint-disable-next-line no-bitwise
        return ((this.riderStatus.f19 & 0xff0000) >> 16)
    }

    get world() {
        //world defined in prefs.xml seems to be course - 2
        return COURSE_TO_WORLD[this.course]
    }

    get roadID() {
        // eslint-disable-next-line no-bitwise
        return ((this.riderStatus.f20 & 0xff00) >> 8)
    }

    get roadDirection() {
        return ((this.riderStatus.f20 & 0xffff000000) >> 24)
    }

    get turnSignal() {
        switch (this.riderStatus.f20 & 0x70) {
          case 0x10:
              return TURN_SIGNALS.RIGHT
          case 0x20:
              return TURN_SIGNALS.LEFT
          case 0x40:
              return TURN_SIGNALS.STRAIGHT
          default:
              return null
        }
    }

    get powerup() {
        return (this.riderStatus.f20 & 0xf)
    }

    get hasFeatherBoost() {
        return (this.powerup === 0)
    }

    get hasDraftBoost() {
        return (this.powerup === 1)
    }

    get hasAeroBoost() {
        return (this.powerup === 5)
    }

    get cadence() {
        return Math.round((this.riderStatus.cadenceUHz * 60) / 1000000)
    }

}

class PlayerStateHandler {
    constructor() {
        this.initialized = false
    }

    get(target, propKey) {
        this.initialize(target)

        if (propKey in this.riderStatus) {
            return this.riderStatus[propKey]
        }
        return this.wrapper[propKey]
    }

    ownKeys(target) {
        this.initialize(target)

        return [...Reflect.ownKeys(this.riderStatus), ...Reflect.ownKeys(this.wrapper)]
    }

    getOwnPropertyDescriptor(target, key) {
        this.initialize(target)

        if (key in this.riderStatus) {
            return Reflect.getOwnPropertyDescriptor(this.riderStatus, key)
        }
        return Reflect.getOwnPropertyDescriptor(this.wrapper, key)
    }

    initialize(item) {
        if (!this.initialized) {
            this.riderStatus = item
            this.wrapper = new PlayerStateWrapper(item)
            this.initialized = true
        }
    }
}

function wrappedStatus(status) {
    return new Proxy(status, new PlayerStateHandler())
}

function riderStatus(buffer) {
    return wrappedStatus(Status.decode(buffer))
}

module.exports = {
    wrappedStatus,
    riderStatus,
    TURN_SIGNALS,
    COURSES
}
