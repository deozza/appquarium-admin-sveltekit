import User from "../entities/User";

export default interface ServicesInterface {
  authenticateUser(email: string, password: string): Promise<User | null>

  queryTotalUsers(jwt: string): Promise<number | null>

  getRefreshedToken(): Promise<string | null>

  setCookie(user: User): User | null
}
