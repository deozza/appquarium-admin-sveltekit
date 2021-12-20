import type UseCaseInterface from "./UseCaseInterface";

import Result from "../../../utils/useCasesResult/Result";
import UseCaseError from "../../../utils/useCasesResult/types/UseCaseError";

import Species from "../../global/entities/Species";
import SpeciesGenre from "../../global/entities/SpeciesGenre";
import SpeciesFamily from "../../global/entities/SpeciesFamily";

import Services from "../services/Services";
import {default as SpeciesServices} from "../../global/services/Services";
import User from "../../../user/entities/User";

export default class InvertebrateUseCase implements UseCaseInterface {
  async getListOfInvertebrates(jwt: string): Promise<Result> {
    let result: Result = new Result()
    const invertebrateService: Services = new Services()

    const listOfInvertebrates: Array<Species> | UseCaseError = await invertebrateService.queryGetListOfInvertebrates(jwt)

    if (listOfInvertebrates instanceof UseCaseError) {
      result.errors.push(listOfInvertebrates)
      return result
    }

    result.content = listOfInvertebrates
    result.addSuccess("Query is ok", 200)
    return result
  }

  async getInvertebrateGenres(jwt: string): Promise<Result> {
    let result: Result = new Result()
    const invertebrateService: Services = new Services()

    const invertebrateGenres: Array<SpeciesGenre> | UseCaseError = await invertebrateService.queryInvertebrateGenres(jwt)

    if (invertebrateGenres instanceof UseCaseError) {
      result.errors.push(invertebrateGenres)
      return result
    }

    result.content = invertebrateGenres
    result.addSuccess("Query is ok", 200)
    return result
  }

  async getInvertebrateFamilies(jwt: string): Promise<Result> {
    let result: Result = new Result()
    const invertebrateService: Services = new Services()

    const invertebrateFamilies: Array<SpeciesFamily> | UseCaseError = await invertebrateService.queryInvertebrateFamilies(jwt)

    if (invertebrateFamilies instanceof UseCaseError) {
      result.errors.push(invertebrateFamilies)
      return result
    }

    result.content = invertebrateFamilies
    result.addSuccess("Query is ok", 200)
    return result
  }


  initNewInvertebrate(user: User): Species {
    const speciesService: SpeciesServices = new SpeciesServices()
    return speciesService.initNewSpecies(user, 'invertebrate')
  }
}
