import ServicesInterface from "./ServicesInterface";

import Credentials from "../entities/Credentials";
import User from "../entities/User";

import AdapterInterface from "../adapters/AdapterInterface";
import FirebaseAdapter from "../adapters/FirebaseAdapter";
import HasuraAdapter from "../adapters/HasuraAdapter";

export default class Services implements ServicesInterface {

  private readonly module: any

  constructor(module: any) {
    this.module = module
  }

  async authenticateUser(credentials: Credentials): Promise<User | null> {

    const adapter: AdapterInterface | null = new FirebaseAdapter(this.module)

    return await adapter.authenticateWithEmailAndPassword(credentials.email.value, credentials.password.value)
  }

  async getRefreshedToken(): Promise<string | null> {
    const adapter: AdapterInterface | null = new FirebaseAdapter(this.module)

    return await adapter.getRefreshedToken()
  }

  async queryTotalUsers(jwt: string): Promise<number | null> {
    const adapter: AdapterInterface | null = new HasuraAdapter(jwt)

    return await adapter.queryTotalUsers()
  }
}
