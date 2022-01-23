import type AdapterInterface from "./AdapterInterface";

import UseCaseError from "../../../utils/useCasesResult/types/UseCaseError";
import HasuraQueryBuilder from "../../../adapters/hasura/HasuraRequestBuilder/HasuraQueryBuilder";
import HasuraMutationInsertBuilder from "../../../adapters/hasura/HasuraRequestBuilder/HasuraMutationInsertBuilder";
import HasuraMutationUpdateBuilder from "../../../adapters/hasura/HasuraRequestBuilder/HasuraMutationUpdateBuilder";
import HasuraMutationDeleteBuilder from "../../../adapters/hasura/HasuraRequestBuilder/HasuraMutationDeleteBuilder";

import Species from "../entities/Species";
import SpeciesGenre from "../entities/SpeciesGenre";
import SpeciesFamily from "../entities/SpeciesFamily";
import WaterConstraints from "../entities/WaterConstraints";
import SpeciesNaming from "../entities/SpeciesNaming";
import AnimalSpecs from "../entities/AnimalSpecs";
import HasuraClient from "../../../adapters/hasura/HasuraClient";
import Query from '../../../adapters/hasura/HasuraRequestBuilderV2/Query';
import Constraints from '../../../adapters/hasura/HasuraRequestBuilderV2/Constraints';
import ConstraintPart from '../../../adapters/hasura/HasuraRequestBuilderV2/ConstraintPart';
import { insert } from 'svelte/internal';

export default class HasuraAdapter extends HasuraClient implements AdapterInterface {

    async queryTotalSpecies(): Promise<number | null> {

        const queryBuilder: Query = new Query('query')

        const speciesAggregateSubQuery: Query = new Query('species_aggregate')
          .addReturnToQuery(new Query('aggregate')
            .addReturnToQuery('count')
          )

        queryBuilder.addReturnToQuery(speciesAggregateSubQuery)

        const query: string = queryBuilder.buildQuery()

        try {
            const data = await this.client.request(query)
            const totalSpecies: number = data.species_aggregate.aggregate.count
            return totalSpecies
        } catch (e) {
            return null
        }
    }

    async queryListOfSpecies(): Promise<Array<Species> | UseCaseError> {

        const queryBuilder: Query = new Query('query')

        const speciesSubQuery: Query = new Query('species')
          .addReturnToQuery('uuid')
          .addReturnToQuery('category')
          .addReturnToQuery('publication_state')
          .addReturnToQuery('created_at')
          .addReturnToQuery('updated_at')
          .addReturnToQuery(new Query('naming')
            .addReturnToQuery('name')
            .addReturnToQuery(new Query('species_genre')
              .addReturnToQuery('name')
            )
          )

        speciesSubQuery.constraints = new Constraints()
        speciesSubQuery.constraints.orderBy = new ConstraintPart('order_by')
          .addConstraint([
            new ConstraintPart('created_at').addConstraint('asc')
          ])

        queryBuilder.addReturnToQuery(speciesSubQuery)

        const query: string = queryBuilder.buildQuery()

        try {
            const data = await this.client.request(query)
            const listOfSpecies: Array<Species> = data.species.map((item: Array<string>) => new Species(item))
            return listOfSpecies
        } catch (e) {
            if (e.message.includes("JWTExpired")) {
                return new UseCaseError("JWT expired", 401)

            }
            return new UseCaseError(e.message, 400)
        }
    }

