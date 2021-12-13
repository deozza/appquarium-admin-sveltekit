import Credentials from "../entities/Credentials";
import User from "../entities/User";

export default interface ServicesInterface {
  authenticateUser(credentials: Credentials): Promise<User | null>

  queryTotalUsers(jwt: string): Promise<number | null>

  getRefreshedToken(): Promise<string | null>
}
