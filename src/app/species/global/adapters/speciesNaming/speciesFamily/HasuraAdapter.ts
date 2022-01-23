import type SpeciesFamiliesAdapterInterface from './AdapterInterface';
import HasuraClient from '../../../../../adapters/hasura/HasuraClient';
import SpeciesFamily from '../../../entities/SpeciesFamily';
import UseCaseError from '../../../../../utils/useCasesResult/types/UseCaseError';
import Query from '../../../../../adapters/hasura/HasuraRequestBuilderV2/Query';
import Constraints from '../../../../../adapters/hasura/HasuraRequestBuilderV2/Constraints';
import ConstraintPart from '../../../../../adapters/hasura/HasuraRequestBuilderV2/ConstraintPart';

export default class SpeciesFamiliesHasuraAdapter extends HasuraClient implements SpeciesFamiliesAdapterInterface {
	async queryListOfSpeciesFamilies(category: string): Promise<Array<SpeciesFamily> | UseCaseError> {

		const queryBuilder: Query = new Query('query')

		const speciesFamilySubQuery: Query = new Query('species_family')
			.addReturnToQuery('uuid')
			.addReturnToQuery('name')
			.addReturnToQuery('category')
			.addReturnToQuery('user_uid')

		speciesFamilySubQuery.constraints = new Constraints()
		speciesFamilySubQuery.constraints.where = new ConstraintPart('where')
			.addConstraint([
				new ConstraintPart('category').addConstraint([
					new ConstraintPart('_eq').addConstraint(category)
				])
			])

		queryBuilder.addReturnToQuery(speciesFamilySubQuery)

		const query: string = queryBuilder.buildQuery()

		try {
			const data = await this.client.request(query)
			const listOfSpeciesFamilies: Array<SpeciesFamily> = data.species_family.map((item: Array<string>) => new SpeciesFamily(item))
			return listOfSpeciesFamilies
		} catch (e) {
			if (e.message.includes("JWTExpired")) {
				return new UseCaseError("JWT expired", 401)
			}
			return new UseCaseError(e.message, 400)
		}
	}

	async mutationCreateSpeciesFamily(speciesFamily: SpeciesFamily): Promise<string | UseCaseError> {

		const queryBuilder: Query = new Query('mutation')
		const insertSpeciesFamilyOneSubQuery: Query = new Query('insert_species_family_one')
			.addReturnToQuery('uuid')

		insertSpeciesFamilyOneSubQuery.constraints = new Constraints()
		insertSpeciesFamilyOneSubQuery.constraints.set = new ConstraintPart('object')
			.addConstraint([
				new ConstraintPart('category').addConstraint(speciesFamily.category),
				new ConstraintPart('name').addConstraint('"' + speciesFamily.name + '"'),
			])

		queryBuilder.addReturnToQuery(insertSpeciesFamilyOneSubQuery)

		const mutation: string = queryBuilder.buildQuery()

		try {
			const data = await this.client.request(mutation)
			return data.insert_species_family_one.uuid
		} catch (e) {
			if (e.message.includes("JWTExpired")) {
				return new UseCaseError("JWT expired", 401)
			}
			return new UseCaseError(e.message, 400)
		}
	}
}