    async queryGetSpecies(uuid: string): Promise<Species | UseCaseError> {

        const queryBuilder: Query = new Query('query')

        const speciesByPkSubQuery: Query = new Query('species_by_pk')
          .addReturnToQuery('uuid')
          .addReturnToQuery('created_at')
          .addReturnToQuery('updated_at')
          .addReturnToQuery('category')
          .addReturnToQuery('origin')
          .addReturnToQuery('publication_state')
          .addReturnToQuery(new Query('naming')
            .addReturnToQuery('uuid')
            .addReturnToQuery('created_at')
            .addReturnToQuery('updated_at')
            .addReturnToQuery('species_uuid')
            .addReturnToQuery('name')
            .addReturnToQuery('common_names')
            .addReturnToQuery('old_names')
            .addReturnToQuery(new Query('species_family')
              .addReturnToQuery('name')
              .addReturnToQuery('uuid')
            )
            .addReturnToQuery(new Query('species_genre')
              .addReturnToQuery('name')
              .addReturnToQuery('uuid')
            )
          )
          .addReturnToQuery(new Query('water_constraints')
            .addReturnToQuery('uuid')
            .addReturnToQuery('created_at')
            .addReturnToQuery('updated_at')
            .addReturnToQuery('species_uuid')
            .addReturnToQuery('ph_min')
            .addReturnToQuery('ph_max')
            .addReturnToQuery('gh_min')
            .addReturnToQuery('gh_max')
            .addReturnToQuery('temp_min')
            .addReturnToQuery('temp_max')
          )
          .addReturnToQuery(new Query('animal_specs')
            .addReturnToQuery('uuid')
            .addReturnToQuery('created_at')
            .addReturnToQuery('updated_at')
            .addReturnToQuery('species_uuid')
            .addReturnToQuery('male_size')
            .addReturnToQuery('female_size')
            .addReturnToQuery('longevity_in_years')
          )
          .addReturnToQuery(new Query('medias')
            .addReturnToQuery('url')
            .addReturnToQuery('title')
            .addReturnToQuery('source')
            .addReturnToQuery('thumbnail')
            .addReturnToQuery('associated_to')
          )

        speciesByPkSubQuery.constraints = new Constraints()
        speciesByPkSubQuery.constraints.where = new ConstraintPart('uuid').addConstraint('"' + uuid + '"')

        queryBuilder.addReturnToQuery(speciesByPkSubQuery)

        const query: string = queryBuilder.buildQuery()

        try {
            const data = await this.client.request(query)

            return new Species(data.species_by_pk)
        } catch (e) {
            if (e.message.includes("JWTExpired")) {
                return new UseCaseError("JWT expired", 401)

            }
            return new UseCaseError(e.message, 400)
        }
    }


    async queryListOfSpeciesCategories(): Promise<Array<string> | UseCaseError> {

        const queryBuilder: Query = new Query('query')
          .addReturnToQuery(new Query('species_categories')
            .addReturnToQuery('name')
          )

        const query: string = queryBuilder.buildQuery()

        try {
            const data = await this.client.request(query)
            const listOfSpeciesCategories: Array<string> = data.species_categories
            return listOfSpeciesCategories
        } catch (e) {
            if (e.message.includes("JWTExpired")) {
                return new UseCaseError("JWT expired", 401)

            }
            return new UseCaseError(e.message, 400)
        }
    }

    async queryListOfSpeciesOrigins(): Promise<Array<string> | UseCaseError> {

        const queryBuilder: Query = new Query('query')
          .addReturnToQuery(new Query('species_origin')
            .addReturnToQuery('name')
          )

        const query: string = queryBuilder.buildQuery()

        try {
            const data = await this.client.request(query)
            const listOfSpeciesOrigins: Array<string> = data.species_origin
            return listOfSpeciesOrigins
        } catch (e) {
            if (e.message.includes("JWTExpired")) {
                return new UseCaseError("JWT expired", 401)

            }
            return new UseCaseError(e.message, 400)
        }
    }

    async queryListOfSpeciesByCategory(category: string): Promise<Array<Species> | UseCaseError> {

        const queryBuilder: Query = new Query('query')
        const speciesSubQuery: Query = new Query('species')
          .addReturnToQuery('uuid')
          .addReturnToQuery('created_at')
          .addReturnToQuery('updated_at')
          .addReturnToQuery('category')
          .addReturnToQuery('publication_state')
          .addReturnToQuery(new Query('naming')
            .addReturnToQuery('name')
            .addReturnToQuery(new Query('species_genre')
              .addReturnToQuery('name')
            )
          )

        speciesSubQuery.constraints = new Constraints()
        speciesSubQuery.constraints.where = new ConstraintPart('where').addConstraint([
          new ConstraintPart('category').addConstraint([new ConstraintPart('_eq').addConstraint(category)])
        ])

        speciesSubQuery.constraints.orderBy = new ConstraintPart('order_by').addConstraint([
            new ConstraintPart('created_at').addConstraint('asc')
          ])

        queryBuilder.addReturnToQuery(speciesSubQuery)

        const query: string = queryBuilder.buildQuery()

        try {
            const data = await this.client.request(query, {
                category: category
            })

            const listOfSpecies: Array<Species> = data.species.map((item: Array<string>) => new Species(item))
            return listOfSpecies
        } catch (e) {
            if (e.message.includes("JWTExpired")) {
                return new UseCaseError("JWT expired", 401)
            }
            return new UseCaseError(e.message, 400)
        }
    }

