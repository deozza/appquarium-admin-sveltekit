import HasuraClient from '../../../../adapters/hasura/HasuraClient';
import type SpeciesNamingAdapterInterface from './AdapterInterface';
import type SpeciesNaming from '../../entities/SpeciesNaming';
import UseCaseError from '../../../../utils/useCasesResult/types/UseCaseError';
import Query from '../../../../adapters/hasura/HasuraRequestBuilderV2/Query';
import ConstraintPart from '../../../../adapters/hasura/HasuraRequestBuilderV2/ConstraintPart';
import Constraints from '../../../../adapters/hasura/HasuraRequestBuilderV2/Constraints';

export default class SpeciesNamingHasuraAdapter extends HasuraClient implements SpeciesNamingAdapterInterface {
	async mutationCreateNaming(speciesNaming: SpeciesNaming): Promise<string | UseCaseError> {

		const queryBuilder: Query = new Query('mutation')
		const insertSpeciesNamingOneSubQuery: Query = new Query('insert_species_naming_one')
			.addReturnToQuery('uuid')

		insertSpeciesNamingOneSubQuery.constraints = new Constraints()
		insertSpeciesNamingOneSubQuery.constraints.set = new ConstraintPart('object')
			.addConstraint([
				new ConstraintPart('name').addConstraint('"' + speciesNaming.name + '"'),
				new ConstraintPart('genre_uuid').addConstraint('"' + speciesNaming.species_genre.uuid + '"'),
				new ConstraintPart('family_uuid').addConstraint('"' + speciesNaming.species_family.uuid + '"'),
				new ConstraintPart('common_names').addConstraint(JSON.stringify(speciesNaming.common_names)),
				new ConstraintPart('old_names').addConstraint(JSON.stringify(speciesNaming.old_names)),
				new ConstraintPart('species_uuid').addConstraint('"' + speciesNaming.species_uid + '"'),
			])

		queryBuilder.addReturnToQuery(insertSpeciesNamingOneSubQuery)

		const mutation: string = queryBuilder.buildQuery()
		try {
			const data = await this.client.request(mutation)
			return data.insert_species_naming_one.uuid
		} catch (e) {
			if (e.message.includes("JWTExpired")) {
				return new UseCaseError("JWT expired", 401)
			}
			return new UseCaseError(e.message, 400)
		}
	}

	async mutationAddNamingToSpecies(speciesNaming: SpeciesNaming): Promise<SpeciesNaming | UseCaseError> {

		const queryBuilder: Query = new Query('mutation')
		const updateSpeciesByPkSubQuery: Query = new Query('update_species_by_pk')
			.addReturnToQuery('uuid')

		updateSpeciesByPkSubQuery.constraints = new Constraints()
		updateSpeciesByPkSubQuery.constraints.where = new ConstraintPart('pk_columns').addConstraint([
			new ConstraintPart('uuid').addConstraint('"' + speciesNaming.species_uid + '"')
		])

		updateSpeciesByPkSubQuery.constraints.set = new ConstraintPart('_set')
			.addConstraint([
				new ConstraintPart('naming_uuid').addConstraint('"' + speciesNaming.uuid + '"')
			])

		queryBuilder.addReturnToQuery(updateSpeciesByPkSubQuery)

		const mutation: string = queryBuilder.buildQuery()

		try {
			await this.client.request(mutation)
			return speciesNaming
		} catch (e) {
			if (e.message.includes("JWTExpired")) {
				return new UseCaseError("JWT expired", 401)
			}

			return new UseCaseError(e.message, 400)
		}
	}

	async mutationUpdateSpeciesNaming(speciesNaming: SpeciesNaming): Promise<string | UseCaseError> {

		const queryBuilder: Query = new Query('mutation')
		const updateSpeciesNamingByPkSubQuery: Query = new Query('update_species_naming_by_pk')
			.addReturnToQuery('uuid')

		updateSpeciesNamingByPkSubQuery.constraints = new Constraints()
		updateSpeciesNamingByPkSubQuery.constraints.where = new ConstraintPart('pk_columns')
			.addConstraint([
				new ConstraintPart('uuid').addConstraint('"' + speciesNaming.uuid + '"')
			])

		updateSpeciesNamingByPkSubQuery.constraints.set = new ConstraintPart('_set')
			.addConstraint([
				new ConstraintPart('genre_uuid').addConstraint('"' + speciesNaming.species_genre.uuid + '"'),
				new ConstraintPart('family_uuid').addConstraint('"' + speciesNaming.species_family.uuid + '"'),
				new ConstraintPart('name').addConstraint('"' + speciesNaming.name + '"'),
				new ConstraintPart('common_names').addConstraint(JSON.stringify(speciesNaming.common_names)),
				new ConstraintPart('old_names').addConstraint(JSON.stringify(speciesNaming.old_names)),
			])

		queryBuilder.addReturnToQuery(updateSpeciesNamingByPkSubQuery)

		const mutation: string = queryBuilder.buildQuery()

		try {
			const data = await this.client.request(mutation)
			return data.update_species_naming_by_pk.uuid
		} catch (e) {
			if (e.message.includes("JWTExpired")) {
				return new UseCaseError("JWT expired", 401)
			}
			return new UseCaseError(e.message, 400)
		}
	}

}
