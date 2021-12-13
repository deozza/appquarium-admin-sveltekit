import Result from "../../../utils/useCasesResult/Result";

export default interface UseCaseInterface {
  getListOfInvertebrates(jwt: string): Promise<Result>

  getInvertebrateGenres(jwt: string): Promise<Result>

  getInvertebrateFamilies(jwt: string): Promise<Result>
}
