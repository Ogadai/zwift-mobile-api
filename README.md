# zwift-mobile-api
A simple javascript library to make it a bit easier to call some of the Zwift API endpoints

* Automatically handle creating and renewing of a valid token (requires username and password to login with a valid Zwift account)
* Decode protobuf data to get live current speed/power/time data for currently riding players

# Usage

```
$> npm install --save zwift-mobile-api
```

```javascript
var ZwiftAccount = require("zwift-mobile-api");
var account = new ZwiftAccount(username, password);
```
