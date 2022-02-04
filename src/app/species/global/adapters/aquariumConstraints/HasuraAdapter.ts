import HasuraClient from '../../../../adapters/hasura/HasuraClient';
import type AquariumConstraintsAdapterInterface from './AdapterInterface';
import AquariumConstraints from '../../entities/AquariumConstraints';
import UseCaseError from '../../../../utils/useCasesResult/types/UseCaseError';
import Query from '../../../../adapters/hasura/HasuraRequestBuilderV2/Query';
import Constraints from '../../../../adapters/hasura/HasuraRequestBuilderV2/Constraints';
import ConstraintPart from '../../../../adapters/hasura/HasuraRequestBuilderV2/ConstraintPart';

export default class AquariumConstraintsHasuraAdapter extends HasuraClient implements AquariumConstraintsAdapterInterface {

	async queryListOfDecors(): Promise<Array<string> | UseCaseError> {

		const queryBuilder: Query = new Query('query')
			.addReturnToQuery(new Query('decor_element')
				.addReturnToQuery('name')
			)

		const query: string = queryBuilder.buildQuery()

		try {
			const data = await this.client.request(query)
			const listOfDecors: Array<string> = data.decor_element
			return listOfDecors
		} catch (e) {
			if (e.message.includes("JWTExpired")) {
				return new UseCaseError("JWT expired", 401)

			}
			return new UseCaseError(e.message, 400)
		}
	}

	async queryListOfSoilKinds(): Promise<Array<string> | UseCaseError> {

		const queryBuilder: Query = new Query('query')
			.addReturnToQuery(new Query('soil_kind')
				.addReturnToQuery('name')
			)

		const query: string = queryBuilder.buildQuery()

		try {
			const data = await this.client.request(query)
			const listOfSoilKinds: Array<string> = data.soil_kind
			return listOfSoilKinds
		} catch (e) {
			if (e.message.includes("JWTExpired")) {
				return new UseCaseError("JWT expired", 401)

			}
			return new UseCaseError(e.message, 400)
		}
	}

	async mutationCreateAquariumConstraints(aquariumConstraints: AquariumConstraints): Promise<string | Array<UseCaseError>> {

		const queryBuilder: Query = new Query('mutation')
		const insertAquariumConstraintsOneSubQuery: Query = new Query('insert_species_aquarium_constraints_one')
			.addReturnToQuery('uuid')

		insertAquariumConstraintsOneSubQuery.constraints = new Constraints()
		insertAquariumConstraintsOneSubQuery.constraints.set = new ConstraintPart('object')
			.addConstraint([
				new ConstraintPart('min_volume').addConstraint(aquariumConstraints.min_volume.toString()),
				new ConstraintPart('max_volume').addConstraint(aquariumConstraints.max_volume.toString()),
				new ConstraintPart('min_length').addConstraint(aquariumConstraints.min_length.toString()),
				new ConstraintPart('max_height').addConstraint(aquariumConstraints.max_height.toString()),
				new ConstraintPart('soil_kind').addConstraint(aquariumConstraints.soil_kind),
				new ConstraintPart('decor').addConstraint(JSON.stringify(aquariumConstraints.decor)),
				new ConstraintPart('species_uuid').addConstraint('"' + aquariumConstraints.species_uuid +  '"'),

			])

		queryBuilder.addReturnToQuery(insertAquariumConstraintsOneSubQuery)
		const mutation: string = queryBuilder.buildQuery()

		try {
			const data = await this.client.request(mutation)
			return data.insert_species_aquarium_constraints_one.uuid
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

	async mutationAddAquariumConstraintsToSpecies(aquariumConstraints: AquariumConstraints): Promise<AquariumConstraints | UseCaseError> {

		const queryBuilder: Query = new Query('mutation')
		const updateSpeciesByPkSubQuery: Query = new Query('update_species_by_pk')
			.addReturnToQuery('uuid')

		updateSpeciesByPkSubQuery.constraints = new Constraints()
		updateSpeciesByPkSubQuery.constraints.where = new ConstraintPart('pk_columns')
			.addConstraint([
				new ConstraintPart('uuid').addConstraint('"' + aquariumConstraints.species_uuid + '"')
			])
		updateSpeciesByPkSubQuery.constraints.set = new ConstraintPart('_set')
			.addConstraint([
				new ConstraintPart('aquarium_constraints_uuid').addConstraint('"' + aquariumConstraints.uuid + '"')
			])

		queryBuilder.addReturnToQuery(updateSpeciesByPkSubQuery)

		const mutation: string = queryBuilder.buildQuery()

		try {
			await this.client.request(mutation)
			return aquariumConstraints
		} catch (e) {
			if (e.message.includes("JWTExpired")) {
				return new UseCaseError("JWT expired", 401)
			}

			return new UseCaseError(e.message, 400)
		}
	}

	async mutationEditAquariumConstraints(aquariumConstraints: AquariumConstraints): Promise<AquariumConstraints | Array<UseCaseError>> {
		const queryBuilder: Query = new Query('mutation')
		const updateAquariumConstraintsByPkSubQuery: Query = new Query('update_species_aquarium_constraints_by_pk')
			.addReturnToQuery('uuid')

		updateAquariumConstraintsByPkSubQuery.constraints = new Constraints()
		updateAquariumConstraintsByPkSubQuery.constraints.where = new ConstraintPart('pk_columns')
			.addConstraint([
				new ConstraintPart('uuid').addConstraint('"' + aquariumConstraints.uuid + '"')
			])
		updateAquariumConstraintsByPkSubQuery.constraints.set = new ConstraintPart('_set')
			.addConstraint([
				new ConstraintPart('min_volume').addConstraint(aquariumConstraints.min_volume.toString()),
				new ConstraintPart('max_volume').addConstraint(aquariumConstraints.max_volume.toString()),
				new ConstraintPart('min_length').addConstraint(aquariumConstraints.min_length.toString()),
				new ConstraintPart('max_height').addConstraint(aquariumConstraints.max_height.toString()),
				new ConstraintPart('soil_kind').addConstraint(aquariumConstraints.soil_kind),
				new ConstraintPart('decor').addConstraint(JSON.stringify(aquariumConstraints.decor)),
			])

		queryBuilder.addReturnToQuery(updateAquariumConstraintsByPkSubQuery)

		const mutation: string = queryBuilder.buildQuery()

		try {
			await this.client.request(mutation)

			return aquariumConstraints
		} catch (e) {
			if (e.message.includes("JWTExpired")) {
				return [new UseCaseError("JWT expired", 401)]
			}
			return [new UseCaseError(e.message, 400)]
		}

	}

}