    async mutationCreateSpecies(species: Species): Promise<string | UseCaseError> {
        const queryBuilder: Query = new Query('mutation')
        const insertSpeciesOneSubQuery : Query = new Query('insert_species_one')
          .addReturnToQuery('uuid')

        insertSpeciesOneSubQuery.constraints = new Constraints()
        insertSpeciesOneSubQuery.constraints.set = new ConstraintPart('object')
          .addConstraint([
            new ConstraintPart('category').addConstraint(species.category)
          ])

        queryBuilder.addReturnToQuery(insertSpeciesOneSubQuery)

        const mutation: string = queryBuilder.buildQuery()

        try {
            const data = await this.client.request(mutation)
            return data.insert_species_one.uuid
        } catch (e) {
            if (e.message.includes("JWTExpired")) {
                return new UseCaseError("JWT expired", 401)
            }
            return new UseCaseError(e.message, 400)
        }
    }

    async mutationUpdateOrigin(uuid: string, origin: string): Promise<string | Array<UseCaseError>> {

        const queryBuilder: Query = new Query('mutation')
        const updateSpeciesByPkSubQuery: Query = new Query('update_species_by_pk')
          .addReturnToQuery('origin')

        updateSpeciesByPkSubQuery.constraints = new Constraints()
        updateSpeciesByPkSubQuery.constraints.where = new ConstraintPart('pk_columns')
          .addConstraint([
            new ConstraintPart('uuid').addConstraint('"' + uuid + '"')
          ])
        updateSpeciesByPkSubQuery.constraints.set = new ConstraintPart('_set')
          .addConstraint([
            new ConstraintPart('origin').addConstraint(origin)
          ])

        const mutation: string = queryBuilder.buildQuery()

        try {
            const data = await this.client.request(mutation)

            return data.update_species_by_pk.origin
        } catch (e) {
            if (e.message.includes("JWTExpired")) {
                return [new UseCaseError("JWT expired", 401)]
            }
            return [new UseCaseError(e.message, 400)]
        }
    }

    async mutationUpdatePublicationState(uuid: string, nextState: string): Promise<string | Array<UseCaseError>> {
        const queryBuilder: Query = new Query('mutation')
        const updateSpeciesByPkSubQuery: Query = new Query('update_species_by_pk')
          .addReturnToQuery('publication_state')

        updateSpeciesByPkSubQuery.constraints = new Constraints()
        updateSpeciesByPkSubQuery.constraints.where = new ConstraintPart('pk_columns')
          .addConstraint([
            new ConstraintPart('uuid').addConstraint('"' + uuid + '"')
          ])

        updateSpeciesByPkSubQuery.constraints.set = new ConstraintPart('_set')
          .addConstraint([
            new ConstraintPart('publication_state').addConstraint(nextState)
          ])

        queryBuilder.addReturnToQuery(updateSpeciesByPkSubQuery)

        const mutation: string = queryBuilder.buildQuery()

        try {
            const data = await this.client.request(mutation)

            return data.update_species_by_pk.publication_state
        } catch (e) {
            if (e.message.includes("JWTExpired")) {
                return [new UseCaseError("JWT expired", 401)]
            }
            return [new UseCaseError(e.message, 400)]
        }
    }

    async mutationDeleteSpecies(uuid: string): Promise<boolean | Array<UseCaseError>> {
        const queryBuilder: Query = new Query('mutation')
        const deleteSpeciesByPkSubQuery: Query = new Query('delete_species_by_pk')
          .addReturnToQuery('uuid')

        deleteSpeciesByPkSubQuery.constraints = new Constraints()
        deleteSpeciesByPkSubQuery.constraints.where = new ConstraintPart('pk_columns')
          .addConstraint([
            new ConstraintPart('uuid').addConstraint('"' + uuid + '"')
          ])

        queryBuilder.addReturnToQuery(deleteSpeciesByPkSubQuery)

        const mutation: string = queryBuilder.buildQuery()

        try {
            await this.client.request(mutation)

            return true
        } catch (e) {
            if (e.message.includes("JWTExpired")) {
                return [new UseCaseError("JWT expired", 401)]
            }
            return [new UseCaseError(e.message, 400)]
        }
    }
}
