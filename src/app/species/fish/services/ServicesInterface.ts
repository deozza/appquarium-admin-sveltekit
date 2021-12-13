import Error from "../../../utils/useCasesResult/types/UseCaseError";

import Species from "../../global/entities/Species";
import SpeciesFamily from "../../global/entities/SpeciesFamily";
import SpeciesGenre from "../../global/entities/SpeciesGenre";

export default interface ServicesInterface {
  queryGetListOfFishes(jwt: string): Promise<Array<Species> | Error>

  queryFishFamilies(jwt: string): Promise<Array<SpeciesFamily> | Error>

  queryFishGenres(jwt: string): Promise<Array<SpeciesGenre> | Error>
}
