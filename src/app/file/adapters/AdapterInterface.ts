import UseCaseError from "../../utils/useCasesResult/types/UseCaseError";

import Image from "../entities/Image";

export default interface AdapterInterface {
  getListOfFiles(path: string): Promise<Array<Image> | Array<UseCaseError>>

  uploadFile(path: string, file: File): Promise<Image | Array<UseCaseError>>

  postMetadata(image: Image): Promise<Image | Array<UseCaseError>>

  editFileMetadata(image: Image): Promise<boolean | Array<UseCaseError>>

  deleteFile(image: Image): Promise<boolean | Array<UseCaseError>>

  deleteFileMetadata(image: Image): Promise<boolean | Array<UseCaseError>>
}
