import type AdapterInterface from "./AdapterInterface";

import UseCaseError from "../../utils/useCasesResult/types/UseCaseError";

import Image from "../entities/Image";

import  { getStorage, ref, getDownloadURL, updateMetadata, uploadBytes, deleteObject, listAll, getMetadata } from 'firebase/storage'
import firebaseInit from "../../adapters/firebase/initFirebase";

export default class FirebaseAdapter implements AdapterInterface{
    private storage

    constructor() {
        firebaseInit()
        this.storage = getStorage()
    }

    async getListOfFiles(path: string): Promise<Array<Image> | Array<UseCaseError>>{
        return await listAll(ref(this.storage, path))
            .then((files) => {
                let images: Array<Image> = []
                files.items.forEach((file) => {
                    const image: Image = new Image()
                    getMetadata(file)
                        .then((metadata)=>{
                            image.alt = metadata.customMetadata.alt
                            image.origin = metadata.customMetadata.origin
                        })
                    getDownloadURL(file)
                        .then((url) => {
                            image.url = url
                        })

                    images.push(image)
                })
                return images
            })
            .catch((error) => {
                const useCaseError: UseCaseError = new UseCaseError(error.message, 400)
                return [useCaseError]
            })
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
