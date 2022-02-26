import type UseCaseError from "../../../utils/useCasesResult/types/UseCaseError";
import type Species from "../entities/Species";
import type WaterConstraints from "../entities/WaterConstraints";
import type User from "../../../user/entities/User";
import type SpeciesNaming from "../entities/SpeciesNaming";
import type AnimalSpecs from "../entities/AnimalSpecs";
import type PlantSpecs from '../entities/PlantSpecs';
import type AquariumConstraints from '../entities/AquariumConstraints';
import type AnimalBehaviour from '../entities/AnimalBehaviour';
import type Constraints from '../../../adapters/hasura/HasuraRequestBuilderV2/Constraints';

export default interface ServicesInterface {
    queryTotalSpecies(jwt: string, speciesConstraints: Constraints): Promise<number | null>

    queryGetSpecies(jwt: string, uuid: string): Promise<Species | UseCaseError>

    queryListOfSpecies(jwt: string, speciesConstraints: Constraints): Promise<Array<Species> | UseCaseError>

    querySpeciesCategories(jwt: string): Promise<Array<string> | UseCaseError>

    querySpeciesOrigins(jwt: string): Promise<Array<string> | UseCaseError>

    queryAlimentations(jwt: string): Promise<Array<string> | UseCaseError>

    queryAnimalZones(jwt: string): Promise<Array<string> | UseCaseError>

    queryAquariumKinds(jwt: string): Promise<Array<string> | UseCaseError>

    queryBehaviours(jwt: string): Promise<Array<string> | UseCaseError>

    queryDecors(jwt: string): Promise<Array<string> | UseCaseError>

    querySoilKinds(jwt: string): Promise<Array<string> | UseCaseError>

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

    updateAquariumConstraints(jwt: string, aquariumConstraints: AquariumConstraints): Promise<AquariumConstraints | Array<UseCaseError>>

    createAquariumConstraints(jwt: string, aquariumConstraints: AquariumConstraints): Promise<string | Array<UseCaseError>>

    addAquariumConstraintsToSpecies(jwt: string, aquariumConstraints: AquariumConstraints): Promise<AquariumConstraints | UseCaseError>

    updateAnimalBehaviour(jwt: string, animalBehaviour: AnimalBehaviour): Promise<AnimalBehaviour | Array<UseCaseError>>

    createAnimalBehaviour(jwt: string, animalBehaviour: AnimalBehaviour): Promise<string | Array<UseCaseError>>

    addAnimalBehaviourToSpecies(jwt: string, animalBehaviour: AnimalBehaviour): Promise<AnimalBehaviour | UseCaseError>

    initNewSpecies(user: User, category: string): Species

    checkNextState(species: Species, nextState: string): Promise<boolean | Array<UseCaseError>>

    updatePublicationState(jwt: string, uuid: string, state: string): Promise<string | Array<UseCaseError>>

    deleteSpecies(jwt: string, uuid: string): Promise<boolean | Array<UseCaseError>>
}
