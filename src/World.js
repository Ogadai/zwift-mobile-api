import Request from './Request';
import riderStatus from './riderStatus'

class World {
    constructor(worldId, tokenFn) {
        this.worldId = worldId;
        this.request = new Request(tokenFn);
    }

    riders() {
        return this.request.json(`/relay/worlds/${this.worldId}`);
    }

    riderStatus(playerId) {
        return this.request.protobuf(`/relay/worlds/${this.worldId}/players/${playerId}`)
            .then(buffer => {
                return riderStatus(buffer);
            });
    }
}

export default World;
