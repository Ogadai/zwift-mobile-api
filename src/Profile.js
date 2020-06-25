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
    return this.request.json(`/api/developer/profile/${idVar}`)
  }

  profiles(ids) {
    throw new Error('Profiles list is not supported by the developer API');
    // let idString = "?"
    // for (let id of ids) {
    //   idString += "id=" + id + "&"
    // }
    // return this.request.protobuf(`/api/developer/profile/${idString}`)
    //   .then(buffer => {
    //     return new Promise((resolve, reject) => {
    //       try {
    //         const profiles = Profiles.decode(buffer)
    //         let retval = []
    //         for (let profile of profiles.profiles) {
    //           let powerSource
    //           if (profile.powerSource == 0) {
    //             powerSource = 'zPower'
    //           } else if (profile.powerSource == 1) {
    //             powerSource = 'Power Meter'
    //           } else if  (profile.powerSource == 2) {
    //             powerSource = 'Smart Trainer'
    //           } else {
    //             powerSource = profile.powerSource
    //           }
    //           retval.push({
    //             'id': profile.id,
    //             'firstName': profile.firstName,
    //             'lastName': profile.lastName,
    //             'male': Boolean(profile.male),
    //             'imageSrc': profile.imageSrc,
    //             'imageSrcLarge': null,
    //             'playerType': null,
    //             'countryAlpha3': null,
    //             'countryCode': profile.countryCode,
    //             'useMetric': null,
    //             'riding': null,
    //             'privacy': null,
    //             'socialFacts': null,
    //             'worldId': null,
    //             'enrolledZwiftAcademy': null,
    //             'playerTypeId': null,
    //             'playerSubTpeId': null,
    //             'currentActivityId': profile.currentActivityId,
    //             'address': null,
    //             'age': profile.age,
    //             'bodyType': null,
    //             'connectedToStrava': null,
    //             'connectedToTrainingPeaks': null,
    //             'connectedToTodaysPlan': null,
    //             'connectedToUnderArmour': null,
    //             'connectedToWithings': null,
    //             'connectedToFitbit': null,
    //             'connectedToGarmin': null,
    //             'stravaPremium': null,
    //             'bt': null,
    //             'dob': null,
    //             'emailAddress': null,
    //             'height': profile.height,
    //             'location': null,
    //             'preferredLanguage': null,
    //             "mixpanelDistinctId": null,
    //             "profileChanges": null,
    //             "weight": profile.weight,
    //             "b": null,
    //             "createdOn": null,
    //             "source": null,
    //             "origin": null,
    //             "launchedGameClient": profile.launchedGameClient,
    //             "achievementLevel": profile.achievementLevel,
    //             "totalDistance": profile.totalDistance,
    //             "totalDistanceClimbed": profile.totalDistanceClimbed,
    //             "totalTimeInMinutes": profile.totalTimeInMinutes,
    //             "totalInKomJersey": null,
    //             "totalInSprintersJersey": null,
    //             "totalInOrangeJersey": null,
    //             "totalWattHours": profile.totalWattHours,
    //             "totalExperiencePoints": profile.totalExperiencePoints,
    //             "totalGold": null,
    //             "powerSourceType": null,
    //             "powerSourceModel": powerSource,
    //             "virtualBikeModel": null,
    //             "numberOfFolloweesInCommon": null
    //           })
    //         }
    //         resolve(retval)
    //       } catch(ex) {
    //         console.log(`Error decoding protobuf profiles - ${ex.message}`)
    //         console.log(ex)

    //         reject({
    //           response: {
    //             status: 500,
    //             statusText: ex.message
    //           }
    //         })
    //       }
    //     })
    //   })
  }

  followers() {
    throw new Error('Followers is not supported by the developer API');
    // this.checkId()
    // return this.request.json(`/api/developer/followers/${this.id}`)
  }

  followees() {
    this.checkId()
    return this.request.json(`/api/developer/followees/${this.id}?start=0&limit=100&rnd=${Math.floor(Math.random() * 10000)}`)
  }

  activities(start, limit) {
    throw new Error('Activities are not supported by the developer API');
    // this.checkId()
    // return this.request.json(`/api/developer/profile/${this.id}/activities?start=${start || 0}&limit=${limit || 10}`)
  }

  checkId() {
    if (!this.id) {
      throw new Error('A player id is required - account.getProfile(playerId)')
    }
  }

  giveRideOn(riderId, activityId = 0) {
    throw new Error('RideOn is not supported by the developer API');
    // return this.request.post(`/api/developer/profile/${riderId}/activities/${activityId}/rideon`, {
    //   id: 0,
    //   activityId,
    //   profileId: this.id
    // }, 'application/json', 'json');
  }

  goals() {
    throw new Error('Goals are not supported by the developer API');
    // return this.request.json(`/api/developer/profile/${this.id}/goals`)
  }

  deleteGoal(goal = 0) {
    throw new Error('Goals are not supported by the developer API');
    // return this.request.delete(`/api/developer/profile/${this.id}/goals/${goal}`)
  }

  getAppConnection() {
    this.checkId()
    return new ZwiftAppConnection(this.request, this.id)
  }
}

module.exports = Profile
