import type AdapterInterface from './AdapterInterface';

import User from '../entities/User';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import firebaseInit from '../../adapters/firebase/initFirebase';

export default class FirebaseAdapter implements AdapterInterface {
	private readonly auth: any;

	constructor() {
		firebaseInit();
		this.auth = getAuth();
	}

	async authenticateWithEmailAndPassword(email: string, password: string): Promise<User | null> {
		try {
			const userFromFirebase = await signInWithEmailAndPassword(this.auth, email, password);

			const user: User = new User(await userFromFirebase.user?.getIdToken()!);
			user.extractUserInfoFromJwt();

			return user;
		} catch (e) {
			return null;
		}
	}

	queryTotalUsers(): Promise<number | null> {
		return Promise.resolve(null);
	}

	async getRefreshedToken(): Promise<string | null> {
		try {
			return await this.auth.currentUser.getIdToken();
		} catch (e) {
			return null;
		}
	}
}
