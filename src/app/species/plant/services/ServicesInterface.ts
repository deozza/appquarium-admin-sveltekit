import type UseCaseError from "../../../utils/useCasesResult/types/UseCaseError";
import type Species from "../../global/entities/Species";
import type SpeciesFamily from "../../global/entities/SpeciesFamily";
import type SpeciesGenre from "../../global/entities/SpeciesGenre";

export default interface ServicesInterface {
    queryGetListOfPlants(jwt: string): Promise<Array<Species> | UseCaseError>

    queryGetListOfGrowthSpeeds(jwt: string): Promise<Array<string> | UseCaseError>

    queryGetListOfZones(jwt: string): Promise<Array<string> | UseCaseError>

    queryPlantFamilies(jwt: string): Promise<Array<SpeciesFamily> | UseCaseError>

    queryPlantGenres(jwt: string): Promise<Array<SpeciesGenre> | UseCaseError>
}
