import axios from 'axios';
import protobuf from 'protobufjs';

import Queue from './Queue';

const DEFAULT_HEADERS = {
    "User-Agent": "Zwift/115 CFNetwork/758.0.2 Darwin/15.0.0"
};

const _queue = new Queue(5, 1000);

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
        return _queue.add().then(() => {
            return this.tokenFn().then(token => {
                return axios.get(url, {
                    baseURL: 'https://us-or-rly101.zwift.com',
                    headers: Object.assign({}, DEFAULT_HEADERS, {
                        "Accept": acceptType,
                        "Authorization": "Bearer " + token
                    }),
                    responseType
                })
                .then(function (response) {
                    return response.data;
                })
            });
        });
    }
}

export default Request;