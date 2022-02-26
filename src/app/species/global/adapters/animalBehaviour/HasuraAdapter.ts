import HasuraClient from '../../../../adapters/hasura/HasuraClient';
import type AnimalBehaviourAdapterInterface from './AdapterInterface';
import type AnimalBehaviour from '../../entities/AnimalBehaviour';
import UseCaseError from '../../../../utils/useCasesResult/types/UseCaseError';
import Query from '../../../../adapters/hasura/HasuraRequestBuilderV2/Query';
import Constraints from '../../../../adapters/hasura/HasuraRequestBuilderV2/Constraints';
import ConstraintPart from '../../../../adapters/hasura/HasuraRequestBuilderV2/ConstraintPart';

export default class AnimalBehaviourHasuraAdapter extends HasuraClient implements AnimalBehaviourAdapterInterface {

	async queryListOfAlimentations(): Promise<Array<string> | UseCaseError> {

		const queryBuilder: Query = new Query('query')
			.addReturnToQuery(new Query('alimentation')
				.addReturnToQuery('name')
			)

		const query: string = queryBuilder.buildQuery()

		try {
			const data = await this.client.request(query)
			const listOfAlimentations: Array<string> = data.alimentation
			return listOfAlimentations
		} catch (e) {
			if (e.message.includes("JWTExpired")) {
				return new UseCaseError("JWT expired", 401)

			}
			return new UseCaseError(e.message, 400)
		}
	}

	async queryListOfAnimalZones(): Promise<Array<string> | UseCaseError> {

		const queryBuilder: Query = new Query('query')
			.addReturnToQuery(new Query('animal_zone')
				.addReturnToQuery('name')
			)

		const query: string = queryBuilder.buildQuery()

		try {
			const data = await this.client.request(query)
			const listOfAnimalZones: Array<string> = data.animal_zone
			return listOfAnimalZones
		} catch (e) {
			if (e.message.includes("JWTExpired")) {
				return new UseCaseError("JWT expired", 401)

			}
			return new UseCaseError(e.message, 400)
		}
	}

	async queryListOfAquariumKinds(): Promise<Array<string> | UseCaseError> {

		const queryBuilder: Query = new Query('query')
			.addReturnToQuery(new Query('aquarium_kind')
				.addReturnToQuery('name')
			)

		const query: string = queryBuilder.buildQuery()

		try {
			const data = await this.client.request(query)
			const listOfAquariumKinds: Array<string> = data.aquarium_kind
			return listOfAquariumKinds
		} catch (e) {
			if (e.message.includes("JWTExpired")) {
				return new UseCaseError("JWT expired", 401)

			}
			return new UseCaseError(e.message, 400)
		}
	}

	async queryListOfBehaviours(): Promise<Array<string> | UseCaseError> {

		const queryBuilder: Query = new Query('query')
			.addReturnToQuery(new Query('behaviour')
				.addReturnToQuery('name')
			)

		const query: string = queryBuilder.buildQuery()

		try {
			const data = await this.client.request(query)
			const listOfBehaviours: Array<string> = data.behaviour
			return listOfBehaviours
		} catch (e) {
			if (e.message.includes("JWTExpired")) {
				return new UseCaseError("JWT expired", 401)

			}
			return new UseCaseError(e.message, 400)
		}
	}

