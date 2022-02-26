import type UseCaseError from '../../../utils/useCasesResult/types/UseCaseError';
import type Species from '../../global/entities/Species';
import type SpeciesFamily from '../../global/entities/SpeciesFamily';
import type SpeciesGenre from '../../global/entities/SpeciesGenre';

export default interface ServicesInterface {
	queryGetListOfInvertebrates(jwt: string): Promise<Array<Species> | UseCaseError>;

	queryInvertebrateFamilies(jwt: string): Promise<Array<SpeciesFamily> | UseCaseError>;

	queryInvertebrateGenres(jwt: string): Promise<Array<SpeciesGenre> | UseCaseError>;
}
