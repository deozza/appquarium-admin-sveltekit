import type UseCaseInterface from "./UseCaseInterface";

import Result from "../../../utils/useCasesResult/Result";
import Error from "../../../utils/useCasesResult/types/UseCaseError";

import Species from "../../global/entities/Species";
import SpeciesGenre from "../../global/entities/SpeciesGenre";
import SpeciesFamily from "../../global/entities/SpeciesFamily";
import User from "../../../user/entities/User";

import Services from "../services/Services";
import {default as SpeciesServices} from "../../global/services/Services";

export default class FishUseCase implements UseCaseInterface {

  async getListOfFishes(jwt: string): Promise<Result> {
    let result: Result = new Result()
    const fishService: Services = new Services()

    const listOfFishes: Array<Species> | Error = await fishService.queryGetListOfFishes(jwt)

    if (listOfFishes instanceof Error) {
      result.errors.push(listOfFishes)
      return result
    }

    result.content = listOfFishes
    result.addSuccess("Query is ok", 200)
    return result
  }

  async getFishGenres(jwt: string): Promise<Result> {
    let result: Result = new Result()
    const fishService: Services = new Services()

    const fishGenres: Array<SpeciesGenre> | Error = await fishService.queryFishGenres(jwt)

    if (fishGenres instanceof Error) {
      result.errors.push(fishGenres)
      return result
    }

    result.content = fishGenres
    result.addSuccess("Query is ok", 200)
    return result
  }

  async getFishFamilies(jwt: string): Promise<Result> {
    let result: Result = new Result()
    const fishService: Services = new Services()

    const fishFamilies: Array<SpeciesFamily> | Error = await fishService.queryFishFamilies(jwt)

    if (fishFamilies instanceof Error) {
      result.errors.push(fishFamilies)
      return result
    }

    result.content = fishFamilies
    result.addSuccess("Query is ok", 200)
    return result
  }

  initNewFish(user: User): Species {
    const speciesService: SpeciesServices = new SpeciesServices()
    return speciesService.initNewSpecies(user, 'fish')
  }
}
