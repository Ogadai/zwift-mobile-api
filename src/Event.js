const Request = require('./Request')

const MAX_EVENTS = 100;
const MAX_RIDERS = 100;

class Event {
  constructor(tokenFn) {
    this.request = new Request(tokenFn)
  }

  search({ eventStartsAfter, eventStartsBefore, limit = MAX_EVENTS } = {}) {
    const startTime = eventStartsAfter || Date.now()
    const endTime = eventStartsBefore || Date.now()
    return this.request.post(
      `/api/developer/event/search?use_subgroup_time=true&created_before=${endTime}&start=0&limit=${limit}`,
        {
          eventStartsAfter: startTime,
          eventStartsBefore: endTime
        }, 'application/json', 'json')
  }

  riders(eventSubGroup, { limit = MAX_RIDERS } = {}) {
    return this.request.json(
      `/api/developer/event/subgroup/entrants/${eventSubGroup}?participation=signed_up&registered_before=0&start=0&limit=${limit}&type=all`
    )
  }

  segmentResults(eventSubgroupId) {
    return this.request.json(`/api/developer/segment-results?event_subgroup_id=${eventSubgroupId}`)
      .then(segmentResults => segmentResults.segmentResultList)
  }
}

module.exports = Event
