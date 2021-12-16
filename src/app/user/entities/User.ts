export default class User {
  uid: string = ''
  email: string = ''
  jwt: Promise<string> | string
  lastSignInTime: string = ''


  constructor(jwt: Promise<string> | string) {
    this.jwt = jwt;
  }
}
