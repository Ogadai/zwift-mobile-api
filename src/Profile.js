const Request = require('./Request')
const zwiftProtobuf = require('./zwiftProtobuf')
const ZwiftAppConnection = require('./ZwiftAppConnection')
const Profiles = zwiftProtobuf.lookup('Profiles')

class Profile {
  constructor(id, tokenFn) {
    this.id = id
    this.request = new Request(tokenFn)
  }

  profile() {
    const idVar = this.id || 'me'
    return this.request.json(`/api/profiles/${idVar}`)
  }

  profiles(ids) {
    let idString = "?"
    for (let id of ids) {
      idString += "id=" + id + "&"
    }
    return this.request.protobuf(`/api/profiles/${idString}`)
      .then(buffer => {
        return new Promise((resolve, reject) => {
          try {
            const profiles = Profiles.decode(buffer)
            let retval = []
            for (let profile of profiles.profiles) {
              let powerSource
              if (profile.powerSource == 0) {
                powerSource = 'zPower'
              } else if (profile.powerSource == 1) {
                powerSource = 'Power Meter'
              } else if  (profile.powerSource == 2) {
                powerSource = 'Smart Trainer'
              } else {
                powerSource = profile.powerSource
              }
              retval.push({
                'id': profile.id,
                'firstName': profile.firstName,
                'lastName': profile.lastName,
                'male': Boolean(profile.male),
                'imageSrc': profile.imageSrc,
                'imageSrcLarge': null,
                'playerType': null,
                'countryAlpha3': null,
                'countryCode': profile.countryCode,
                'useMetric': null,
                'riding': null,
                'privacy': null,
                'socialFacts': null,
                'worldId': null,
                'enrolledZwiftAcademy': null,
                'playerTypeId': null,
                'playerSubTpeId': null,
                'currentActivityId': profile.currentActivityId,
                'address': null,
                'age': profile.age,
                'bodyType': null,
                'connectedToStrava': null,
                'connectedToTrainingPeaks': null,
                'connectedToTodaysPlan': null,
                'connectedToUnderArmour': null,
                'connectedToWithings': null,
                'connectedToFitbit': null,
                'connectedToGarmin': null,
                'stravaPremium': null,
                'bt': null,
                'dob': null,
                'emailAddress': null,
                'height': profile.height,
                'location': null,
                'preferredLanguage': null,
                "mixpanelDistinctId": null,
                "profileChanges": null,
                "weight": profile.weight,
                "b": null,
                "createdOn": null,
                "source": null,
                "origin": null,
                "launchedGameClient": profile.launchedGameClient,
                "achievementLevel": profile.achievementLevel,
                "totalDistance": profile.totalDistance,
                "totalDistanceClimbed": profile.totalDistanceClimbed,
                "totalTimeInMinutes": profile.totalTimeInMinutes,
                "totalInKomJersey": null,
                "totalInSprintersJersey": null,
                "totalInOrangeJersey": null,
                "totalWattHours": profile.totalWattHours,
                "totalExperiencePoints": profile.totalExperiencePoints,
                "totalGold": null,
                "powerSourceType": null,
                "powerSourceModel": powerSource,
                "virtualBikeModel": null,
                "numberOfFolloweesInCommon": null
              })
            }
            resolve(retval)
          } catch(ex) {
            console.log(`Error decoding protobuf profiles - ${ex.message}`)
            console.log(ex)

            reject({
              response: {
                status: 500,
                statusText: ex.message
              }
            })
          }
        })
      })
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

  getAppConnection() {
    this.checkId()
    return new ZwiftAppConnection(this.request, this.id)
  }
}

module.exports = Profile
