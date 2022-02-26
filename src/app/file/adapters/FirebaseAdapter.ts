import type AdapterInterface from './AdapterInterface';

import UseCaseError from '../../utils/useCasesResult/types/UseCaseError';

import Image from '../entities/Image';

import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import firebaseInit from '../../adapters/firebase/initFirebase';

export default class FirebaseAdapter implements AdapterInterface {
	private storage;

	constructor() {
		firebaseInit();
		this.storage = getStorage();
	}

	getListOfFiles(path: string): Promise<Array<Image> | Array<UseCaseError>> {
		return Promise.resolve(undefined);
	}

	async uploadFile(path: string, file: File): Promise<Image | Array<UseCaseError>> {
		return await uploadBytes(ref(this.storage, path), file)
			.then(async () => {
				const newImage: Image = new Image([], '');
				newImage.url = await getDownloadURL(ref(this.storage, path));
				return newImage;
			})
			.catch((error) => {
				const useCaseError: UseCaseError = new UseCaseError(error.message, 400);
				return [useCaseError];
			});
	}

	postMetadata(image: Image): Promise<Image | Array<UseCaseError>> {
		return Promise.resolve(undefined);
	}

	removeThumbnailStatus(image: Image): Promise<boolean | Array<UseCaseError>> {
		return Promise.resolve(undefined);
	}

	editFileMetadata(image: Image): Promise<boolean | Array<UseCaseError>> {
		return Promise.resolve(undefined);
	}

	async deleteFile(image: Image): Promise<boolean | Array<UseCaseError>> {
		return await deleteObject(ref(this.storage, image.url))
			.then(() => {
				return true;
			})
			.catch((error) => {
				const useCaseError: UseCaseError = new UseCaseError(error.message, 400);
				return [useCaseError];
			});
	}

	deleteFileMetadata(image: Image): Promise<boolean | Array<UseCaseError>> {
		return Promise.resolve(undefined);
	}
}
