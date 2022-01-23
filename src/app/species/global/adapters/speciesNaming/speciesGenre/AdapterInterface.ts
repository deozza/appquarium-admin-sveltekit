import UseCaseError from '../../../../../utils/useCasesResult/types/UseCaseError';
import SpeciesGenre from '../../../entities/SpeciesGenre';

export default interface SpeciesGenresAdapterInterface{
	queryListOfSpeciesGenres(category: string): Promise<Array<SpeciesGenre> | UseCaseError>
	mutationCreateSpeciesGenre(speciesGenre: SpeciesGenre): Promise<string | UseCaseError>
}