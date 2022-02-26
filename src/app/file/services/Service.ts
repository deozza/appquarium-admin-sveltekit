import type ServiceInterface from "./ServiceInterface";
import type UseCaseError from "../../utils/useCasesResult/types/UseCaseError";

import type Image from "../entities/Image";

import type AdapterInterface from "../adapters/AdapterInterface";
import FirebaseAdapter from "../adapters/FirebaseAdapter";
import HasuraAdapter from "../adapters/HasuraAdapter";

export default class Service implements ServiceInterface {

    getComputedFileName(fileName: string): string {
        return fileName.replace(' ', '_')
            .replace("'", '_')
            .toLowerCase();
    }

    getMetadata(fileName: string, fileSource: string): object {
        return {
            customMetadata: {
                alt: fileName,
                source: fileSource
            }
        }
    }

    async uploadFile(path: string, file: File): Promise<Image | Array<UseCaseError>> {
        const adapter: AdapterInterface = new FirebaseAdapter()

        return await adapter.uploadFile(path, file)
    }

    async postMetadata(jwt: string, image: Image): Promise<Image | Array<UseCaseError>> {
        const adapter: AdapterInterface = new HasuraAdapter(jwt)

        return await adapter.postMetadata(image)
    }

    async cleanThumbnailBeforeEdit(jwt: string, image: Image): Promise<boolean | Array<UseCaseError>> {
        const adapter: AdapterInterface = new HasuraAdapter(jwt)

        return await adapter.removeThumbnailStatus(image)
    }

    async editFileMetadata(jwt: string, image: Image): Promise<boolean | Array<UseCaseError>> {
        const adapter: AdapterInterface = new HasuraAdapter(jwt)

        return await adapter.editFileMetadata(image)
    }

    async deleteFile(image: Image): Promise<boolean | Array<UseCaseError>> {
        const adapter: AdapterInterface = new FirebaseAdapter()

        return await adapter.deleteFile(image)
    }

    async deleteFileMetadata(jwt: string, image: Image): Promise<boolean | Array<UseCaseError>> {
        const adapter: AdapterInterface = new HasuraAdapter(jwt)

        return await adapter.deleteFileMetadata(image)
    }
}
