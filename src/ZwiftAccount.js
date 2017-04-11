const getAccessToken = require('./getAccessToken')
const Profile = require('./Profile')
const World = require('./World')
const Request = require('./Request')
const Activity = require('./Activity')

const TOKEN_REFRESH_MS = 10 * 60 * 1000

class ZwiftAccount {
    constructor(username, password, refreshToken = null) {
        this.username = username
        this.password = password

        this.tokenPromise = null
        this.tokenDate = null

        this.refreshToken = refreshToken
        this.refreshTokenExpiration = 0
        this.accessTokenExpiration = 0

        this.getAccessToken = this.getAccessToken.bind(this)
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

    getRequest() {
        return new Request(this.getAccessToken)
    }

    getAccessToken() {
        const now = new Date()
        if (!this.tokenPromise || (now.getTime() > this.accessTokenExpiration)) {
            this.getNewTokens()
        }

        return this.tokenPromise
    }

    getRefreshToken() {
        return this.getAccessToken().then(() => {
            return this.refreshToken, this.refreshTokenExpiration
        })
    }

    getNewTokens() {
        const now = new Date()
        this.tokenDate = now
        this.tokenPromise = getAccessToken(this.username, this.password, this.refreshToken).then((response) => {
            const now = new Date()
            this.accessTokenExpiration = now.getTime() + ((response.data.expires_in - 5) * 1000)
            this.refreshTokenExpiration  = now.getTime() + ((response.data.refresh_expires_in - 5) * 1000)
            this.refreshToken = response.data.refresh_token
            this.accessToken = response.data.access_token
            return response.data.access_token, this.accessTokenExpiration
        })
        return this.tokenPromise
    }
}

module.exports = ZwiftAccount
