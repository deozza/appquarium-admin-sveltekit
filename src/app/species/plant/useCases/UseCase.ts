import type UseCaseInterface from "./UseCaseInterface";

import Result from "../../../utils/useCasesResult/Result";
import UseCaseError from "../../../utils/useCasesResult/types/UseCaseError";

import type Species from "../../global/entities/Species";
import type SpeciesFamily from "../../global/entities/SpeciesFamily";
import type SpeciesGenre from "../../global/entities/SpeciesGenre";

import Services from "../services/Services";
import {default as SpeciesServices} from "../../global/services/Services";
import type User from "../../../user/entities/User";

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

    async getListOfGrowthSpeeds(jwt: string): Promise<Result> {
        let result: Result = new Result()
        const plantService: Services = new Services()

        const listOfGrowthSpeeds: Array<string> | UseCaseError = await plantService.queryGetListOfGrowthSpeeds(jwt)

        if (listOfGrowthSpeeds instanceof UseCaseError) {
            result.errors.push(listOfGrowthSpeeds)
            return result
        }

        result.content = listOfGrowthSpeeds
        result.addSuccess("Query is ok", 200)
        return result
    }

    async getListOfZones(jwt: string): Promise<Result> {
        let result: Result = new Result()
        const plantService: Services = new Services()

        const listOfZones: Array<string> | UseCaseError = await plantService.queryGetListOfZones(jwt)

        if (listOfZones instanceof UseCaseError) {
            result.errors.push(listOfZones)
            return result
        }

        result.content = listOfZones
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

    initNewPlant(user: User): Species {
        const speciesService: SpeciesServices = new SpeciesServices()
        return speciesService.initNewSpecies(user, 'plant')
    }
}
