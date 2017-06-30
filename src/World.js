const Request = require('./Request')
const { riderStatus } = require('./riderStatus')
const zwiftProtobuf = require('./zwiftProtobuf')
const SegmentResults = zwiftProtobuf.lookup('SegmentResults')

class World {
    constructor(worldId, tokenFn) {
        this.worldId = worldId || 1
        this.request = new Request(tokenFn)
    }

    riders() {
        return this.request.json(`/relay/worlds/${this.worldId}`)
    }

    riderStatus(playerId) {
        if (!playerId) {
            throw new Error('A player id is required - world.riderStatus(playerId)')
        }

        return this.request.protobuf(`/relay/worlds/${this.worldId}/players/${playerId}`)
            .then(buffer => {
                return new Promise((resolve, reject) => {
                    try {
                        const status = riderStatus(buffer)
                        resolve(status)
                    } catch(ex) {
                        console.log(`Error decoding protobuf riderStatus - ${ex.message}`)
                        console.log(ex)

                        reject({
                            response: {
                                status: 500,
                                statusText: ex.message
                            }
                        })
                    }
                })
            })
    }

    segmentResults(eventSubgroupId) {
        return this.request.protobuf(`/api/segment-results?world_id=0&segment_id=1&event_subgroup_id=${eventSubgroupId}&full=true&player_id=0`)
          .then(buffer => {
              const segmentResults = SegmentResults.decode(buffer);
              let retval = []
              for (let segmentResult of segmentResults.segment_results) {
                  retval.push({
                    id: segmentResult.id.toNumber(),
                    riderId: segmentResult.rider_id.toNumber(),
                    eventSubgroupId: segmentResult.event_subgroup_id.toNumber(),
                    firstName: segmentResult.first_name,
                    lastName: segmentResult.last_name,
                    finishTimeStr: segmentResult.finish_time_str,
                    elapsedMs: segmentResult.elapsed_ms.toNumber()
                  })
              }
              return retval
          })
    }
}

module.exports = World
