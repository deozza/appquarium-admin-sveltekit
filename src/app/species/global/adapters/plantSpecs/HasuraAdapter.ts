import HasuraClient from '../../../../adapters/hasura/HasuraClient';
import UseCaseError from '../../../../utils/useCasesResult/types/UseCaseError';
import type PlantSpecsAdapterInterface from './AdapterInterface';
import Query from '../../../../adapters/hasura/HasuraRequestBuilderV2/Query';
import Constraints from '../../../../adapters/hasura/HasuraRequestBuilderV2/Constraints';
import ConstraintPart from '../../../../adapters/hasura/HasuraRequestBuilderV2/ConstraintPart';
import type PlantSpecs from '../../entities/PlantSpecs';

export default class PlantSpecsHasuraAdapter
	extends HasuraClient
	implements PlantSpecsAdapterInterface
{
	async mutationCreatePlantSpecs(plantSpecs: PlantSpecs): Promise<string | Array<UseCaseError>> {
		const queryBuilder: Query = new Query('mutation');
		const insertPlantSpecsOneSubQuery: Query = new Query('insert_plant_specs_one').addReturnToQuery(
			'uuid'
		);

		insertPlantSpecsOneSubQuery.constraints = new Constraints();
		insertPlantSpecsOneSubQuery.constraints.set = new ConstraintPart('object').addConstraint([
			new ConstraintPart('size').addConstraint(plantSpecs.size.toString()),
			new ConstraintPart('zone').addConstraint(plantSpecs.zone),
			new ConstraintPart('growth_speed').addConstraint(plantSpecs.growth_speed),
			new ConstraintPart('need_in_fertilizer').addConstraint(
				plantSpecs.need_in_fertilizer.toString()
			),
			new ConstraintPart('need_in_carbone').addConstraint(plantSpecs.need_in_carbone.toString()),
			new ConstraintPart('species_uuid').addConstraint('"' + plantSpecs.species_uuid + '"')
		]);

		queryBuilder.addReturnToQuery(insertPlantSpecsOneSubQuery);

		const mutation: string = queryBuilder.buildQuery();

		try {
			const data = await this.client.request(mutation);
			return data.insert_plant_specs_one.uuid;
		} catch (e) {
			let errors: Array<UseCaseError> = [];
			if (e.message.includes('JWTExpired')) {
				errors.push(new UseCaseError('JWT expired', 401));
				return errors;
			}
			errors.push(new UseCaseError(e.message, 400));
			return errors;
		}
	}

	async mutationAddPlantSpecsToSpecies(plantSpecs: PlantSpecs): Promise<PlantSpecs | UseCaseError> {
		const queryBuilder: Query = new Query('mutation');
		const updateSpeciesByPkSubQuery: Query = new Query('update_species_by_pk').addReturnToQuery(
			'uuid'
		);

		updateSpeciesByPkSubQuery.constraints = new Constraints();
		updateSpeciesByPkSubQuery.constraints.where = new ConstraintPart('pk_columns').addConstraint([
			new ConstraintPart('uuid').addConstraint('"' + plantSpecs.species_uuid + '"')
		]);

		updateSpeciesByPkSubQuery.constraints.set = new ConstraintPart('_set').addConstraint([
			new ConstraintPart('plant_specs_uuid').addConstraint('"' + plantSpecs.uuid + '"')
		]);

		queryBuilder.addReturnToQuery(updateSpeciesByPkSubQuery);

		const mutation: string = queryBuilder.buildQuery();

		try {
			await this.client.request(mutation);
			return plantSpecs;
		} catch (e) {
			if (e.message.includes('JWTExpired')) {
				return new UseCaseError('JWT expired', 401);
			}

			return new UseCaseError(e.message, 400);
		}
	}

	async mutationEditPlantSpecs(plantSpecs: PlantSpecs): Promise<PlantSpecs | Array<UseCaseError>> {
		const queryBuilder: Query = new Query('mutation');
		const updatePlantSpecsByPkSubQuery: Query = new Query(
			'update_plant_specs_by_pk'
		).addReturnToQuery('uuid');

		updatePlantSpecsByPkSubQuery.constraints = new Constraints();
		updatePlantSpecsByPkSubQuery.constraints.where = new ConstraintPart('pk_columns').addConstraint(
			[new ConstraintPart('uuid').addConstraint('"' + plantSpecs.user_uid + '"')]
		);

		updatePlantSpecsByPkSubQuery.constraints.set = new ConstraintPart('_set').addConstraint([
			new ConstraintPart('size').addConstraint(plantSpecs.size.toString()),
			new ConstraintPart('zone').addConstraint(plantSpecs.zone),
			new ConstraintPart('growth_speed').addConstraint(plantSpecs.growth_speed),
			new ConstraintPart('need_in_fertilizer').addConstraint(
				plantSpecs.need_in_fertilizer.toString()
			),
			new ConstraintPart('need_in_carbone').addConstraint(plantSpecs.need_in_carbone.toString())
		]);

		queryBuilder.addReturnToQuery(updatePlantSpecsByPkSubQuery);

		const mutation: string = queryBuilder.buildQuery();

		try {
			await this.client.request(mutation);

			return plantSpecs;
		} catch (e) {
			if (e.message.includes('JWTExpired')) {
				return [new UseCaseError('JWT expired', 401)];
			}
			return [new UseCaseError(e.message, 400)];
		}
	}
}
