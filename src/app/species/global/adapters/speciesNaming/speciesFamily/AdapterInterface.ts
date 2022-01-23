import SpeciesFamily from '../../../entities/SpeciesFamily';
import UseCaseError from '../../../../../utils/useCasesResult/types/UseCaseError';

export default interface SpeciesFamiliesAdapterInterface{
	queryListOfSpeciesFamilies(category: string): Promise<Array<SpeciesFamily> | UseCaseError>
	mutationCreateSpeciesFamily(speciesFamily: SpeciesFamily): Promise<string | UseCaseError>
}