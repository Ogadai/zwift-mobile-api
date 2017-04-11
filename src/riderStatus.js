const zwiftProtobuf = require('./zwiftProtobuf')

const Status = zwiftProtobuf.lookup('PlayerState')

class PlayerStateWrapper {
    constructor(state) {
        this.riderStatus = state
    }

    get roadID() {
        // eslint-disable-next-line no-bitwise
        return ((this.riderStatus.f20 & 0xff00) >> 8)
    }

    get roadDirection() {
        return ((this.riderStatus.f20 & 0xffff000000) >> 24)
    }

    get powerup() {
        return (this.riderStatus.f20 & 0xf)
    }

    get hasFeatherBoost() {
        return ((this.riderStatus.f20 & 0xf) == 0)
    }

    get hasDraftBoost() {
        return ((this.riderStatus.f20 & 0xf) == 1)
    }

    get hasAeroBoost() {
        return ((this.riderStatus.f20 & 0xf) == 5)
    }

    get rideOns() {
        // eslint-disable-next-line no-bitwise
        return ((this.riderStatus.f19 >> 24) & 0xfff)
    }

    get isTurning() {
        // eslint-disable-next-line no-bitwise
        return ((this.riderStatus.f19 & 4) !== 0)
    }

    get isForward() {
        // eslint-disable-next-line no-bitwise
        return ((this.riderStatus.f19 & 8) !== 0)
    }

    get cadence() {
        return Math.round((this.riderStatus.cadenceUHz * 60) / 1000000)
    }

    get turnSignal() {
        switch (this.riderStatus.f20 & 0x70) {
          case 0x10:
              return 'right'
          case 0x20:
              return 'left'
          case 0x40:
              return 'straight'
          default:
              return null
        }
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
    riderStatus
}
