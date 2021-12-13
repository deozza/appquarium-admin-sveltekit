import {GraphQLClient} from "graphql-request";

export default class HasuraClient {
  client: GraphQLClient

  constructor(jwt: string) {
    this.client = new GraphQLClient('https://appquarium.hasura.app/v1/graphql', {
      headers: {
        "content-type": "application/json",
        "Authorization": `Bearer ${jwt}`
      }
    })
  }
}
