import UseCaseError from "../../../utils/useCasesResult/types/UseCaseError";
import Species from "../entities/Species";

export default interface AdapterInterface {
    queryTotalSpecies(): Promise<number | null>

    queryListOfSpecies(): Promise<Array<Species> | UseCaseError>

    queryGetSpecies(uuid: string): Promise<Species | UseCaseError>

    queryListOfSpeciesCategories(): Promise<Array<string> | UseCaseError>

    queryListOfSpeciesOrigins(): Promise<Array<string> | UseCaseError>

    queryListOfSpeciesByCategory(category: string): Promise<Array<Species> | UseCaseError>

    mutationCreateSpecies(species: Species): Promise<string | UseCaseError>

    mutationUpdateOrigin(uuid: string, origin: string): Promise<string | Array<UseCaseError>>

    mutationUpdatePublicationState(uuid: string, nextState: string): Promise<string | Array<UseCaseError>>

    mutationDeleteSpecies(uuid: string): Promise<boolean | Array<UseCaseError>>
}