	async mutationCreateAnimalBehaviour(animalBehaviour: AnimalBehaviour): Promise<string | Array<UseCaseError>> {

		const queryBuilder: Query = new Query('mutation')
		const insertAnimalBehaviourOneSubQuery: Query = new Query('insert_animal_behaviour_one')
			.addReturnToQuery('uuid')

		console.log(animalBehaviour)

		insertAnimalBehaviourOneSubQuery.constraints = new Constraints()
		insertAnimalBehaviourOneSubQuery.constraints.set = new ConstraintPart('object')
			.addConstraint([
				new ConstraintPart('aquarium_kind').addConstraint(animalBehaviour.aquarium_kind),
				new ConstraintPart('intraspecific_behaviour').addConstraint(animalBehaviour.intraspecific_behaviour),
				new ConstraintPart('extraspecific_behaviour').addConstraint(animalBehaviour.extraspecific_behaviour),
				new ConstraintPart('female_per_male').addConstraint(animalBehaviour.female_per_male.toString()),
				new ConstraintPart('min_group').addConstraint(animalBehaviour.min_group.toString()),
				new ConstraintPart('max_group').addConstraint(animalBehaviour.max_group.toString()),
				new ConstraintPart('diurnal').addConstraint(animalBehaviour.diurnal.toString()),
				new ConstraintPart('zone').addConstraint(JSON.stringify(animalBehaviour.zone)),
				new ConstraintPart('alimentation').addConstraint(JSON.stringify(animalBehaviour.alimentation)),
				new ConstraintPart('species_uuid').addConstraint('"' + animalBehaviour.species_uuid +  '"'),

			])

		queryBuilder.addReturnToQuery(insertAnimalBehaviourOneSubQuery)
		const mutation: string = queryBuilder.buildQuery()

		console.log(mutation)

		try {
			const data = await this.client.request(mutation)
			return data.insert_animal_behaviour_one.uuid
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

	async mutationAddAnimalBehaviourToSpecies(animalBehaviour: AnimalBehaviour): Promise<AnimalBehaviour | UseCaseError> {

		const queryBuilder: Query = new Query('mutation')
		const updateSpeciesByPkSubQuery: Query = new Query('update_species_by_pk')
			.addReturnToQuery('uuid')

		updateSpeciesByPkSubQuery.constraints = new Constraints()
		updateSpeciesByPkSubQuery.constraints.where = new ConstraintPart('pk_columns')
			.addConstraint([
				new ConstraintPart('uuid').addConstraint('"' + animalBehaviour.species_uuid + '"')
			])
		updateSpeciesByPkSubQuery.constraints.set = new ConstraintPart('_set')
			.addConstraint([
				new ConstraintPart('animal_behaviour_uuid').addConstraint('"' + animalBehaviour.uuid + '"')
			])

		queryBuilder.addReturnToQuery(updateSpeciesByPkSubQuery)

		const mutation: string = queryBuilder.buildQuery()

		try {
			await this.client.request(mutation)
			return animalBehaviour
		} catch (e) {
			if (e.message.includes("JWTExpired")) {
				return new UseCaseError("JWT expired", 401)
			}

			return new UseCaseError(e.message, 400)
		}
	}

	async mutationEditAnimalBehaviour(animalBehaviour: AnimalBehaviour): Promise<AnimalBehaviour | Array<UseCaseError>> {
		const queryBuilder: Query = new Query('mutation')
		const updateAnimalBehaviourByPkSubQuery: Query = new Query('update_animal_behaviour_by_pk')
			.addReturnToQuery('uuid')

		updateAnimalBehaviourByPkSubQuery.constraints = new Constraints()
		updateAnimalBehaviourByPkSubQuery.constraints.where = new ConstraintPart('pk_columns')
			.addConstraint([
				new ConstraintPart('uuid').addConstraint('"' + animalBehaviour.uuid + '"')
			])
		updateAnimalBehaviourByPkSubQuery.constraints.set = new ConstraintPart('_set')
			.addConstraint([
				new ConstraintPart('aquarium_kind').addConstraint(animalBehaviour.aquarium_kind),
				new ConstraintPart('intraspecific_behaviour').addConstraint(animalBehaviour.intraspecific_behaviour),
				new ConstraintPart('extraspecific_behaviour').addConstraint(animalBehaviour.extraspecific_behaviour),
				new ConstraintPart('female_per_male').addConstraint(animalBehaviour.female_per_male.toString()),
				new ConstraintPart('min_group').addConstraint(animalBehaviour.min_group.toString()),
				new ConstraintPart('max_group').addConstraint(animalBehaviour.max_group.toString()),
				new ConstraintPart('diurnal').addConstraint(animalBehaviour.diurnal.toString()),
				new ConstraintPart('zone').addConstraint(JSON.stringify(animalBehaviour.zone)),
				new ConstraintPart('alimentation').addConstraint(JSON.stringify(animalBehaviour.alimentation)),
			])

		queryBuilder.addReturnToQuery(updateAnimalBehaviourByPkSubQuery)

		const mutation: string = queryBuilder.buildQuery()

		try {
			await this.client.request(mutation)

			return animalBehaviour
		} catch (e) {
			if (e.message.includes("JWTExpired")) {
				return [new UseCaseError("JWT expired", 401)]
			}
			return [new UseCaseError(e.message, 400)]
		}

	}

}
