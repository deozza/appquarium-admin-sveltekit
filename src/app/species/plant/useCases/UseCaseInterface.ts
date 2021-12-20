import Result from "../../../utils/useCasesResult/Result";
import User from "../../../user/entities/User";
import Species from "../../global/entities/Species";

export default interface UseCaseInterface {
  getListOfPlants(jwt: string): Promise<Result>

  getPlantGenres(jwt: string): Promise<Result>

  getPlantFamilies(jwt: string): Promise<Result>

  initNewPlant(user: User): Species

}
