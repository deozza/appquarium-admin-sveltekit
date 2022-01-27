import type ServicesInterface from "./ServicesInterface";

import User from "../entities/User";

import type AdapterInterface from "../adapters/AdapterInterface";
import FirebaseAdapter from "../adapters/FirebaseAdapter";
import HasuraAdapter from "../adapters/HasuraAdapter";
import Cookies from 'js-cookie';

export default class Services implements ServicesInterface {

    async authenticateUser(email: string, password: string): Promise<User | null> {

        const adapter: AdapterInterface | null = new FirebaseAdapter()

        return await adapter.authenticateWithEmailAndPassword(email, password)
    }

    static checkUserHasAdminPrivileges(user: User): boolean{
        return user.roles.includes('superadmin')
    }

    async getRefreshedToken(): Promise<string | null> {
        const adapter: AdapterInterface | null = new FirebaseAdapter()

        return await adapter.getRefreshedToken()
    }

    async queryTotalUsers(jwt: string): Promise<number | null> {
        const adapter: AdapterInterface | null = new HasuraAdapter(jwt)

        return await adapter.queryTotalUsers()
    }

    setCookie(user: User): User | null {
        Cookies.set('appquarium-jwt', user.jwt, {sameSite: "strict"})

        return user
    }

    removeCookie(): null {
        Cookies.remove('appquarium-jwt')
    }

    getCookie(): string | undefined {
        return Cookies.get('appquarium-jwt')
    }
}
