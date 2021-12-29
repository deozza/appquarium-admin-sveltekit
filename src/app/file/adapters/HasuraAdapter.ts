import HasuraClient from "../../adapters/hasura/HasuraClient";
import type AdapterInterface from "./AdapterInterface";
import Image from "../entities/Image";
import UseCaseError from "../../utils/useCasesResult/types/UseCaseError";
import HasuraMutationInsertBuilder from "../../adapters/hasura/HasuraRequestBuilder/HasuraMutationInsertBuilder";
import HasuraMutationDeleteBuilder from "../../adapters/hasura/HasuraRequestBuilder/HasuraMutationDeleteBuilder";
import HasuraMutationUpdateBuilder from "../../adapters/hasura/HasuraRequestBuilder/HasuraMutationUpdateBuilder";

export default class HasuraAdapter extends HasuraClient implements AdapterInterface {
    deleteFile(image: Image): Promise<boolean | Array<UseCaseError>> {
        return Promise.resolve(undefined);
    }

    async removeThumbnailStatus(image: Image): Promise<boolean | Array<UseCaseError>> {
        const mutation: string = "mutation {\n" +
            "  update_media($associated_to: uuid!)(where: {thumbnail: {_eq: true}, associated_to: {_eq: $associated_to}}, _set: {thumbnail: false}) {\n" +
            "    returning {\n" +
            "      url\n" +
            "    }\n" +
            "  }\n" +
            "}"

        try{
            await this.client.request(mutation, {
                associated_to: image.associated_to
            })

            return true
        }catch (e){
            if (e.message.includes("JWTExpired")) {
                return [new UseCaseError("JWT expired", 401)]
            }
            return [new UseCaseError(e.message, 400)]
        }
    }

    async editFileMetadata(image: Image): Promise<boolean | Array<UseCaseError>> {
        let queryBuilder: HasuraMutationUpdateBuilder = new HasuraMutationUpdateBuilder('update_media_by_pk')

        queryBuilder.addParam('$url', 'String!', image.url)
        queryBuilder.addParam('$title', 'String!', image.title)

        queryBuilder.addPkColumn('url', '$url')

        queryBuilder.addInsert('title', '$title')

        queryBuilder.addReturn('url')

        const mutation: string = queryBuilder.getRequest()

        try {
            await this.client.request(mutation, {
                url: image.url,
                title: image.title,
            })

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
        let queryBuilder: HasuraMutationInsertBuilder = new HasuraMutationInsertBuilder('insert_media_one')

        queryBuilder.addParam('$url', 'String!', image.url)
        queryBuilder.addParam('$title', 'String!', image.title)
        queryBuilder.addParam('$source', 'String!', image.source)
        queryBuilder.addParam('$associated_to', 'uuid!', image.associated_to)

        queryBuilder.addInsert('url', '$url')
        queryBuilder.addInsert('title', '$title')
        queryBuilder.addInsert('source', '$source')
        queryBuilder.addInsert('associated_to', '$associated_to')

        queryBuilder.addReturn('url')

        const mutation: string = queryBuilder.getRequest()

        try {
            await this.client.request(mutation, {
                url: image.url,
                title: image.title,
                source: image.source,
                associated_to: image.associated_to
            })

            return image
        } catch (e) {
            if (e.message.includes("JWTExpired")) {
                return [new UseCaseError("JWT expired", 401)]
            }
            return [new UseCaseError(e.message, 400)]
        }
    }

    async deleteFileMetadata(image: Image): Promise<boolean | Array<UseCaseError>> {
        let queryBuilder: HasuraMutationDeleteBuilder = new HasuraMutationDeleteBuilder('delete_media_by_pk')

        queryBuilder.addParam('$url', 'String!', image.url)

        queryBuilder.addPkColumn('url', '$url')

        queryBuilder.addReturn('url')

        const mutation: string = queryBuilder.getRequest()

        try {
            await this.client.request(mutation, {
                url: image.url
            })

            return true
        } catch (e) {
            if (e.message.includes("JWTExpired")) {
                return [new UseCaseError("JWT expired", 401)]
            }
            return [new UseCaseError(e.message, 400)]
        }
    }

}
