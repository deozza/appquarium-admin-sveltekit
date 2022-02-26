import Error from "../../../utils/useCasesResult/types/UseCaseError";

import SpeciesFamily from "../../global/entities/SpeciesFamily";
import SpeciesGenre from "../../global/entities/SpeciesGenre";

export default interface ServicesInterface {

    queryFishFamilies(jwt: string): Promise<Array<SpeciesFamily> | Error>

    queryFishGenres(jwt: string): Promise<Array<SpeciesGenre> | Error>
}
