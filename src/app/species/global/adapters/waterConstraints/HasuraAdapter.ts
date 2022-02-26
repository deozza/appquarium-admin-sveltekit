import HasuraClient from '../../../../adapters/hasura/HasuraClient';
import type WaterConstraintsAdapterInterface from './AdapterInterface';
import type WaterConstraints from '../../entities/WaterConstraints';
import UseCaseError from '../../../../utils/useCasesResult/types/UseCaseError';
import Query from '../../../../adapters/hasura/HasuraRequestBuilderV2/Query';
import Constraints from '../../../../adapters/hasura/HasuraRequestBuilderV2/Constraints';
import ConstraintPart from '../../../../adapters/hasura/HasuraRequestBuilderV2/ConstraintPart';

export default class WaterConstraintsHasuraAdapter extends HasuraClient implements WaterConstraintsAdapterInterface {
	async mutationCreateWaterConstraints(waterConstraints: WaterConstraints): Promise<string | Array<UseCaseError>> {

		const queryBuilder: Query = new Query('mutation')
		const insertWaterConstraintsOneSubQuery: Query = new Query('insert_water_constraints_one')
			.addReturnToQuery('uuid')

		insertWaterConstraintsOneSubQuery.constraints = new Constraints()
		insertWaterConstraintsOneSubQuery.constraints.set = new ConstraintPart('object')
			.addConstraint([
				new ConstraintPart('ph_min').addConstraint('"' + waterConstraints.ph_min +  '"'),
				new ConstraintPart('ph_max').addConstraint('"' + waterConstraints.ph_max +  '"'),
				new ConstraintPart('gh_min').addConstraint(waterConstraints.gh_min.toString()),
				new ConstraintPart('gh_max').addConstraint(waterConstraints.gh_max.toString()),
				new ConstraintPart('temp_min').addConstraint(waterConstraints.temp_min.toString()),
				new ConstraintPart('temp_max').addConstraint(waterConstraints.temp_max.toString()),
				new ConstraintPart('species_uuid').addConstraint('"' + waterConstraints.species_uuid +  '"'),
			])

		queryBuilder.addReturnToQuery(insertWaterConstraintsOneSubQuery)
		const mutation: string = queryBuilder.buildQuery()

		try {
			const data = await this.client.request(mutation)
			return data.insert_water_constraints_one.uuid
		} catch (e) {
			let errors: Array<UseCaseError> = []
			if (e.message.includes("JWTExpired")) {
				errors.push(new UseCaseError("JWT expired", 401))
				return errors
			}
			errors.push(new UseCaseError(e.message, 400))
			return errors
		}
	}

	async mutationAddWaterConstraintsToSpecies(waterConstraints: WaterConstraints): Promise<WaterConstraints | UseCaseError> {

		const queryBuilder: Query = new Query('mutation')
		const updateSpeciesByPkSubQuery: Query = new Query('update_species_by_pk')
			.addReturnToQuery('uuid')

		updateSpeciesByPkSubQuery.constraints = new Constraints()
		updateSpeciesByPkSubQuery.constraints.where = new ConstraintPart('pk_columns')
			.addConstraint([
				new ConstraintPart('uuid').addConstraint('"' + waterConstraints.species_uuid + '"')
			])
		updateSpeciesByPkSubQuery.constraints.set = new ConstraintPart('_set')
			.addConstraint([
				new ConstraintPart('water_constraints_uuid').addConstraint('"' + waterConstraints.uuid + '"')
			])

		queryBuilder.addReturnToQuery(updateSpeciesByPkSubQuery)

		const mutation: string = queryBuilder.buildQuery()

		try {
			await this.client.request(mutation)
			return waterConstraints
		} catch (e) {
			if (e.message.includes("JWTExpired")) {
				return new UseCaseError("JWT expired", 401)
			}

			return new UseCaseError(e.message, 400)
		}
	}

	async mutationEditWaterConstraints(waterConstraints: WaterConstraints): Promise<WaterConstraints | Array<UseCaseError>> {
		const queryBuilder: Query = new Query('mutation')
		const updateWaterConstraintsByPkSubQuery: Query = new Query('update_water_constraints_by_pk')
			.addReturnToQuery('uuid')

		updateWaterConstraintsByPkSubQuery.constraints = new Constraints()
		updateWaterConstraintsByPkSubQuery.constraints.where = new ConstraintPart('pk_columns')
			.addConstraint([
				new ConstraintPart('uuid').addConstraint('"' + waterConstraints.uuid + '"')
			])
		updateWaterConstraintsByPkSubQuery.constraints.set = new ConstraintPart('_set')
			.addConstraint([
				new ConstraintPart('ph_min').addConstraint('"' + waterConstraints.ph_min +  '"'),
				new ConstraintPart('ph_max').addConstraint('"' + waterConstraints.ph_max +  '"'),
				new ConstraintPart('gh_min').addConstraint(waterConstraints.gh_min.toString()),
				new ConstraintPart('gh_max').addConstraint(waterConstraints.gh_max.toString()),
				new ConstraintPart('temp_min').addConstraint(waterConstraints.temp_min.toString()),
				new ConstraintPart('temp_max').addConstraint(waterConstraints.temp_max.toString()),
			])

		queryBuilder.addReturnToQuery(updateWaterConstraintsByPkSubQuery)

		const mutation: string = queryBuilder.buildQuery()

		try {
			await this.client.request(mutation)

			return waterConstraints
		} catch (e) {
			if (e.message.includes("JWTExpired")) {
				return [new UseCaseError("JWT expired", 401)]
			}
			return [new UseCaseError(e.message, 400)]
		}

	}

}
