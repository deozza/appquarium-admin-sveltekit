import type UseCaseInterface from "./UseCaseInterface";

import UseCaseError from "../../utils/useCasesResult/types/UseCaseError";
import Result from "../../utils/useCasesResult/Result";

import Image from "../entities/Image";

import Service from "../services/Service";

export default class UseCase implements UseCaseInterface {

    async uploadFile(fileName: string, fileSource: string, basePath: string, file: File | null): Promise<Result> {
        const result: Result = new Result()
        const fileService: Service = new Service()

        if (file === null) {
            result.addError('File should not be empty', 400)
            return result
        }

        const computedFileName: string = fileService.getComputedFileName(fileName)
        const completeRemotePath: string = basePath + '/' + computedFileName

        const image: Image | Array<UseCaseError> = await fileService.uploadFile(completeRemotePath, file)
        if (!(image instanceof Image)) {
            result.errors = image
            return result
        }

        result.addSuccess('Query is OK', 201)
        result.content = image
        return result
    }

    async editFileMetadata(jwt: string, image: Image, thumbnailHasBeenUpdated: boolean): Promise<Result> {
        const result: Result = new Result()
        const fileService: Service = new Service()

        if(thumbnailHasBeenUpdated === true && image.thumbnail === true){
            const cleanThumbnailBeforeEdit: boolean | Array<UseCaseError> = await fileService.cleanThumbnailBeforeEdit(jwt, image)
            if (typeof cleanThumbnailBeforeEdit !== 'boolean') {
                result.errors = cleanThumbnailBeforeEdit
                return result
            }
        }

        const isEdited: boolean | Array<UseCaseError> = await fileService.editFileMetadata(jwt, image)
        if (typeof isEdited !== 'boolean') {
            result.errors = isEdited
            return result
        }

        result.addSuccess('Query is OK', 200)
        return result
    }

    async deleteFile(jwt: string, image: Image): Promise<Result> {
        const result: Result = new Result()
        const fileService: Service = new Service()
        let isDeleted: boolean | Array<UseCaseError> = await fileService.deleteFile(image)
        if (typeof isDeleted !== 'boolean') {
            result.errors = isDeleted
            return result
        }

        isDeleted = await fileService.deleteFileMetadata(jwt, image)
        if (typeof isDeleted !== 'boolean') {
            result.errors = isDeleted
            return result
        }

        result.addSuccess('Query is OK', 204)
        return result
    }

}
