import type UseCaseError from '../../../utils/useCasesResult/types/UseCaseError';
import type Species from '../entities/Species';
import type Constraints from '../../../adapters/hasura/HasuraRequestBuilderV2/Constraints';

export default interface AdapterInterface {
	queryTotalSpecies(speciesConstraints: Constraints): Promise<number | null>;

	queryListOfSpecies(speciesConstraints: Constraints): Promise<Array<Species> | UseCaseError>;

	queryGetSpecies(uuid: string): Promise<Species | UseCaseError>;

	queryListOfSpeciesCategories(): Promise<Array<string> | UseCaseError>;

	queryListOfSpeciesOrigins(): Promise<Array<string> | UseCaseError>;

	queryListOfSpeciesByCategory(category: string): Promise<Array<Species> | UseCaseError>;

	mutationCreateSpecies(species: Species): Promise<string | UseCaseError>;

	mutationUpdateOrigin(uuid: string, origin: string): Promise<string | Array<UseCaseError>>;

	mutationUpdatePublicationState(
		uuid: string,
		nextState: string
	): Promise<string | Array<UseCaseError>>;

	mutationDeleteSpecies(uuid: string): Promise<boolean | Array<UseCaseError>>;
}
