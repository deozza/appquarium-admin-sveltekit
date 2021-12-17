import type UseCaseInterface from "./UseCaseInterface";

import Result from "../../utils/useCasesResult/Result";

import User from "../entities/User";

import Services from "../services/Services";

export default class UserUseCase implements UseCaseInterface {

  async login(email: string, password: string): Promise<Result> {
    const userServices: Services = new Services()
    let result: Result = new Result()

    let user: User | null = await userServices.authenticateUser(email, password)

    if (user === null) {
      result.addError('User not found', 404)
      return result
    }

    user = userServices.setCookie(user)

    if (user === null) {
      result.addError('Cookie failed', 400)
      return result
    }

    result.content = user
    result.addSuccess('Credentials are ok', 201)
    return result
  }


  getToken(): Result{
    const userServices: Services = new Services()
    let result: Result = new Result()

    const token: string | undefined = userServices.getCookie()

    if(token === undefined){
      result.addError('User is not logged in', 401)
      return result
    }

    result.content = token
    result.addSuccess('Token found', 200)

    return result
  }

  logout(): Result{
    const userServices: Services = new Services()
    let result: Result = new Result()

    userServices.removeCookie()

    const token: string | undefined = userServices.getCookie()

    if(token !== undefined){
      result.addError('User is still logged in', 400)
      return result
    }

    result.content = true
    result.addSuccess('Token removed', 204)

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
