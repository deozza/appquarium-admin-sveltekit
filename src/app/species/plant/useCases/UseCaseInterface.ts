import type Result from '../../../utils/useCasesResult/Result';
import type User from '../../../user/entities/User';
import type Species from '../../global/entities/Species';

export default interface UseCaseInterface {
	getListOfPlants(jwt: string): Promise<Result>;

	getListOfGrowthSpeeds(jwt: string): Promise<Result>;

	getListOfZones(jwt: string): Promise<Result>;

	getPlantGenres(jwt: string): Promise<Result>;

	getPlantFamilies(jwt: string): Promise<Result>;

	initNewPlant(user: User): Species;
}
