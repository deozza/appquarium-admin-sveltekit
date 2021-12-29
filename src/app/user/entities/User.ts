import jwt_decode from "jwt-decode";

export default class User {
    uid: string = ''
    email: string = ''
    jwt: string
    lastSignInTime: string = ''


    constructor(jwt: string) {
        this.jwt = jwt;
    }

    extractUserInfoFromJwt(): object {

        if (this.jwt === '') {
            return
        }

        const decoded = jwt_decode(this.jwt)

        this.uid = decoded.user_id
        this.email = decoded.email

        return decoded
    }
}
