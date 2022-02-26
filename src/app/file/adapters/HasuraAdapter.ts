import type AdapterInterface from "./AdapterInterface";

import HasuraClient from "../../adapters/hasura/HasuraClient";
import type Image from "../entities/Image";
import UseCaseError from "../../utils/useCasesResult/types/UseCaseError";

import Query from '../../adapters/hasura/HasuraRequestBuilderV2/Query';
import Constraints from '../../adapters/hasura/HasuraRequestBuilderV2/Constraints';
import ConstraintPart from '../../adapters/hasura/HasuraRequestBuilderV2/ConstraintPart';

export default class HasuraAdapter extends HasuraClient implements AdapterInterface {
    deleteFile(image: Image): Promise<boolean | Array<UseCaseError>> {
        return Promise.resolve(undefined);
    }

    async removeThumbnailStatus(image: Image): Promise<boolean | Array<UseCaseError>> {

        const queryBuilder: Query = new Query('mutation')

        const updateMediaSubQuery: Query = new Query('update_media')
          .addReturnToQuery(new Query('returning')
            .addReturnToQuery('url')
          )

        updateMediaSubQuery.constraints = new Constraints()

        updateMediaSubQuery.constraints.where = new ConstraintPart('where')
          .addConstraint([
              new ConstraintPart('thumbnail').addConstraint([new ConstraintPart('_eq').addConstraint('true')]),
              new ConstraintPart('_and').addConstraint([
                  new ConstraintPart('associated_to').addConstraint([new ConstraintPart('_eq').addConstraint('"' + image.associated_to + '"')])
              ]),
          ])

        updateMediaSubQuery.constraints.set = new ConstraintPart('_set')
          .addConstraint([
              new ConstraintPart('thumbnail').addConstraint('false')
          ])

        queryBuilder.addReturnToQuery(updateMediaSubQuery)

        const mutation: string = queryBuilder.buildQuery()

        try{
            await this.client.request(mutation)

            return true
        }catch (e){
            if (e.message.includes("JWTExpired")) {
                return [new UseCaseError("JWT expired", 401)]
            }
            return [new UseCaseError(e.message, 400)]
        }
    }

    async editFileMetadata(image: Image): Promise<boolean | Array<UseCaseError>> {

        const queryBuilder: Query = new Query('mutation')

        const updateMediaByPkSubQuery : Query = new Query('update_media_by_pk')
          .addReturnToQuery('url')

        updateMediaByPkSubQuery.constraints = new Constraints()
        updateMediaByPkSubQuery.constraints.where = new ConstraintPart('pk_columns')
          .addConstraint([new ConstraintPart('url').addConstraint('"' + image.url + '"')])

        updateMediaByPkSubQuery.constraints.set = new ConstraintPart('_set')
          .addConstraint([
            new ConstraintPart('title').addConstraint('"' + image.title + '"'),
            new ConstraintPart('thumbnail').addConstraint(image.thumbnail.toString()),
          ])

        queryBuilder.addReturnToQuery(updateMediaByPkSubQuery)

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

    getListOfFiles(path: string): Promise<Array<Image> | Array<UseCaseError>> {
        return Promise.resolve(undefined);
    }

    uploadFile(path: string, file: File): Promise<Image | Array<UseCaseError>> {
        return Promise.resolve(undefined);
    }

    async postMetadata(image: Image): Promise<Image | Array<UseCaseError>> {
        const queryBuilder: Query = new Query('mutation')

        const insertMediaOneSubQuery: Query = new Query('insert_media_one')
          .addReturnToQuery('url')

        insertMediaOneSubQuery.constraints = new Constraints()
        insertMediaOneSubQuery.constraints.set = new ConstraintPart('object')
          .addConstraint([
            new ConstraintPart('url').addConstraint('"' + image.url + '"'),
            new ConstraintPart('title').addConstraint('"' + image.title + '"'),
            new ConstraintPart('source').addConstraint('"' + image.source + '"'),
            new ConstraintPart('associated_to').addConstraint('"' + image.associated_to + '"'),
          ])

        queryBuilder.addReturnToQuery(insertMediaOneSubQuery)

        const mutation: string = queryBuilder.buildQuery()

        try {
            await this.client.request(mutation)

            return image
        } catch (e) {
            if (e.message.includes("JWTExpired")) {
                return [new UseCaseError("JWT expired", 401)]
            }
            return [new UseCaseError(e.message, 400)]
        }
    }

    async deleteFileMetadata(image: Image): Promise<boolean | Array<UseCaseError>> {
        const queryBuilder: Query = new Query('mutation')

        const deleteMediaByPkSubQuery: Query = new Query('delete_media_by_pk')
          .addReturnToQuery('url')

        deleteMediaByPkSubQuery.constraints = new Constraints()
        deleteMediaByPkSubQuery.constraints.where = new ConstraintPart('pk_columns')
          .addConstraint([new ConstraintPart('url').addConstraint('"' + image.url + '"')])

        queryBuilder.addReturnToQuery(deleteMediaByPkSubQuery)

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
