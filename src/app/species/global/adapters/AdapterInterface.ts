import UseCaseError from "../../../utils/useCasesResult/types/UseCaseError";
import Species from "../entities/Species";
import SpeciesFamily from "../entities/SpeciesFamily";
import SpeciesGenre from "../entities/SpeciesGenre";
import WaterConstraints from "../entities/WaterConstraints";
import SpeciesNaming from "../entities/SpeciesNaming";
import AnimalSpecs from "../entities/AnimalSpecs";

export default interface AdapterInterface {
    queryTotalSpecies(): Promise<number | null>

    queryListOfSpecies(): Promise<Array<Species> | UseCaseError>

    queryGetSpecies(uuid: string): Promise<Species | UseCaseError>

    queryListOfSpeciesCategories(): Promise<Array<string> | UseCaseError>

    queryListOfSpeciesFamiliesByCategory(category: string): Promise<Array<SpeciesFamily> | UseCaseError>

    queryListOfSpeciesGenresByCategory(category: string): Promise<Array<SpeciesGenre> | UseCaseError>

    queryListOfSpeciesOrigins(): Promise<Array<string> | UseCaseError>

    queryListOfSpeciesByCategory(category: string): Promise<Array<Species> | UseCaseError>

    mutationCreateSpeciesGenre(speciesGenre: SpeciesGenre): Promise<string | UseCaseError>

    mutationCreateSpeciesFamily(speciesFamily: SpeciesFamily): Promise<string | UseCaseError>

    mutationCreateSpecies(species: Species): Promise<string | UseCaseError>

    mutationUpdateOrigin(uuid: string, origin: string): Promise<string | Array<UseCaseError>>

    mutationCreateNaming(speciesNaming: SpeciesNaming): Promise<string | UseCaseError>

    mutationAddNamingToSpecies(speciesNaming: SpeciesNaming): Promise<SpeciesNaming | UseCaseError>

    mutationUpdateSpeciesNaming(speciesNaming: SpeciesNaming): Promise<string | UseCaseError>

    mutationCreateWaterConstraints(waterConstraints: WaterConstraints): Promise<string | Array<UseCaseError>>

    mutationEditWaterConstraints(waterConstraints: WaterConstraints): Promise<WaterConstraints | Array<UseCaseError>>

    mutationAddWaterConstraintsToSpecies(waterConstraint: WaterConstraints): Promise<WaterConstraints | UseCaseError>

    mutationCreateAnimalSpecs(animalSpecs: AnimalSpecs): Promise<string | Array<UseCaseError>>

    mutationEditAnimalSpecs(animalSpecs: AnimalSpecs): Promise<AnimalSpecs | Array<UseCaseError>>

    mutationAddAnimalSpecsToSpecies(animalSpecs: AnimalSpecs): Promise<AnimalSpecs | UseCaseError>

    mutationUpdatePublicationState(uuid: string, nextState: string): Promise<string | Array<UseCaseError>>

    mutationDeleteSpecies(uuid: string): Promise<boolean | Array<UseCaseError>>
}
