import type ServicesInterface from "./ServicesInterface";

import type Error from "../../../utils/useCasesResult/types/UseCaseError";

import type SpeciesFamily from "../../global/entities/SpeciesFamily";
import type SpeciesGenre from "../../global/entities/SpeciesGenre";

import SpeciesFamiliesHasuraAdapter from '../../global/adapters/speciesNaming/speciesFamily/HasuraAdapter';
import SpeciesGenresHasuraAdapter from '../../global/adapters/speciesNaming/speciesGenre/HasuraAdapter';

export default class Services implements ServicesInterface {

    async queryFishFamilies(jwt: string): Promise<Array<SpeciesFamily> | Error> {
        const adapter: SpeciesFamiliesHasuraAdapter = new SpeciesFamiliesHasuraAdapter(jwt)

        return await adapter.queryListOfSpeciesFamiliesByCategory('fish')
    }

    async queryFishGenres(jwt: string): Promise<Array<SpeciesGenre> | Error> {
        const adapter: SpeciesGenresHasuraAdapter = new SpeciesGenresHasuraAdapter(jwt)

        return await adapter.queryListOfSpeciesGenresByCategory('fish')
    }
}
