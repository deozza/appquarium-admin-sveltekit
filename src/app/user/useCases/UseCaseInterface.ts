import Result from "../../utils/useCasesResult/Result";

export default interface UseCaseInterface {
    login(email: string, password: string): Promise<Result>

    getTotalUsers(jwt: string): Promise<Result>

    checkTokenIsValidOrRefresh(token: string): Promise<Result>
}
