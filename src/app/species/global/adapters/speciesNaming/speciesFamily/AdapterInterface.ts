import type SpeciesFamily from '../../../entities/SpeciesFamily';
import type UseCaseError from '../../../../../utils/useCasesResult/types/UseCaseError';

export default interface SpeciesFamiliesAdapterInterface{
	queryListOfSpeciesFamiliesByCategory(category: string): Promise<Array<SpeciesFamily> | UseCaseError>
	mutationCreateSpeciesFamily(speciesFamily: SpeciesFamily): Promise<string | UseCaseError>
}