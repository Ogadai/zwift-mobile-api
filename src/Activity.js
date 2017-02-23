import axios from 'axios';
import EasyFit from 'easy-fit';

import Request from './Request';
import mapLatLong from './mapLatLong';

class Activity {
  constructor(id, tokenFn) {
    this.id = id;
    this.request = new Request(tokenFn);
  }

  list() {
    return this.request.json(`/api/profiles/${this.id}/activities`);
  }

  get(activityId) {
    return this.getActivity(activityId)
      .then(activityData => {
        const { fitFileBucket, fitFileKey } = activityData;

        return this.downloadFitFile(fitFileBucket, fitFileKey)
          .then(response => this.decodeFitFile(response.data))
          .then(fitData => this.processFitData(activityData, fitData));
      })
  }

  getActivity(activityId) {
    return this.request.json(`/api/profiles/${this.id}/activities/${activityId}`);
  }

  downloadFitFile(fitFileBucket, fitFileKey) {
    const url = `https://${fitFileBucket}.s3.amazonaws.com/${fitFileKey}`;

    return axios.get(url, { responseType: 'arraybuffer' });
  }

  decodeFitFile(rawFit) {
    return new Promise((resolve, reject) => {

      // Create a EasyFit instance (options argument is optional)
      var easyFit = new EasyFit({
        force: true,
        speedUnit: 'km/h',
        lengthUnit: 'km',
        temperatureUnit: 'kelvin',
        elapsedRecordField: true,
        mode: 'list'
      });

      // Parse your file 
      easyFit.parse(rawFit, function (error, data) {
        // Handle result of parse method 
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }

  processFitData(activityData, fitData) {
    const { worldId, name } = activityData;
    const { firstName, lastName } = activityData.profile;
    const records = fitData.records;

    const positions = records
      .filter((r, i) => i % 3 === 1)
      .map(r => this.processFitRecord(worldId, r));

    return {
      worldId,
      name,
      firstName,
      lastName,
      positions
    };
  }

  processFitRecord(worldId, record) {
    const { elapsed_time, position_lat, position_long, speed, power, cadence } = record;
    const position = this.mapPosition(worldId, position_lat, position_long);

    return {
      time: elapsed_time,
      x: position.x,
      y: position.y,
      speed,
      power,
      cadence
    };
  }

  mapPosition(worldId, lat, long) {
    const mapFn = mapLatLong[worldId] ? mapLatLong[worldId].toXY : null;

    if (mapFn) {
      return mapFn(lat, long);
    }

    return {
      x: long,
      y: lat
    }
  }
}

export default Activity;
