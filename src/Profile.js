import Request from './Request';

class Profile {
    constructor(id, tokenFn) {
        this.id = id;
        this.request = new Request(tokenFn);
    }

    profile() {
        return this.request.json(`/api/profiles/${this.id}`);
    }

    followers() {
        return this.request.json(`/api/profiles/${this.id}/followers`);
    }

    followees() {
        return this.request.json(`/api/profiles/${this.id}/followees`);
    }
}

export default Profile;
