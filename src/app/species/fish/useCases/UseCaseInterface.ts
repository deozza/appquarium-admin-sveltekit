import Result from "../../../utils/useCasesResult/Result";

import Species from "../../global/entities/Species";
import User from "../../../user/entities/User";

export default interface UseCaseInterface {
  getListOfFishes(jwt: string): Promise<Result>

  getFishGenres(jwt: string): Promise<Result>

  getFishFamilies(jwt: string): Promise<Result>

  initNewFish(user: User): Species

}
