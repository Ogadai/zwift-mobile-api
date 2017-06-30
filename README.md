# zwift-mobile-api
A simple javascript library to make it a bit easier to call some of the Zwift API endpoints

* Automatically handle creating and renewing of a valid token (requires username and password to login with a valid Zwift account)
* Decode protobuf data to get live current speed/power/time data for currently riding players
* List and download previous activities, decoded from FIT files

# Usage

```
$> npm install --save zwift-mobile-api
```

```javascript
var ZwiftAccount = require("zwift-mobile-api");
var account = new ZwiftAccount(username, password);

// ****************************
// Access profile related data

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

// Get the list of previous activities 
// (start, limit parameters for paging - e.g. (0,30) for first 30 activities)
profile.activities(start, limit).then(activities => {
    console.log(activities); // JSON array of activities
});

// ****************************
// Access world related data

// (note: currently all riders are listed in world '1',
// so worlds 2 and 3 are empty no matter the schedule)

var world = account.getWorld(1);

world.riders().then(riders => {
    console.log(riders); // JSON array of all riders currently riding
});

// Get the status of the specified rider
// (includes x,y position, speed, power, etc)
world.riderStatus(playerId).then(status => {
    console.log(status); // JSON of rider status
});

// Get the results for an event subgroup.
// Note that results returned by Zwift are not sorted, even though they
// often come through as slowest first.
world.segmentResults(eventSubgroupId).then(results => {
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

// Get full position data for an activity from FIT file
// (translated back into Zwift world coordinates)
account.getActivity(playerId).get(activityId).then(activity => {
    console.log(activity); // JSON of activity including positions
});

```
