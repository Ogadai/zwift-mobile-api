import axios from 'axios';
import qs from 'qs';

export default function getAccessToken(username, password) {
    const data = {
        "client_id": "Zwift_Mobile_Link",
        "username": username,
        "password": password,
        "grant_type": "password",
    };

    return axios.post('/auth/realms/zwift/tokens/access/codes',
        qs.stringify(data), {
            baseURL: 'https://secure.zwift.com'
        })
        .then(function (response) {
            return response.data.access_token;
        })
};
