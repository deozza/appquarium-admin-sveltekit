import type Error from '../../../utils/useCasesResult/types/UseCaseError';

import type SpeciesFamily from '../../global/entities/SpeciesFamily';
import type SpeciesGenre from '../../global/entities/SpeciesGenre';

export default interface ServicesInterface {
	queryFishFamilies(jwt: string): Promise<Array<SpeciesFamily> | Error>;

	queryFishGenres(jwt: string): Promise<Array<SpeciesGenre> | Error>;
}
