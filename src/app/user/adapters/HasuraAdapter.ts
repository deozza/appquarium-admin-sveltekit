import type AdapterInterface from "./AdapterInterface";

import HasuraClient from "../../adapters/hasura/HasuraClient";

import type User from "../entities/User";
import Query from '../../adapters/hasura/HasuraRequestBuilderV2/Query';

export default class HasuraAdapter extends HasuraClient implements AdapterInterface {
    constructor(jwt: string) {
        super(jwt);
    }

    getRefreshedToken(): Promise<string | null> {
        return Promise.resolve(null);
    }

    async queryTotalUsers(): Promise<number | null> {

        const queryBuilder: Query = new Query('query')

        const userAggregateSubQuery: Query = new Query('user_aggregate')
          .addReturnToQuery(new Query('aggregate')
            .addReturnToQuery('count'))

        queryBuilder.addReturnToQuery(userAggregateSubQuery)

        const query: string = queryBuilder.buildQuery()

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
