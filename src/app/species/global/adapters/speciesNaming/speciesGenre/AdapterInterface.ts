import type UseCaseError from '../../../../../utils/useCasesResult/types/UseCaseError';
import type SpeciesGenre from '../../../entities/SpeciesGenre';

export default interface SpeciesGenresAdapterInterface{
	queryListOfSpeciesGenresByCategory(category: string): Promise<Array<SpeciesGenre> | UseCaseError>
	mutationCreateSpeciesGenre(speciesGenre: SpeciesGenre): Promise<string | UseCaseError>
}