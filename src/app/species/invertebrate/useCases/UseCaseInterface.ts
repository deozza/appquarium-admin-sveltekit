import Result from "../../../utils/useCasesResult/Result";
import User from "../../../user/entities/User";
import Species from "../../global/entities/Species";

export default interface UseCaseInterface {
    getListOfInvertebrates(jwt: string): Promise<Result>

    getInvertebrateGenres(jwt: string): Promise<Result>

    getInvertebrateFamilies(jwt: string): Promise<Result>

    initNewInvertebrate(user: User): Species
}
