import HasuraClient from '../../../../../adapters/hasura/HasuraClient';
import UseCaseError from '../../../../../utils/useCasesResult/types/UseCaseError';
import Query from '../../../../../adapters/hasura/HasuraRequestBuilderV2/Query';
import Constraints from '../../../../../adapters/hasura/HasuraRequestBuilderV2/Constraints';
import ConstraintPart from '../../../../../adapters/hasura/HasuraRequestBuilderV2/ConstraintPart';
import type SpeciesGenresAdapterInterface from './AdapterInterface';
import SpeciesGenre from '../../../entities/SpeciesGenre';

export default class SpeciesGenresHasuraAdapter extends HasuraClient implements SpeciesGenresAdapterInterface {
	async queryListOfSpeciesGenres(category: string): Promise<Array<SpeciesGenre> | UseCaseError> {

		const queryBuilder: Query = new Query('query')

		const speciesFamilySubQuery: Query = new Query('species_genre')
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
			const listOfSpeciesGenres: Array<SpeciesGenre> = data.species_genre.map((item: Array<string>) => new SpeciesGenre(item))
			return listOfSpeciesGenres
		} catch (e) {
			if (e.message.includes("JWTExpired")) {
				return new UseCaseError("JWT expired", 401)
			}
			return new UseCaseError(e.message, 400)
		}
	}

	async mutationCreateSpeciesGenre(speciesGenre: SpeciesGenre): Promise<string | UseCaseError> {

		const queryBuilder: Query = new Query('mutation')
		const insertSpeciesGenreOneSubQuery: Query = new Query('insert_species_genre_one')
			.addReturnToQuery('uuid')

		insertSpeciesGenreOneSubQuery.constraints = new Constraints()
		insertSpeciesGenreOneSubQuery.constraints.set = new ConstraintPart('object')
			.addConstraint([
				new ConstraintPart('category').addConstraint(speciesGenre.category),
				new ConstraintPart('name').addConstraint('"' + speciesGenre.name + '"'),
			])

		queryBuilder.addReturnToQuery(insertSpeciesGenreOneSubQuery)

		const mutation: string = queryBuilder.buildQuery()

		try {
			const data = await this.client.request(mutation)
			return data.insert_species_genre_one.uuid
		} catch (e) {
			if (e.message.includes("JWTExpired")) {
				return new UseCaseError("JWT expired", 401)
			}
			return new UseCaseError(e.message, 400)
		}
	}
}
