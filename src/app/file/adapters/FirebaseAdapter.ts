import type AdapterInterface from "./AdapterInterface";

import UseCaseError from "../../utils/useCasesResult/types/UseCaseError";

import Image from "../entities/Image";

import  { getStorage, ref, getDownloadURL, updateMetadata, uploadBytes, deleteObject } from 'firebase/storage'
export default class FirebaseAdapter implements AdapterInterface{
  private storage

  constructor() {
    this.storage = getStorage()
  }

  async uploadFile(path: string, file: File, metadata: object): Promise<Image | Array<UseCaseError>> {
      return await uploadBytes(ref(this.storage, path), file, metadata)
      .then(async () => {
        const newImage: Image = new Image()
        newImage.alt = metadata['customMetadata']['alt']
        newImage.origin = metadata['customMetadata']['origin']
        newImage.url = await getDownloadURL(ref(this.storage, path))
       return newImage

      })
      .catch((error) => {
        const useCaseError: UseCaseError = new UseCaseError(error.message, 400)
        return [useCaseError]
      })
  }

  async editFileMetadata(image: Image): Promise<boolean | Array<UseCaseError>> {


    return await updateMetadata(ref(this.storage, image.url), {customMetadata: {alt: image.alt, origin: image.origin}})
      .then(() => {
        return true
      })
      .catch((error) => {
        const useCaseError: UseCaseError = new UseCaseError(error.message, 400)
        return [useCaseError]
      })
  }

  async deleteFile(image: Image): Promise<boolean | Array<UseCaseError>> {
    return await deleteObject(ref(this.storage, image.url))
      .then(() => {
        return true
      })
      .catch((error) => {
        const useCaseError: UseCaseError = new UseCaseError(error.message, 400)
        return [useCaseError]
      })
  }
}
