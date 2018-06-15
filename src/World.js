const Request = require('./Request')

class World {
    constructor(worldId, tokenFn) {
        this.worldId = worldId || 1
        this.request = new Request(tokenFn)
    }

    riders() {
        return this.request.json(`/relay/developer/worlds/${this.worldId}`)
    }

    riderStatus(playerId) {
        if (!playerId) {
            throw new Error('A player id is required - world.riderStatus(playerId)')
        }

        return this.request.json(`/relay/developer/worlds/${this.worldId}/players/${playerId}`);
    }

    segmentResults() {
        throw new Error('*** DEPRECATED *** account.getWorld().segmentResults() is not supported. Please use account.getEvent().segmentResults() instead');
    }
}

module.exports = World
