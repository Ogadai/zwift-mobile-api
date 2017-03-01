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
var profile = account.getProfile();

var myProfile = profile.profile(); // JSON of rider profile
var followers = profile.followers(); // JSON array of rider's followers
var followees = profile.followees(); // JSON array of rider's followees

// Get the list of previous activities 
// (start, limit parameters for paging - e.g. (0,30) for first 30 activities)
var activities = profile.activities(start, limit);

// ****************************
// Access world related data

// (note: currently all riders are listed in world '1',
// so worlds 2 and 3 are empty no matter the schedule)

var world = profile.getWorld(1);

var riders = world.riders(); // JSON array of all riders currently riding

// Get the status of the specified rider
// (includes x,y position, speed, power, etc)
var status = world.riderStatus(playerId);

// Get full position data for an activity from FIT file
// (translated back into Zwift world coordinates)
var activity = account.getActivity(playerId).get(activityId);

```
