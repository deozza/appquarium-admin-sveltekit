import AdapterInterface from "./AdapterInterface";

import HasuraClient from "../../utils/hasura/HasuraClient";
import HasuraQueryBuilder from "../../utils/hasura/HasuraRequestBuilder/HasuraQueryBuilder";

import User from "../entities/User";

export default class HasuraAdapter extends HasuraClient implements AdapterInterface {
  getRefreshedToken(): Promise<string | null> {
    return Promise.resolve(null);
  }

  constructor(jwt: string) {
    super(jwt);
  }

  async queryTotalUsers(): Promise<number | null> {
    let queryBuilder: HasuraQueryBuilder = new HasuraQueryBuilder('user_aggretaget')
    queryBuilder.addReturn('aggregate {count}')
    const query: string = queryBuilder.getRequest()

    try {
      const data = await this.client.request(query)
      return data.users_aggregate.aggregate.count
    } catch (e) {
      return null
    }
  }

  async authenticateWithEmailAndPassword(email: string, password: string): Promise<User | null> {
    return Promise.resolve(null);
  }

}
