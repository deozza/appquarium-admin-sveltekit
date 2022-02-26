import type ServicesInterface from "./ServicesInterface";

import type UseCaseError from "../../../utils/useCasesResult/types/UseCaseError";

import type Species from "../../global/entities/Species";
import type SpeciesFamily from "../../global/entities/SpeciesFamily";
import type SpeciesGenre from "../../global/entities/SpeciesGenre";

import SpeciesHasuraAdapter from "../../global/adapters/HasuraAdapter";
import SpeciesFamiliesHasuraAdapter from '../../global/adapters/speciesNaming/speciesFamily/HasuraAdapter';
import SpeciesGenresHasuraAdapter from '../../global/adapters/speciesNaming/speciesGenre/HasuraAdapter';

export default class Services implements ServicesInterface {
    async queryGetListOfInvertebrates(jwt: string): Promise<Array<Species> | UseCaseError> {
        const adapter: SpeciesHasuraAdapter = new SpeciesHasuraAdapter(jwt)

        return await adapter.queryListOfSpeciesByCategory("invertebrate")
    }

    async queryInvertebrateFamilies(jwt: string): Promise<Array<SpeciesFamily> | UseCaseError> {
        const adapter: SpeciesFamiliesHasuraAdapter = new SpeciesFamiliesHasuraAdapter(jwt)

        return await adapter.queryListOfSpeciesFamiliesByCategory('invertebrate')
    }

    async queryInvertebrateGenres(jwt: string): Promise<Array<SpeciesGenre> | UseCaseError> {
        const adapter: SpeciesGenresHasuraAdapter = new SpeciesGenresHasuraAdapter(jwt)

        return await adapter.queryListOfSpeciesGenresByCategory('invertebrate')
    }
}
