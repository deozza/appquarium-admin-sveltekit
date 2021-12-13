import Result from "../../utils/useCasesResult/Result";
import Credentials from "../entities/Credentials";

export default interface UseCaseInterface {
  login(credentials: Credentials): Promise<Result>

  getTotalUsers(jwt: string): Promise<Result>

  checkTokenIsValidOrRefresh(token: string): Promise<Result>
}
