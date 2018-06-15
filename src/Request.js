const axios = require('axios')
const protobuf = require('protobufjs')

const Queue = require('./Queue')

const DEFAULT_HEADERS = {
    "Accept-Encoding": "gzip",
    "User-Agent": "Zwift/115 CFNetwork/758.0.2 Darwin/15.0.0",
    "Connection": "keep-alive"
}

const RATE_LIMIT = parseInt(process.env.ZwiftRateLimit || "5")
const BASE_URL = process.env.ZwiftBaseUrl || 'https://us-or-rly101.zwift.com';
const _queue = new Queue(RATE_LIMIT)

let failureCount = 0;

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

    delete(url ) {
        return this.send(url, 'delete', null,'application/json', 'json')
    }
    request(url, acceptType, responseType) {
        return this.send(url, 'get', null, acceptType, responseType)
    }

    post(url, data, acceptType, responseType) {
        return this.send(url, 'post', data, acceptType, responseType)
    }

    send(url, method, data, acceptType, responseType) {
        return _queue.add().then(() => {
            const resetTokens = (failureCount > 10);
            if (resetTokens) {
                failureCount = 0;
            }
            return this.tokenFn(resetTokens).then(token => {
                return axios(Object.assign(
                        { method, url, data },
                        this.config(acceptType, responseType, token)))
                    .then(function (response) {
                        failureCount = 0;
                        return response.data;
                    })
                    .catch(err => {
                        failureCount += 1;
                        throw err;
                    })
            })
        });
    }

    config(acceptType, responseType, token) {
        return {
            baseURL: BASE_URL,
            headers: Object.assign({}, DEFAULT_HEADERS, {
                "Accept": acceptType,
                "Authorization": "Bearer " + token
            }),
            responseType
        };
    }
}

module.exports = Request