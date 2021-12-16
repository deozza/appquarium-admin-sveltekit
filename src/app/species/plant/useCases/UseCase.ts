import type UseCaseInterface from "./UseCaseInterface";

import Result from "../../../utils/useCasesResult/Result";
import UseCaseError from "../../../utils/useCasesResult/types/UseCaseError";

import Species from "../../global/entities/Species";
import SpeciesFamily from "../../global/entities/SpeciesFamily";
import SpeciesGenre from "../../global/entities/SpeciesGenre";

import Services from "../services/Services";

export default class PlantUseCase implements UseCaseInterface {
  async getListOfPlants(jwt: string): Promise<Result> {
    let result: Result = new Result()
    const plantService: Services = new Services()

    const listOfPlants: Array<Species> | UseCaseError = await plantService.queryGetListOfPlants(jwt)

    if (listOfPlants instanceof UseCaseError) {
      result.errors.push(listOfPlants)
      return result
    }

    result.content = listOfPlants
    result.addSuccess("Query is ok", 200)
    return result
  }

  async getPlantGenres(jwt: string): Promise<Result> {
    let result: Result = new Result()
    const plantService: Services = new Services()

    const plantGenres: Array<SpeciesGenre> | UseCaseError = await plantService.queryPlantGenres(jwt)

    if (plantGenres instanceof UseCaseError) {
      result.errors.push(plantGenres)
      return result
    }

    result.content = plantGenres
    result.addSuccess("Query is ok", 200)
    return result
  }

  async getPlantFamilies(jwt: string): Promise<Result> {
    let result: Result = new Result()
    const plantService: Services = new Services()

    const plantFamilies: Array<SpeciesFamily> | UseCaseError = await plantService.queryPlantFamilies(jwt)

    if (plantFamilies instanceof UseCaseError) {
      result.errors.push(plantFamilies)
      return result
    }

    result.content = plantFamilies
    result.addSuccess("Query is ok", 200)
    return result
  }
}
