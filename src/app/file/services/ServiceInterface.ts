import UseCaseError from "../../utils/useCasesResult/types/UseCaseError";

import Image from "../entities/Image";

export default interface ServiceInterface {
  getListOfFiles(address: string): Promise<Array<Image> | Array<UseCaseError>>
  getComputedFileName(fileName: string): string
  getMetadata(fileName: string, fileSource: string): object
  uploadFile(path: string, file: File, metadata: object): Promise< Image | Array<UseCaseError>>
  editFileMetadata(image: Image): Promise< boolean | Array<UseCaseError>>
  deleteFile(image: Image): Promise< boolean | Array<UseCaseError>>
}
