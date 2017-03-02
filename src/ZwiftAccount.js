import getAccessToken from './getAccessToken'
import Profile from './Profile'
import World from './World'
import Request from './Request';
import Activity from './Activity';

const TOKEN_REFRESH_MS = 10 * 60 * 1000;

class ZwiftAccount {

    constructor(username, password) {
        this.username = username;
        this.password = password;

        this.tokenPromise = null;
        this.tokenDate = null;

        this.getAccessToken = this.getAccessToken.bind(this)
    }

    getProfile(playerId) {
        return new Profile(playerId, this.getAccessToken);
    }

    getWorld(worldId) {
        return new World(worldId, this.getAccessToken);
    }

    getActivity(playerId) {
      return new Activity(playerId, this.getAccessToken);
    }

    getRequest() {
        return new Request(this.getAccessToken);
    }

    getAccessToken() {
        if (!this.tokenPromise || (new Date().getTime() - this.tokenDate.getTime() > TOKEN_REFRESH_MS)) {
            this.tokenDate = new Date();
            this.tokenPromise = getAccessToken(this.username, this.password);
        }

        return this.tokenPromise;
    }
}

export default ZwiftAccount;
