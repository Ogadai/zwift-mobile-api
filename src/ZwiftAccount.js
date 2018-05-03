const getAccessToken = require('./getAccessToken')
const Profile = require('./Profile')
const World = require('./World')
const Request = require('./Request')
const Activity = require('./Activity')
const Event = require('./Event')

class ZwiftAccount {
    constructor(username, password, refreshToken = null) {
        this.username = username
        this.password = password

        this.tokenPromise = null

        this.accessToken = null
        this.suppliedRefreshToken = refreshToken;
        this.refreshToken = refreshToken
        this.refreshTokenExpiration = 0
        this.accessTokenExpiration = 0

        this.getAccessToken = this.getAccessToken.bind(this)
        this.getRefreshToken = this.getRefreshToken.bind(this)
    }

    getProfile(playerId) {
        return new Profile(playerId, this.getAccessToken)
    }

    getWorld(worldId) {
        return new World(worldId, this.getAccessToken)
    }

    getActivity(playerId) {
      return new Activity(playerId, this.getAccessToken)
    }

    getEvent() {
        return new Event(this.getAccessToken);
    }

    getRequest() {
        return new Request(this.getAccessToken)
    }

    getAccessToken(resetTokens) {
        if (resetTokens) {
            this.accessToken = null
            this.refreshToken = this.suppliedRefreshToken
            this.refreshTokenExpiration = 0
            this.accessTokenExpiration = 0
            this.tokenPromise = null
        }

        return this.getTokenPromise()
            .then(response => response.data.access_token)
    }

    getRefreshToken() {
        return this.getTokenPromise()
            .then(response => response.data.refresh_token)
    }

    getTokenPromise() {
        if (!this.tokenPromise || (this.accessTokenExpiration && (new Date()).getTime() > this.accessTokenExpiration)) {
            this.accessTokenExpiration = 0
            this.tokenPromise = getAccessToken(this.username, this.password, this.refreshToken).then((response) => {
                const now = new Date()
                const expiresIn = Math.min(response.data.expires_in - 5, 30 * 60); // Limit to 30 minutes
                this.accessTokenExpiration = now.getTime() + (expiresIn * 1000)
                this.refreshTokenExpiration  = now.getTime() + ((response.data.refresh_expires_in - 5) * 1000)
                this.refreshToken = response.data.refresh_token
                this.accessToken = response.data.access_token
                return response
            })
        }

        return this.tokenPromise
    }
}

module.exports = ZwiftAccount
