import type UseCaseInterface from "./UseCaseInterface";

import Result from "../../utils/useCasesResult/Result";

import User from "../entities/User";

import Services from "../services/Services";

export default class UserUseCase implements UseCaseInterface {

  async login(email: string, password: string): Promise<Result> {
    const userServices: Services = new Services()
    let result: Result = new Result()

    const user: User | null = await userServices.authenticateUser(email, password)

    if (user === null) {
      result.addError('User not found', 404)
      return result
    }

    result.content = user
    result.addSuccess('Credentials are ok', 201)
    return result
  }

  async checkTokenIsValidOrRefresh(token: string): Promise<Result> {
    const userServices: Services = new Services()
    let result: Result = new Result()

    const tokenDecodablePart = token.split('.')[1]
    const decoded = JSON.parse(Buffer.from(tokenDecodablePart, 'base64').toString())

    if (Date.now() < decoded.exp * 1000) {
      result.addSuccess('Token is valid', 200)
      return result
    }

    const refreshedToken: string | null = await userServices.getRefreshedToken()

    if (refreshedToken === null) {
      result.addError('Invalid credentials', 401)
      return result
    }

    result.content = refreshedToken
    result.addSuccess('Token is refreshed', 201)
    return result
  }

  async getTotalUsers(jwt: string): Promise<Result> {
    const userServices: Services = new Services()
    let result: Result = new Result()

    const totalUsers: number | null = await userServices.queryTotalUsers(jwt)

    if (totalUsers === null) {
      result.addError('Query failed', 400)
      return result
    }

    result.content = totalUsers
    result.addSuccess("Query is ok", 200)
    return result
  }
}
