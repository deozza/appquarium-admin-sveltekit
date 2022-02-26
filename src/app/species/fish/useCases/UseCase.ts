import type UseCaseInterface from "./UseCaseInterface";

import Result from "../../../utils/useCasesResult/Result";
import Error from "../../../utils/useCasesResult/types/UseCaseError";

import Species from "../../global/entities/Species";
import SpeciesGenre from "../../global/entities/SpeciesGenre";
import SpeciesFamily from "../../global/entities/SpeciesFamily";
import User from "../../../user/entities/User";

import Services from "../services/Services";
import {default as SpeciesServices} from "../../global/services/Services";
import Constraints from '../../../adapters/hasura/HasuraRequestBuilderV2/Constraints';
import ConstraintPart from '../../../adapters/hasura/HasuraRequestBuilderV2/ConstraintPart';

export default class FishUseCase implements UseCaseInterface {

    async getListOfFishes(jwt: string, filters: Array<object>, itemsPerPage: number, offset: number): Promise<Result> {
        let result: Result = new Result()
        const speciesService: SpeciesServices = new SpeciesServices()

        let speciesConstraints: Constraints = new Constraints()
        speciesConstraints.offset = offset
        speciesConstraints.limit = itemsPerPage
        filters = [
            ...filters,
            new ConstraintPart('category').addConstraint([new ConstraintPart('_eq').addConstraint('fish')])
        ]
        speciesConstraints.where = new ConstraintPart('where').addConstraint(filters)

        const listOfFishes: Array<Species> | Error = await speciesService.queryListOfSpecies(jwt, speciesConstraints)

        if (listOfFishes instanceof Error) {
            result.errors.push(listOfFishes)
            return result
        }

        result.content = listOfFishes
        result.addSuccess("Query is ok", 200)
        return result
    }

    async getTotalOfFishes(jwt: string, filters: Array<object> = []): Promise<Result> {
        let result: Result = new Result()

        let speciesConstraints: Constraints = new Constraints()

        filters = [
          ...filters,
            new ConstraintPart('category').addConstraint([new ConstraintPart('_eq').addConstraint('fish')])
        ]
        speciesConstraints.where = new ConstraintPart('where').addConstraint(filters)

        const speciesService: SpeciesServices = new SpeciesServices()
        const totalSpecies: number | null = await speciesService.queryTotalSpecies(jwt, speciesConstraints)

        if (totalSpecies === null) {
            result.addError('Query failed', 400)
            return result
        }

        result.content = totalSpecies
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
