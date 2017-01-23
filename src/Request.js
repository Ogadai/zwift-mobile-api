import axios from 'axios';
import protobuf from 'protobufjs';

class Request {
    constructor(tokenFn) {
        this.tokenFn = tokenFn;
    }

    json(url) {
        return this.request(url, 'application/json', 'json');
    }

    protobuf(url) {
        return this.request(url, 'application/x-protobuf-lite', 'arraybuffer');
    }

    request(url, acceptType, responseType) {
        return this.tokenFn()
            .then(token => {
                return axios.get(url, {
                    baseURL: 'https://us-or-rly101.zwift.com',
                    headers: {
                        "Accept": acceptType,
                        "User-Agent": "Zwift/115 CFNetwork/758.0.2 Darwin/15.0.0",
                        "Authorization": "Bearer " + token
                    },
                    responseType
                })
                .then(function (response) {
                    return response.data;
                })
                    .catch(function (response) {
                        console.error(response);
                    })
            });
    }
}

export default Request;