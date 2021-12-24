import type UseCaseInterface from "./UseCaseInterface";

import Result from "../../../utils/useCasesResult/Result";
import UseCaseError from "../../../utils/useCasesResult/types/UseCaseError";

import Species from "../entities/Species";
import WaterConstraints from "../entities/WaterConstraints";
import SpeciesNaming from "../entities/SpeciesNaming";
import AnimalSpecs from "../entities/AnimalSpecs";

import Services from "../services/Services";

export default class SpeciesUseCase implements UseCaseInterface {

  async getTotalSpecies(jwt: string): Promise<Result> {
    let result: Result = new Result()
    const speciesService: Services = new Services()

    const totalSpecies: number | null = await speciesService.queryTotalSpecies(jwt)

    if (totalSpecies === null) {
      result.addError('Query failed', 400)
      return result
    }

    result.content = totalSpecies
    result.addSuccess("Query is ok", 200)
    return result
  }

  async getSpecies(jwt: string, uuid: string): Promise<Result> {
    let result: Result = new Result()
    const speciesService: Services = new Services()

    const species: Species | UseCaseError = await speciesService.queryGetSpecies(jwt, uuid)

    if (species instanceof UseCaseError) {
      if (species.code === 400) {
        result.addError('Query failed', species.code)
        return result
      }

      if (species.code === 404) {
        result.addError('Species not found', species.code)
        return result
      }
    }

    result.content = species
    result.addSuccess("Query is ok", 200)
    return result
  }

  async getListOfSpecies(jwt: string): Promise<Result> {
    let result: Result = new Result()
    const speciesService: Services = new Services()

    const listOfSpecies: Array<Species> | UseCaseError = await speciesService.queryListOfSpecies(jwt)

    if (listOfSpecies instanceof UseCaseError) {
      result.errors.push(listOfSpecies)
      return result
    }

    result.content = listOfSpecies
    result.addSuccess("Query is ok", 200)
    return result
  }

  async getSpeciesCategories(jwt: string): Promise<Result> {
    let result: Result = new Result()
    const speciesService: Services = new Services()

    const speciesCategories: Array<string> | UseCaseError = await speciesService.querySpeciesCategories(jwt)

    if (speciesCategories instanceof UseCaseError) {
      result.errors.push(speciesCategories)
      return result
    }

    result.content = speciesCategories
    result.addSuccess("Query is ok", 200)
    return result
  }

  async getSpeciesOrigins(jwt: string): Promise<Result> {
    let result: Result = new Result()
    const speciesService: Services = new Services()

    const speciesOrigins: Array<string> | UseCaseError = await speciesService.querySpeciesOrigins(jwt)

    if (speciesOrigins instanceof UseCaseError) {
      result.errors.push(speciesOrigins)
      return result
    }

    result.content = speciesOrigins
    result.addSuccess("Query is ok", 200)
    return result
  }

  async createSpecies(jwt: string, species: Species): Promise<Result> {
    let result: Result = new Result()
    const speciesService: Services = new Services()

    const updatedSpecies: Species | UseCaseError = await SpeciesUseCase.handleNewSpeciesNaming(jwt, species)

    if (updatedSpecies instanceof UseCaseError) {
      result.errors.push(updatedSpecies)
      return result
    }

    const speciesResult: string | UseCaseError = await speciesService.createSpecies(jwt, updatedSpecies)

    if (speciesResult instanceof UseCaseError) {
      result.errors.push(speciesResult)
      return result
    }

    result.addSuccess('Query is OK', 201)
    result.content = speciesResult
    return result
  }

  async updateGeneralInfos(jwt: string, species: Species): Promise<Result> {
    let result: Result = new Result()
    const speciesService: Services = new Services()

    const editedSpecies: string | Array<UseCaseError> = await speciesService.updateGeneralInfos(jwt, species.uuid, species.origin)
    if (typeof editedSpecies !== 'string') {
      result.errors = editedSpecies
      return result
    }

    result.addSuccess('Query is OK', 200)
    return result
  }

  async updateSpeciesNaming(jwt: string, species: Species): Promise<Result> {
    let result: Result = new Result()
    const speciesService: Services = new Services()

    const updatedSpecies: Species | UseCaseError = await SpeciesUseCase.handleNewSpeciesNaming(jwt, species)

    if (updatedSpecies instanceof UseCaseError) {
      result.errors.push(updatedSpecies)
      return result
    }

    const editedSpecies: SpeciesNaming | UseCaseError = await speciesService.updateSpeciesNaming(jwt, updatedSpecies.species_naming)
    if (editedSpecies instanceof UseCaseError) {
      result.errors.push(editedSpecies)
      return result
    }

    result.addSuccess('Query is OK', 200)
    return result
  }

