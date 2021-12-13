export default class User {
  uid: string = ''
  email: string = ''
  jwt: Promise<string> | string
  lastSignInTime: string = ''


  constructor(jwt: Promise<string> | string) {
    this.jwt = jwt;
    this.extractUserInfoFromJwt()
  }

  private extractUserInfoFromJwt(): void {
    if (typeof this.jwt !== "string") {
      return
    }

    const tokenDecodablePart = this.jwt.split('.')[1]
    const decoded = JSON.parse(Buffer.from(tokenDecodablePart, 'base64').toString())

    this.uid = decoded.user_id
    this.email = decoded.email
  }
}
