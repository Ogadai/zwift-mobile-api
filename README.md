# GDPR and Zwift's Developer API
In July '08, this library was converted to use Zwift's new Developer API, in accordance with Zwift's policies.

The Developer API requires a special developer account, and won't work with regular rider accounts like before.
Currently, Zwift is not able to offer developer accounts to hobby developers, but I'm hoping they'll be able to at some point.
You can contact Zwift at [developers@zwift.com](mailto:developers@zwift.com) to register interest and ask for further information.

# zwift-mobile-api
A simple javascript library to make it a bit easier to call some of the Zwift API endpoints

* Automatically handle creating and renewing of a valid token (requires username and password to login with a valid Zwift account)
* Decode protobuf data to get live current speed/power/time data for currently riding players
* List and download previous activities, decoded from FIT files

# Usage

```
$> npm install --save zwift-mobile-api
```

## Login

```javascript
var ZwiftAccount = require("zwift-mobile-api");
var account = new ZwiftAccount(username, password);
```

## Rider Profiles

```javascript
// Get profile for "me"
account.getProfile().profile().then(p => {
    console.log(p);  // JSON of rider profile (includes id property you can use below)
});

// Get profile data for a particular rider (requires Zwift player id)
var profile = account.getProfile(playerId);

profile.followers().then(followers => {
    console.log(followers); // JSON array of rider's followers
});

profile.followees().then(followees => {
    console.log(followees); // JSON array of rider's followees
});

// Give a RideOn (from 'playerId' to 'otherRiderId')
// Can lookup 'activityId' from 'currentActivityId' of profile() response
profile.giveRideOn(otherRiderId, activityId);

// Retrieve the goals you have
profile.goals().then(goal=> {
    console.log(goal); //JSON array of goals
})

// Delete a goal; goalID is printed from getGoals()
goalID = 200147
prof.deleteGoal(goalID)
```

## List Riders

```javascript
// (note: currently all riders are listed in world '1',
// so worlds 2 and 3 are empty no matter the schedule)

var world = account.getWorld(1);

world.riders().then(riders => {
    console.log(riders); // JSON array of all riders currently riding
});
```

## Rider Status

```javascript
// (note: currently all riders are listed in world '1',
// so worlds 2 and 3 are empty no matter the schedule)

var world = account.getWorld(1);

// Get the status of the specified rider
// (includes x,y position, speed, power, etc)
world.riderStatus(playerId).then(status => {
    console.log(status); // JSON of rider status
});

```

## Events

```javascript
var event = account.getEvent();

// Search for events
// options:
//   eventStartsAfter = earliest start time (milliseconds since 1970)
//   eventStartsBefore = latest start time (milliseconds since 1970)
const options = {
    eventStartsAfter: Date.now() - 3600000,
    eventStartsBefore: Date.now() + 600000
};
event.search(options).then(results => {
    results.forEach(event => console.log(
        `${event.id}: ${event.name} - sub groups `
        + event.eventSubgroups.map(g => `${g.label}:${g.id}`)
    ))
});

// Get riders who signed up to an event sub group
// (get subGroupId from search() results)
event.riders(subGroupId).then(riders =>
    riders.forEach(r => console.log(
        `${r.id} - ${r.firstName} ${r.lastName}`
    ))
);

// Get the results for an event subgroup.
// Note that results returned by Zwift are not sorted, even though they
// often come through as slowest first.
event.segmentResults(eventSubgroupId).then(results => {
    results.sort((a,b) => {
        if (a.elapsedMs > b.elapsedMs) {
            return 1;
        } else if (a.elapsedMs == b.elapsedMs) {
            return 0;
        }
        return -1;
    })
    for (let result of results) {
        console.log(result);
    }
});

```

## Previous Activities

```javascript
// Get profile data for a particular rider (requires Zwift player id)
var profile = account.getProfile(playerId);

// Get the list of previous activities
// (start, limit parameters for paging - e.g. (0,30) for first 30 activities)
profile.activities(start, limit).then(activities => {
    console.log(activities); // JSON array of activities
});

// Get full position data for an activity from FIT file
// (translated back into Zwift world coordinates)
account.getActivity(playerId).get(activityId).then(activity => {
    console.log(activity); // JSON of activity including positions
});

```
