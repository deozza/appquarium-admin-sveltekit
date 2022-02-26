import type Result from "../../../utils/useCasesResult/Result";
import type User from "../../../user/entities/User";
import type Species from "../../global/entities/Species";

export default interface UseCaseInterface {
    getListOfInvertebrates(jwt: string): Promise<Result>

    getInvertebrateGenres(jwt: string): Promise<Result>

    getInvertebrateFamilies(jwt: string): Promise<Result>

    initNewInvertebrate(user: User): Species
}
