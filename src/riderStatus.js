/* eslint-disable indent */
import protobuf from 'protobufjs';

const extraVariables = ['roadID', 'rideOns', 'isTurning', 'isForward', 'cadence'];

const proto = `syntax=\"proto3\";
    message Status {
        int32 id = 1;
        int64 worldTime = 2;
        int32 distance = 3;
        int32 roadTime = 4;
        int32 speed = 6;
        int32 roadPosition = 8;
        int32 cadenceUHz = 9;
        int32 heartrate = 11;
        int32 power = 12;
        int64 heading = 13;
        int32 lean = 14;
        int32 climbing = 15;
        int32 time = 16;
        int32 f19 = 19;
        int32 f20 = 20;
        int32 f21 = 21;
        int64 customisationId = 22;
        int32 justWatching = 23;
        int32 calories = 24;
        float x = 25;
        float altitude = 26;
        float y = 27;
        int32 watchingRiderId = 28;
        int32 groupId = 29;
        int64 f31 = 31;
    }`;
const root = protobuf.parse(proto, { keepCase: true }).root;
const Status = root.lookup("Status");

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
    return new Proxy(Status.decode(buffer), new PlayerStateHandler());
};