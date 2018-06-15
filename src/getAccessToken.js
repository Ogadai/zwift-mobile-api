const axios = require('axios')
const qs = require('qs')

const SECURE_URL = process.env.ZwiftSecureUrl || 'https://secure.zwift.com/auth/realms/zwift/tokens/access/codes';

module.exports = function getAccessToken(username, password, refreshToken = null) {
    let data
    if (refreshToken) {
        data = {
            "client_id": "Developer Client",
            "refresh_token": refreshToken,
            "grant_type": "refresh_token",
        }
    } else {
        data = {
            "client_id": "Developer Client",
            "username": username,
            "password": password,
            "grant_type": "password",
        }
    }

    return axios.post(SECURE_URL, qs.stringify(data))
}
