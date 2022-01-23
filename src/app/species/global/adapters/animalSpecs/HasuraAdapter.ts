import HasuraClient from '../../../../adapters/hasura/HasuraClient';
import UseCaseError from '../../../../utils/useCasesResult/types/UseCaseError';
import type AnimalSpecsAdapterInterface from './AdapterInterface';
import AnimalSpecs from '../../entities/AnimalSpecs';
import Query from '../../../../adapters/hasura/HasuraRequestBuilderV2/Query';
import Constraints from '../../../../adapters/hasura/HasuraRequestBuilderV2/Constraints';
import ConstraintPart from '../../../../adapters/hasura/HasuraRequestBuilderV2/ConstraintPart';

export default class AnimalSpecsHasuraAdapter extends HasuraClient implements AnimalSpecsAdapterInterface {
	async mutationCreateAnimalSpecs(animalSpecs: AnimalSpecs): Promise<string | Array<UseCaseError>> {

		const queryBuilder: Query = new Query('mutation')
		const insertAnimalSpecsOneSubQuery: Query = new Query('insert_animal_specs_one')
			.addReturnToQuery('uuid')

		insertAnimalSpecsOneSubQuery.constraints = new Constraints()
		insertAnimalSpecsOneSubQuery.constraints.set = new ConstraintPart('object')
			.addConstraint([
				new ConstraintPart('male_size').addConstraint('"' + animalSpecs.male_size + '"'),
				new ConstraintPart('female_size').addConstraint('"' + animalSpecs.female_size + '"'),
				new ConstraintPart('longevity_in_years').addConstraint(animalSpecs.longevity_in_years.toString()),
				new ConstraintPart('species_uuid').addConstraint('"' + animalSpecs.species_uuid + '"'),
			])

		queryBuilder.addReturnToQuery(insertAnimalSpecsOneSubQuery)

		const mutation: string = queryBuilder.buildQuery()

		try {
			const data = await this.client.request(mutation)
			return data.insert_animal_specs_one.uuid
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

	async mutationAddAnimalSpecsToSpecies(animalSpecs: AnimalSpecs): Promise<AnimalSpecs | UseCaseError> {

		const queryBuilder: Query = new Query('mutation')
		const updateSpeciesByPkSubQuery: Query = new Query('update_species_by_pk')
			.addReturnToQuery('uuid')

		updateSpeciesByPkSubQuery.constraints = new Constraints()
		updateSpeciesByPkSubQuery.constraints.where = new ConstraintPart('pk_columns')
			.addConstraint([
				new ConstraintPart('uuid').addConstraint('"' + animalSpecs.species_uuid + '"')
			])

		updateSpeciesByPkSubQuery.constraints.set = new ConstraintPart('_set')
			.addConstraint([
				new ConstraintPart('uuid').addConstraint('"' + animalSpecs.uuid +  '"')
			])

		queryBuilder.addReturnToQuery(updateSpeciesByPkSubQuery)

		const mutation: string = queryBuilder.buildQuery()

		try {
			await this.client.request(mutation)
			return animalSpecs
		} catch (e) {
			if (e.message.includes("JWTExpired")) {
				return new UseCaseError("JWT expired", 401)
			}

			return new UseCaseError(e.message, 400)
		}
	}

	async mutationEditAnimalSpecs(animalSpecs: AnimalSpecs): Promise<AnimalSpecs | Array<UseCaseError>> {
		const queryBuilder: Query = new Query('mutation')
		const updateAnimalSpecsByPkSubQuery: Query = new Query('update_animal_specs_by_pk')
			.addReturnToQuery('uuid')

		updateAnimalSpecsByPkSubQuery.constraints = new Constraints()
		updateAnimalSpecsByPkSubQuery.constraints.where = new ConstraintPart('pk_columns')
			.addConstraint([
				new ConstraintPart('uuid').addConstraint('"' + animalSpecs.user_uid + '"')
			])

		updateAnimalSpecsByPkSubQuery.constraints.set = new ConstraintPart('_set')
			.addConstraint([
				new ConstraintPart('male_size').addConstraint('"' + animalSpecs.male_size + '"'),
				new ConstraintPart('female_size').addConstraint('"' + animalSpecs.female_size + '"'),
				new ConstraintPart('longevity_in_years').addConstraint(animalSpecs.longevity_in_years.toString()),
			])

		queryBuilder.addReturnToQuery(updateAnimalSpecsByPkSubQuery)

		const mutation: string = queryBuilder.buildQuery()

		try {
			await this.client.request(mutation)

			return animalSpecs
		} catch (e) {
			if (e.message.includes("JWTExpired")) {
				return [new UseCaseError("JWT expired", 401)]
			}
			return [new UseCaseError(e.message, 400)]
		}

	}
}
