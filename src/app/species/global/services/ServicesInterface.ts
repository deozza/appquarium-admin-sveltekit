import UseCaseError from "../../../utils/useCasesResult/types/UseCaseError";
import Species from "../entities/Species";
import WaterConstraints from "../entities/WaterConstraints";
import User from "../../../user/entities/User";
import SpeciesNaming from "../entities/SpeciesNaming";
import AnimalSpecs from "../entities/AnimalSpecs";
import PlantSpecs from '../entities/PlantSpecs';

export default interface ServicesInterface {
    queryTotalSpecies(jwt: string): Promise<number | null>

    queryGetSpecies(jwt: string, uuid: string): Promise<Species | UseCaseError>

    queryListOfSpecies(jwt: string): Promise<Array<Species> | UseCaseError>

    querySpeciesCategories(jwt: string): Promise<Array<string> | UseCaseError>

    querySpeciesOrigins(jwt: string): Promise<Array<string> | UseCaseError>

    createSpecies(jwt: string, species: Species): Promise<string | UseCaseError>

    updateGeneralInfos(jwt: string, uuid: string, origin: string): Promise<string | Array<UseCaseError>>

    updateSpeciesNaming(jwt: string, speciesNaming: SpeciesNaming): Promise<string | UseCaseError>

    createSpeciesNaming(jwt: string, speciesNaming: SpeciesNaming): Promise<string | UseCaseError>

    addNamingToSpecies(jwt: string, speciesNaming: SpeciesNaming): Promise<SpeciesNaming | UseCaseError>

    updateWaterConstraints(jwt: string, waterConstraints: WaterConstraints): Promise<WaterConstraints | Array<UseCaseError>>

    createWaterConstraints(jwt: string, waterConstraints: WaterConstraints): Promise<string | Array<UseCaseError>>

    addWaterConstraintsToSpecies(jwt: string, waterConstraints: WaterConstraints): Promise<WaterConstraints | UseCaseError>

    updateAnimalSpecs(jwt: string, animalSpecs: AnimalSpecs): Promise<AnimalSpecs | Array<UseCaseError>>

    createAnimalSpecs(jwt: string, animalSpecs: AnimalSpecs): Promise<string | Array<UseCaseError>>

    addAnimalSpecsToSpecies(jwt: string, animalSpecs: AnimalSpecs): Promise<AnimalSpecs | UseCaseError>

    updatePlantSpecs(jwt: string, plantSpecs: PlantSpecs): Promise<PlantSpecs | Array<UseCaseError>>

    createPlantSpecs(jwt: string, plantSpecs: PlantSpecs): Promise<string | Array<UseCaseError>>

    addPlantSpecsToSpecies(jwt: string, plantSpecs: PlantSpecs): Promise<PlantSpecs | UseCaseError>

    initNewSpecies(user: User, category: string): Species

    checkNextState(species: Species, nextState: string): Promise<boolean | Array<UseCaseError>>

    updatePublicationState(jwt: string, uuid: string, state: string): Promise<string | Array<UseCaseError>>

    deleteSpecies(jwt: string, uuid: string): Promise<boolean | Array<UseCaseError>>
}
