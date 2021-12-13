import AdapterInterface from "./AdapterInterface";

import UseCaseError from "../../utils/useCasesResult/types/UseCaseError";

import Image from "../entities/Image";

import firebase from "firebase";

export default class FirebaseAdapter implements AdapterInterface{
  private storage: firebase.storage.Storage

  constructor(storage: firebase.storage.Storage) {
    this.storage = storage
  }

  async uploadFile(path: string, file: File, metadata: object): Promise<Image | Array<UseCaseError>> {
    return await this.storage.ref(path).put(file, metadata)
      .then(async () => {
        const newImage: Image = new Image()
        newImage.alt = metadata['customMetadata']['alt']
        newImage.origin = metadata['customMetadata']['origin']
        newImage.url = await this.storage.ref(path).getDownloadURL()
       return newImage

      })
      .catch((error) => {
        const useCaseError: UseCaseError = new UseCaseError(error.message, 400)
        return [useCaseError]
      })
  }

  async editFileMetadata(image: Image): Promise<boolean | Array<UseCaseError>> {
    return await this.storage.refFromURL(image.url).updateMetadata({customMetadata: {alt: image.alt, origin: image.origin}})
      .then(() => {
        return true
      })
      .catch((error) => {
        const useCaseError: UseCaseError = new UseCaseError(error.message, 400)
        return [useCaseError]
      })
  }

  async deleteFile(image: Image): Promise<boolean | Array<UseCaseError>> {
    return await this.storage.refFromURL(image.url).delete()
      .then(() => {
        return true
      })
      .catch((error) => {
        const useCaseError: UseCaseError = new UseCaseError(error.message, 400)
        return [useCaseError]
      })
  }
}
