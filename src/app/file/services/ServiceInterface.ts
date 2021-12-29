import UseCaseError from "../../utils/useCasesResult/types/UseCaseError";

import Image from "../entities/Image";

export default interface ServiceInterface {
    getComputedFileName(fileName: string): string

    getMetadata(fileName: string, fileSource: string): object

    uploadFile(path: string, file: File): Promise<Image | Array<UseCaseError>>

    postMetadata(jwt: string, image: Image): Promise<Image | Array<UseCaseError>>

    editFileMetadata(jwt: string, image: Image): Promise<boolean | Array<UseCaseError>>

    deleteFile(image: Image): Promise<boolean | Array<UseCaseError>>

    deleteFileMetadata(jwt: string, image: Image): Promise<boolean | Array<UseCaseError>>
}
