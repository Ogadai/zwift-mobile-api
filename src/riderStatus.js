/* eslint-disable indent */
import protobuf from 'protobufjs';

const extraVariables = ['roadID', 'rideOns', 'isTurning', 'isForward', 'cadence'];

class PlayerStateWrapper {
    constructor(state) {
        this.riderStatus = state;
    }

    get roadID() {
        // eslint-disable-next-line no-bitwise
        return ((this.riderStatus.f20 & 0xff00) >> 8);
    }

    get rideOns() {
        // eslint-disable-next-line no-bitwise
        return ((this.riderStatus.f19 >> 24) & 0xfff);
    }

    get isTurning() {
        // eslint-disable-next-line no-bitwise
        return ((this.riderStatus.f19 & 4) !== 0);
    }

    get isForward() {
        // eslint-disable-next-line no-bitwise
        return ((this.riderStatus.f19 & 8) !== 0);
    }

    get cadence() {
        return Math.round((this.riderStatus.cadenceUHz * 60) / 1000000);
    }
}

class PlayerStateHandler {
    constructor() {
        this.initialized = false;
    }

    get(target, propKey) {
        this.initialize(target);

        if (propKey in this.riderStatus) {
            return this.riderStatus[propKey];
        }
        return this.wrapper[propKey];
    }


    ownKeys(target) {
        this.initialize(target);

        return [...Reflect.ownKeys(this.riderStatus), ...Reflect.ownKeys(this.wrapper)];
    }

    getOwnPropertyDescriptor(target, key) {
        this.initialize(target);

        if (key in this.riderStatus) {
            return Reflect.getOwnPropertyDescriptor(this.riderStatus, key);
        }
        return Reflect.getOwnPropertyDescriptor(this.wrapper, key);
    }

    initialize(item) {
        if (!this.initialized) {
            this.riderStatus = item;
            this.wrapper = new PlayerStateWrapper(item);
            this.initialized = true;
        }
    }
}

export default function riderStatus(buffer) {
    var root = protobuf.Root.fromJSON({
        nested: {
            Status: {
                fields: {
                    id: {
                        type: "int32",
                        id: 1
                    },
                    worldTime: {
                        type: "int64",
                        id: 2,
                    },
                    distance: {
                        type: "int32",
                        id: 3
                    },
                    roadTime: {
                        type: "int32",
                        id: 4,
                    },
                    speed: {
                        type: "int32",
                        id: 6
                    },
                    roadPosition: {
                        type: "int32",
                        id: 8,
                    },
                    cadenceUHz: {
                        type: "int32",
                        id: 9
                    },
                    heartrate: {
                        type: "int32",
                        id: 11
                    },
                    power: {
                        type: "int32",
                        id: 12
                    },
                    heading: {
                        type: "int32",
                        id: 13
                    },
                    lean: {
                        type: "int32",
                        id: 14
                    },
                    climbing: {
                        type: "int32",
                        id: 15
                    },
                    time: {
                        type: "int32",
                        id: 16
                    },
                    f19: {
                        type: "int32",
                        id: 19
                    },
                    f20: {
                        type: "int32",
                        id: 20
                    },
                    f21: {
                        type: "int32",
                        id: 21
                    },
                    customisationId: {
                        type: "int32",
                        id: 22,
                    },
                    justWatching: {
                        type: "int32",
                        id: 23,
                    },
                    calories: {
                        type: "int32",
                        id: 24,
                    },
                    x: {
                        type: "float",
                        id: 25
                    },
                    altitude: {
                        type: "float",
                        id: 26
                    },
                    y: {
                        type: "float",
                        id: 27
                    },
                    watchingRiderId: {
                        type: "int32",
                        id: 28,
                    },
                    groupId: {
                        type: "int32",
                        id: 29,
                    },
                    f31: {
                      type: "int32",
                      id: 31,
                    },
                }
            }
        }
    });

    var Status = root.lookup("Status");
    return new Proxy(Status.decode(buffer), new PlayerStateHandler());
};