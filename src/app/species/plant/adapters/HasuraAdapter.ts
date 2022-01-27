import HasuraClient from '../../../adapters/hasura/HasuraClient';
import type AdapterInterface from './AdapterInterface';
import UseCaseError from '../../../utils/useCasesResult/types/UseCaseError';
import Query from '../../../adapters/hasura/HasuraRequestBuilderV2/Query';

export default class HasuraAdapter extends HasuraClient implements AdapterInterface {
	async queryListOfGrowthSpeeds(): Promise<Array<string> | UseCaseError> {
		const queryBuilder: Query = new Query('query')
			.addReturnToQuery(new Query('growth_speed')
				.addReturnToQuery('name')
			)

		const query: string = queryBuilder.buildQuery()

		try {
			const data = await this.client.request(query)
			const listOfGrowthSpeeds: Array<string> = data.growth_speed
			return listOfGrowthSpeeds
		} catch (e) {
			if (e.message.includes("JWTExpired")) {
				return new UseCaseError("JWT expired", 401)

			}
			return new UseCaseError(e.message, 400)
		}	}

	async queryListOfZones(): Promise<Array<string> | UseCaseError> {
		const queryBuilder: Query = new Query('query')
			.addReturnToQuery(new Query('plant_zone')
				.addReturnToQuery('name')
			)

		const query: string = queryBuilder.buildQuery()

		try {
			const data = await this.client.request(query)
			const listOfPlantZones: Array<string> = data.plant_zone
			return listOfPlantZones
		} catch (e) {
			if (e.message.includes("JWTExpired")) {
				return new UseCaseError("JWT expired", 401)

			}
			return new UseCaseError(e.message, 400)
		}
	}

}