  private static async handleNewSpeciesNaming(jwt: string, species: Species): Promise<Species | UseCaseError> {
    const speciesService: Services = new Services()

    if (species.species_naming.species_family.uuid === '') {
      const newSpeciesFamily: string | UseCaseError = await speciesService.createSpeciesFamily(jwt, species.species_naming.species_family)
      if (newSpeciesFamily instanceof UseCaseError) {
        return newSpeciesFamily
      }

      species.species_naming.species_family.uuid = newSpeciesFamily
    }

    if (species.species_naming.species_genre.uuid === '') {
      const newSpeciesGenre: string | UseCaseError = await speciesService.createSpeciesGenre(jwt, species.species_naming.species_genre)
      if (newSpeciesGenre instanceof UseCaseError) {
        return newSpeciesGenre
      }

      species.species_naming.species_genre.uuid = newSpeciesGenre
    }

    return species
  }

  async updateWaterConstraints(jwt: string, species: Species): Promise<Result> {
    let result: Result = new Result()
    const speciesService: Services = new Services()
    const updatedWaterConstraints: WaterConstraints | Array<UseCaseError> = await speciesService.updateWaterConstraints(jwt, species.water_constraint)

    if (updatedWaterConstraints instanceof WaterConstraints) {
      result.addSuccess('Query is OK', 200)
      return result
    }

    result.errors = updatedWaterConstraints
    return result

  }

  async addWaterConstraints(jwt: string, species: Species): Promise<Result> {
    let result: Result = new Result()
    const speciesService: Services = new Services()
    const waterConstraintsUuid: string | Array<UseCaseError> = await speciesService.createWaterConstraints(jwt, species.uuid, species.water_constraint)

    if (typeof waterConstraintsUuid !== 'string') {
      result.errors = waterConstraintsUuid
      return result
    }

    species.water_constraint.uuid = waterConstraintsUuid

    const updatedSpecies: WaterConstraints | UseCaseError = await speciesService.addWaterConstraintsToSpecies(jwt, species.uuid, species.water_constraint)

    if (updatedSpecies instanceof UseCaseError) {
      result.errors.push(updatedSpecies)
      return result
    }

    result.addSuccess('Query is OK', 201)
    result.content = waterConstraintsUuid
    return result
  }

  async updateAnimalSpecs(jwt: string, species: Species): Promise<Result> {
    let result: Result = new Result()
    const speciesService: Services = new Services()
    const updatedAnimalSpecs: AnimalSpecs | Array<UseCaseError> = await speciesService.updateAnimalSpecs(jwt, species.animal_specs)

    if (updatedAnimalSpecs instanceof AnimalSpecs) {
      result.addSuccess('Query is OK', 200)
      return result
    }

    result.errors = updatedAnimalSpecs
    return result

  }

  async addAnimalSpecs(jwt: string, species: Species): Promise<Result> {
    let result: Result = new Result()
    const speciesService: Services = new Services()
    const animalSpecsUuid: string | Array<UseCaseError> = await speciesService.createAnimalSpecs(jwt, species.uuid, species.animal_specs)

    if (typeof animalSpecsUuid !== 'string') {
      result.errors = animalSpecsUuid
      return result
    }

    species.animal_specs.uuid = animalSpecsUuid

    const updatedSpecies: AnimalSpecs | UseCaseError = await speciesService.addAnimalSpecsToSpecies(jwt, species.uuid, species.animal_specs)

    if (updatedSpecies instanceof UseCaseError) {
      result.errors.push(updatedSpecies)
      return result
    }

    result.content = animalSpecsUuid
    result.addSuccess('Query is OK', 201)
    return result
  }

  async updatePublicationState(jwt: string, species: Species, nextState: string): Promise<Result> {
    let result: Result = new Result()
    const speciesService: Services = new Services()

    const isAbleToMoveToState: boolean | Array<UseCaseError> = await speciesService.checkNextState(species, nextState)

    if (typeof isAbleToMoveToState !== 'boolean') {
      result.errors = isAbleToMoveToState
      return result
    }

    const speciesPublicationState: string | Array<UseCaseError> = await speciesService.updatePublicationState(jwt, species.uuid, nextState)

    if (typeof speciesPublicationState !== 'string') {
      result.errors = speciesPublicationState
      return result
    }

    result.content = speciesPublicationState
    result.addSuccess('Query is OK', 200)
    return result
  }

  async deleteSpecies(jwt: string, species: Species): Promise<Result> {
    let result: Result = new Result()
    const speciesService: Services = new Services()

    const isSpeciesDeleted: boolean | Array<UseCaseError> = await speciesService.deleteSpecies(jwt, species.uuid)

    if (typeof isSpeciesDeleted !== "boolean") {
      result.errors = isSpeciesDeleted
      return result
    }

    result.addSuccess('Resource is deleted', 204)
    return result
  }

}
