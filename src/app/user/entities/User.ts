import jwt_decode from "jwt-decode";

export default class User {
    uid: string = ''
    email: string = ''
    jwt: string
    lastSignInTime: string = ''
    roles: Array<string> | unknown = []


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
        this.roles = decoded["https://hasura.io/jwt/claims"]["x-hasura-allowed-roles"]

        return decoded
    }
}
