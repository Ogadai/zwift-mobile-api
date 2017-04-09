const axios = require('axios')
const protobuf = require('protobufjs')

const Queue = require('./Queue')

const DEFAULT_HEADERS = {
    "User-Agent": "Zwift/115 CFNetwork/758.0.2 Darwin/15.0.0"
}

const RATE_LIMIT = parseInt(process.env.ZwiftRateLimit || "5")
const _queue = new Queue(RATE_LIMIT)

class Request {
    constructor(tokenFn) {
        this.tokenFn = tokenFn
    }

    json(url) {
        return this.request(url, 'application/json', 'json')
    }

    protobuf(url) {
        return this.request(url, 'application/x-protobuf-lite', 'arraybuffer')
    }

    request(url, acceptType, responseType) {
        return this.send(url, 'get', null, acceptType, responseType)
    }

    post(url, data, acceptType, responseType) {
        return this.send(url, 'post', data, acceptType, responseType)
    }

    send(url, method, data, acceptType, responseType) {
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
                return axios(Object.assign(
                        { method, url, data },
                        this.config(acceptType, responseType, token)))
                    .then(function (response) {
                        return response.data;
                    });
            });
        });
    }

    config(acceptType, responseType, token) {
        return {
            baseURL: 'https://us-or-rly101.zwift.com',
            headers: Object.assign({}, DEFAULT_HEADERS, {
                "Accept": acceptType,
                "Authorization": "Bearer " + token
            }),
            responseType
        };
    }
}

module.exports = Request