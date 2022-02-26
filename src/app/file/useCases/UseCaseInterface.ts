import type Result from "../../utils/useCasesResult/Result";

import type Image from "../entities/Image";

export default interface UseCaseInterface {
    uploadFile(fileName: string, fileSource: string, basePath: string, file: File): Promise<Result>

    editFileMetadata(jwt: string, image: Image, thumbnailHasBeenUpdated: boolean): Promise<Result>

    deleteFile(jwt: string, image: Image): Promise<Result>
}
