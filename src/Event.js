const Request = require('./Request')
const zwiftProtobuf = require('./zwiftProtobuf')
const SegmentResults = zwiftProtobuf.lookup('SegmentResults')

const MAX_EVENTS = 100;
const MAX_RIDERS = 100;

class Event {
  constructor(tokenFn) {
    this.request = new Request(tokenFn)
  }

  search({ eventStartsAfter, eventStartsBefore, limit = MAX_EVENTS } = {}) {
    const startTime = eventStartsAfter || Date.now()
    return this.request.post(
      `/api/events/search?use_subgroup_time=true&created_before=${startTime}&start=0&limit=${limit}`,
        {
          eventStartsAfter: startTime,
          eventStartsBefore
        }, 'application/json', 'json')
  }

  riders(eventSubGroup, { limit = MAX_RIDERS } = {}) {
    return this.request.json(
      `/api/events/subgroups/entrants/${eventSubGroup}?participation=signed_up&registered_before=0&start=0&limit=${limit}&type=all`
    )
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
                elapsedMs: segmentResult.elapsed_ms.toNumber(),
                weight: segmentResult.weight,
                power: segmentResult.power,
                heartrate: segmentResult.heartrate,
                powermeter: segmentResult.powermeter
              })
          }
          return retval
      })
  }
}

module.exports = Event
