const axios = require('axios')
const qs = require('qs')

module.exports = function getAccessToken(username, password, refreshToken = null) {
    let data
    if (refreshToken) {
        data = {
            "client_id": "Zwift_Mobile_Link",
            "refresh_token": refreshToken,
            "grant_type": "refresh_token",
        }
    } else {
        data = {
            "client_id": "Zwift_Mobile_Link",
            "username": username,
            "password": password,
            "grant_type": "password",
        }
    }

    return axios.post('/auth/realms/zwift/tokens/access/codes',
        qs.stringify(data), {
            baseURL: 'https://secure.zwift.com'
        })
}
