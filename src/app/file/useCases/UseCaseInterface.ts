import Result from "../../utils/useCasesResult/Result";

import Image from "../entities/Image";

export default interface UseCaseInterface {
    uploadFile(fileName: string, fileSource: string, basePath: string, file: File): Promise<Result>

    editFileMetadata(jwt: string, image: Image): Promise<Result>

    deleteFile(jwt: string, image: Image): Promise<Result>
}
