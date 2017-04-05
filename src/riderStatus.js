/* eslint-disable indent */
import protobuf from 'protobufjs';

const proto = `syntax="proto3";
    message PlayerState {
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
    }
    message ClientToServer {
        int32 connected = 1;
        int32 rider_id = 2;
        int64 world_time = 3;
        PlayerState state = 7;
        int32 seqno = 4;
        int64 tag8 = 8;
        int64 tag9 = 9;
        int64 last_update = 10;
        int64 tag11 = 11;
        int64 last_player_update = 12;
    }
    
    message UnknownMessage1 {
        // string firstName=7;
        // string lastName=8;
        // string timestamp=17;
    }
    
    message UnknownMessage {
        // int64 tag1=1;
        // UnknownMessage1 tag4=4;
    }
    
    message ServerToClient {
        int32 tag1 = 1;
        int32 rider_id = 2;
        int64 world_time = 3;
        int32 seqno = 4;
        repeated PlayerState player_states = 8;
        repeated UnknownMessage player_updates = 9;
        int64 tag11 = 11;
        int64 tag17 = 17;
        int32 num_msgs = 18;
        int32 msgnum = 19;
    }
    
    message WorldAttributes {
        int32 world_id = 1;
        string name = 2;
        int64 tag3 = 3;
        int64 tag5 = 4;
        int64 world_time = 6;
        int64 clock_time = 7;
    }
    
    message WorldAttribute {
        int64 world_time = 2;
    }
    
    message EventSubgroupProtobuf {
        int32 id = 1;
        string name = 2;
        int32 rules = 8;
        int32 route = 22;
        int32 laps = 25;
        int32 startLocation = 29;
        int32 label = 30;
        int32 paceType = 31;
        int32 jerseyHash = 36;
    }

    `;
export const root = protobuf.parse(proto, { keepCase: true }).root;

const Status = root.lookup('PlayerState');

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

export function wrappedStatus(status) {
    return new Proxy(status, new PlayerStateHandler());
}

export function riderStatus(buffer) {
    return wrappedStatus(Status.decode(buffer));
}
