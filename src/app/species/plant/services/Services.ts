import type ServicesInterface from "./ServicesInterface";

import UseCaseError from "../../../utils/useCasesResult/types/UseCaseError";

import Species from "../../global/entities/Species";
import SpeciesFamily from "../../global/entities/SpeciesFamily";
import SpeciesGenre from "../../global/entities/SpeciesGenre";

import SpeciesHasuraAdapter from "../../global/adapters/HasuraAdapter";
import SpeciesFamiliesHasuraAdapter from '../../global/adapters/speciesNaming/speciesFamily/HasuraAdapter';
import SpeciesGenresHasuraAdapter from '../../global/adapters/speciesNaming/speciesGenre/HasuraAdapter';

export default class Services implements ServicesInterface {

    async queryGetListOfPlants(jwt: string): Promise<Array<Species> | UseCaseError> {
        const adapter: SpeciesHasuraAdapter = new SpeciesHasuraAdapter(jwt)

        return await adapter.queryListOfSpeciesByCategory("plant")
    }

    async queryPlantFamilies(jwt: string): Promise<Array<SpeciesFamily> | UseCaseError> {
        const adapter: SpeciesFamiliesHasuraAdapter = new SpeciesFamiliesHasuraAdapter(jwt)

        return await adapter.queryListOfSpeciesFamiliesByCategory('plant')
    }

    async queryPlantGenres(jwt: string): Promise<Array<SpeciesGenre> | UseCaseError> {
        const adapter: SpeciesGenresHasuraAdapter = new SpeciesGenresHasuraAdapter(jwt)

        return await adapter.queryListOfSpeciesGenresByCategory('plant')
    }
}
