const Request = require('./Request')

class Profile {
  constructor(id, tokenFn) {
    this.id = id
    this.request = new Request(tokenFn)
  }

  profile() {
    const idVar = this.id || 'me'
    return this.request.json(`/api/profiles/${idVar}`)
  }

  followers() {
    this.checkId()
    return this.request.json(`/api/profiles/${this.id}/followers`)
  }

  followees() {
    this.checkId()
    return this.request.json(`/api/profiles/${this.id}/followees`)
  }

  activities(start, limit) {
    this.checkId()
    return this.request.json(`/api/profiles/${this.id}/activities?start=${start || 0}&limit=${limit || 10}`)
  }

  checkId() {
    if (!this.id) {
      throw new Error('A player id is required - account.getProfile(playerId)')
    }
  }
}

module.exports = Profile
