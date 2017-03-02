import Request from './Request';
import riderStatus from './riderStatus'

class World {
    constructor(worldId, tokenFn) {
        this.worldId = worldId || 1;
        this.request = new Request(tokenFn);
    }

    riders() {
        return this.request.json(`/relay/worlds/${this.worldId}`);
    }

    riderStatus(playerId) {
        if (!playerId) {
            throw new Error('A player id is required - world.riderStatus(playerId)');
        }

        return this.request.protobuf(`/relay/worlds/${this.worldId}/players/${playerId}`)
            .then(buffer => {
                return riderStatus(buffer);
            });
    }
}

export default World;
