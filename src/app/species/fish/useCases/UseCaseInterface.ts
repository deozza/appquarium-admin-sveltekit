import type Result from "../../../utils/useCasesResult/Result";

import type Species from "../../global/entities/Species";
import type User from "../../../user/entities/User";

export default interface UseCaseInterface {
    getListOfFishes(jwt: string, filters: Array<object>, itemsPerPage: number, offset: number): Promise<Result>

    getTotalOfFishes(jwt: string, filters: Array<object>): Promise<Result>

    getFishGenres(jwt: string): Promise<Result>

    getFishFamilies(jwt: string): Promise<Result>

    initNewFish(user: User): Species

}
