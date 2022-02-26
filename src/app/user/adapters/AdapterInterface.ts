import type User from "../entities/User";

export default interface AdapterInterface {
    authenticateWithEmailAndPassword(email: string, password: string): Promise<User | null>

    queryTotalUsers(): Promise<number | null>

    getRefreshedToken(): Promise<string | null>
}
