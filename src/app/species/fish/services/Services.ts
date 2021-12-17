import type ServicesInterface from "./ServicesInterface";

import Error from "../../../utils/useCasesResult/types/UseCaseError";

import Species from "../../global/entities/Species";
import SpeciesFamily from "../../global/entities/SpeciesFamily";
import SpeciesGenre from "../../global/entities/SpeciesGenre";

import SpeciesHasuraAdapter from "../../global/adapters/HasuraAdapter";

export default class Services implements ServicesInterface {

  async queryGetListOfFishes(jwt: string): Promise<Array<Species> | Error> {
    const adapter: SpeciesHasuraAdapter = new SpeciesHasuraAdapter(jwt)

    return await adapter.queryListOfSpeciesByCategory("fish")
  }

  async queryFishFamilies(jwt: string): Promise<Array<SpeciesFamily> | Error> {
    const adapter: SpeciesHasuraAdapter = new SpeciesHasuraAdapter(jwt)

    return await adapter.queryListOfSpeciesFamiliesByCategory('fish')
  }

  async queryFishGenres(jwt: string): Promise<Array<SpeciesGenre> | Error> {
    const adapter: SpeciesHasuraAdapter = new SpeciesHasuraAdapter(jwt)

    return await adapter.queryListOfSpeciesGenresByCategory('fish')
  }
}
