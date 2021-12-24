import Result from "../../../utils/useCasesResult/Result";
import Species from "..//entities/Species";

export default interface UseCaseInterface {
  getTotalSpecies(jwt: string): Promise<Result>

  getListOfSpecies(jwt: string): Promise<Result>

  getSpeciesOrigins(jwt: string): Promise<Result>

  getSpecies(jwt: string, uuid: string): Promise<Result>

  createSpecies(jwt: string, species: Species): Promise<Result>

  updateGeneralInfos(jwt: string, species: Species): Promise<Result>

  updateSpeciesNaming(jwt: string, species: Species): Promise<Result>

  updateWaterConstraints(jwt: string, species: Species): Promise<Result>

  addWaterConstraints(jwt: string, species: Species): Promise<Result>

  updateAnimalSpecs(jwt: string, species: Species): Promise<Result>

  addAnimalSpecs(jwt: string, species: Species): Promise<Result>

  updatePublicationState(jwt: string, species: Species, nextState: string): Promise<Result>

  deleteSpecies(jwt: string, species: Species): Promise<Result>
}
