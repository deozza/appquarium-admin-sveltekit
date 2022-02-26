import type ServicesInterface from "./ServicesInterface";

import type UseCaseError from "../../../utils/useCasesResult/types/UseCaseError";
import Result from "../../../utils/useCasesResult/Result";

import type User from "../../../user/entities/User";
import Species from "../entities/Species";
import type WaterConstraints from "../entities/WaterConstraints";
import type SpeciesNaming from "../entities/SpeciesNaming";
import type SpeciesFamily from "../entities/SpeciesFamily";
import type SpeciesGenre from "../entities/SpeciesGenre";
import type AnimalSpecs from "../entities/AnimalSpecs";

import HasuraAdapter from "../adapters/HasuraAdapter";
import type AdapterInterface from "../adapters/AdapterInterface";
import SpeciesNamingHasuraAdapter from '../adapters/speciesNaming/HasuraAdapter';
import type SpeciesNamingAdapterInterface from '../adapters/speciesNaming/AdapterInterface';
import SpeciesFamiliesHasuraAdapter from '../adapters/speciesNaming/speciesFamily/HasuraAdapter';
import type SpeciesFamiliesAdapterInterface from '../adapters/speciesNaming/speciesFamily/AdapterInterface';
import SpeciesGenresHasuraAdapter from '../adapters/speciesNaming/speciesGenre/HasuraAdapter';
import type SpeciesGenresAdapterInterface from '../adapters/speciesNaming/speciesGenre/AdapterInterface';
import WaterConstraintsHasuraAdapter from '../adapters/waterConstraints/HasuraAdapter';
import type WaterConstraintsAdapterInterface from '../adapters/waterConstraints/AdapterInterface';
import AnimalSpecsHasuraAdapter from '../adapters/animalSpecs/HasuraAdapter';
import type AnimalSpecsAdapterInterface from '../adapters/animalSpecs/AdapterInterface';
import type PlantSpecs from '../entities/PlantSpecs';
import type PlantSpecsAdapterInterface from '../adapters/plantSpecs/AdapterInterface';
import PlantSpecsHasuraAdapter from '../adapters/plantSpecs/HasuraAdapter';
import type AnimalBehaviour from '../entities/AnimalBehaviour';
import type AnimalBehaviourAdapterInterface from '../adapters/animalBehaviour/AdapterInterface';
import AnimalBehaviourHasuraAdapter from '../adapters/animalBehaviour/HasuraAdapter';
import type AquariumConstraints from '../entities/AquariumConstraints';
import type AquariumConstraintsAdapterInterface from '../adapters/aquariumConstraints/AdapterInterface';
import  AquariumConstraintsHasuraAdapter from '../adapters/aquariumConstraints/HasuraAdapter';
import type  Constraints from '../../../adapters/hasura/HasuraRequestBuilderV2/Constraints';

export default class Services implements ServicesInterface {
    private static checkWaterConstraintsAreValid(waterConstraints: WaterConstraints): Result {
        const result: Result = new Result()

        if (waterConstraints.ph_min > waterConstraints.ph_max) {
            result.addError("ph_min", 400)
        }

        if (waterConstraints.gh_min > waterConstraints.gh_max) {
            result.addError("gh_min", 400)
        }

        if (waterConstraints.temp_min > waterConstraints.temp_max) {
            result.addError("temp_min", 400)
        }

        return result
    }

    async queryTotalSpecies(jwt: string, speciesConstraints: Constraints): Promise<number | null> {
        const adapter: AdapterInterface = new HasuraAdapter(jwt)

        return await adapter.queryTotalSpecies(speciesConstraints)
    }

    async queryListOfSpecies(jwt: string, speciesConstraints: Constraints): Promise<Array<Species> | UseCaseError> {
        const adapter: AdapterInterface = new HasuraAdapter(jwt)

        return await adapter.queryListOfSpecies(speciesConstraints)
    }

    async queryGetSpecies(jwt: string, uuid: string): Promise<Species | UseCaseError> {
        const adapter: AdapterInterface = new HasuraAdapter(jwt)

        return await adapter.queryGetSpecies(uuid)
    }

    async querySpeciesCategories(jwt: string): Promise<Array<string> | UseCaseError> {
        const adapter: AdapterInterface = new HasuraAdapter(jwt)

        return await adapter.queryListOfSpeciesCategories()
    }

    async queryAlimentations(jwt: string): Promise<Array<string> | UseCaseError> {
        const adapter: AnimalBehaviourAdapterInterface = new AnimalBehaviourHasuraAdapter(jwt)

        return await adapter.queryListOfAlimentations()
    }

    async queryAnimalZones(jwt: string): Promise<Array<string> | UseCaseError> {
        const adapter: AnimalBehaviourAdapterInterface = new AnimalBehaviourHasuraAdapter(jwt)

        return await adapter.queryListOfAnimalZones()
    }

    async queryAquariumKinds(jwt: string): Promise<Array<string> | UseCaseError> {
        const adapter: AnimalBehaviourAdapterInterface = new AnimalBehaviourHasuraAdapter(jwt)

        return await adapter.queryListOfAquariumKinds()
    }

    async queryBehaviours(jwt: string): Promise<Array<string> | UseCaseError> {
        const adapter: AnimalBehaviourAdapterInterface = new AnimalBehaviourHasuraAdapter(jwt)

        return await adapter.queryListOfBehaviours()
    }

    async queryDecors(jwt: string): Promise<Array<string> | UseCaseError> {
        const adapter: AquariumConstraintsAdapterInterface = new AquariumConstraintsHasuraAdapter(jwt)

        return await adapter.queryListOfDecors()
    }

    async querySoilKinds(jwt: string): Promise<Array<string> | UseCaseError> {
        const adapter: AquariumConstraintsAdapterInterface = new AquariumConstraintsHasuraAdapter(jwt)

        return await adapter.queryListOfSoilKinds()
    }

    async querySpeciesOrigins(jwt: string): Promise<Array<string> | UseCaseError> {
        const adapter: AdapterInterface = new HasuraAdapter(jwt)

        return await adapter.queryListOfSpeciesOrigins()
    }

    initNewSpecies(user: User, category: string): Species {
        let newSpecies = new Species([])
        newSpecies.category = category
        newSpecies.user_uid = user.uid
        newSpecies.publication_state = 'DRAFT'
        newSpecies.naming.user_uid = user.uid
        newSpecies.naming.species_family.category = category
        newSpecies.naming.species_family.user_uid = user.uid
        newSpecies.naming.species_genre.category = category
        newSpecies.naming.species_genre.user_uid = user.uid

        return newSpecies
    }

    async createSpecies(jwt: string, species: Species): Promise<string | UseCaseError> {
        const adapter: AdapterInterface = new HasuraAdapter(jwt)

        return await adapter.mutationCreateSpecies(species)
    }

    async updateGeneralInfos(jwt: string, uuid: string, origin: string): Promise<string | Array<UseCaseError>> {
        const adapter: AdapterInterface = new HasuraAdapter(jwt)

        return await adapter.mutationUpdateOrigin(uuid, origin)
    }

    async createSpeciesFamily(jwt: string, speciesFamily: SpeciesFamily): Promise<string | UseCaseError> {
        const adapter: SpeciesFamiliesAdapterInterface = new SpeciesFamiliesHasuraAdapter(jwt)

        return await adapter.mutationCreateSpeciesFamily(speciesFamily)
    }

    async createSpeciesGenre(jwt: string, speciesGenre: SpeciesGenre): Promise<string | UseCaseError> {
        const adapter: SpeciesGenresAdapterInterface = new SpeciesGenresHasuraAdapter(jwt)

        return await adapter.mutationCreateSpeciesGenre(speciesGenre)
    }

    async createSpeciesNaming(jwt: string, speciesNaming: SpeciesNaming): Promise<string | UseCaseError> {
        const adapter: SpeciesNamingAdapterInterface = new SpeciesNamingHasuraAdapter(jwt)

        return await adapter.mutationCreateNaming(speciesNaming)
    }

    async addNamingToSpecies(jwt: string, speciesNaming: SpeciesNaming): Promise<SpeciesNaming | UseCaseError> {
        const adapter: SpeciesNamingAdapterInterface = new SpeciesNamingHasuraAdapter(jwt)

        return await adapter.mutationAddNamingToSpecies(speciesNaming)
    }

    async updateSpeciesNaming(jwt: string, speciesNaming: SpeciesNaming): Promise<string | UseCaseError> {
        const adapter: SpeciesNamingAdapterInterface = new SpeciesNamingHasuraAdapter(jwt)

        return await adapter.mutationUpdateSpeciesNaming(speciesNaming)
    }

    async createWaterConstraints(jwt: string, waterConstraints: WaterConstraints): Promise<string | Array<UseCaseError>> {
        const areConstraintsValid: Result = Services.checkWaterConstraintsAreValid(waterConstraints)

        if (areConstraintsValid.isFailed()) {
            return areConstraintsValid.errors
        }

        const adapter: WaterConstraintsAdapterInterface = new WaterConstraintsHasuraAdapter(jwt)

        return await adapter.mutationCreateWaterConstraints(waterConstraints)
    }

    async addWaterConstraintsToSpecies(jwt: string, waterConstraints: WaterConstraints): Promise<WaterConstraints | UseCaseError> {
        const adapter: WaterConstraintsAdapterInterface = new WaterConstraintsHasuraAdapter(jwt)

        return await adapter.mutationAddWaterConstraintsToSpecies(waterConstraints)
    }

    async updateWaterConstraints(jwt: string, waterConstraints: WaterConstraints): Promise<WaterConstraints | Array<UseCaseError>> {
        const areConstraintsValid: Result = Services.checkWaterConstraintsAreValid(waterConstraints)

        if (areConstraintsValid.isFailed()) {
            return areConstraintsValid.errors
        }

        const adapter: WaterConstraintsAdapterInterface = new WaterConstraintsHasuraAdapter(jwt)

        return await adapter.mutationEditWaterConstraints(waterConstraints)
    }

    async createAnimalSpecs(jwt: string, animalSpecs: AnimalSpecs): Promise<string | Array<UseCaseError>> {
        const adapter: AnimalSpecsAdapterInterface = new AnimalSpecsHasuraAdapter(jwt)

        return await adapter.mutationCreateAnimalSpecs(animalSpecs)
    }

    async addAnimalSpecsToSpecies(jwt: string, animalSpecs: AnimalSpecs): Promise<AnimalSpecs | UseCaseError> {
        const adapter: AnimalSpecsAdapterInterface = new AnimalSpecsHasuraAdapter(jwt)

        return await adapter.mutationAddAnimalSpecsToSpecies(animalSpecs)
    }

    async updateAnimalSpecs(jwt: string, animalSpecs: AnimalSpecs): Promise<AnimalSpecs | Array<UseCaseError>> {
        const adapter: AnimalSpecsAdapterInterface = new AnimalSpecsHasuraAdapter(jwt)

        return await adapter.mutationEditAnimalSpecs(animalSpecs)
    }

    async createPlantSpecs(jwt: string, plantSpecs: PlantSpecs): Promise<string | Array<UseCaseError>> {
        const adapter: PlantSpecsAdapterInterface = new PlantSpecsHasuraAdapter(jwt)

        return await adapter.mutationCreatePlantSpecs(plantSpecs)
    }

    async addPlantSpecsToSpecies(jwt: string, plantSpecs: PlantSpecs): Promise<PlantSpecs | UseCaseError> {
        const adapter: PlantSpecsAdapterInterface = new PlantSpecsHasuraAdapter(jwt)

        return await adapter.mutationAddPlantSpecsToSpecies(plantSpecs)
    }

    async updatePlantSpecs(jwt: string, plantSpecs: PlantSpecs): Promise<PlantSpecs | Array<UseCaseError>> {
        const adapter: PlantSpecsAdapterInterface = new PlantSpecsHasuraAdapter(jwt)

        return await adapter.mutationEditPlantSpecs(plantSpecs)
    }

    async createAnimalBehaviour(jwt: string, animalBehaviour: AnimalBehaviour): Promise<string | Array<UseCaseError>> {
        const adapter: AnimalBehaviourAdapterInterface = new AnimalBehaviourHasuraAdapter(jwt)

        return await adapter.mutationCreateAnimalBehaviour(animalBehaviour)
    }

    async addAnimalBehaviourToSpecies(jwt: string, animalBehaviour: AnimalBehaviour): Promise<AnimalBehaviour | UseCaseError> {
        const adapter: AnimalBehaviourAdapterInterface = new AnimalBehaviourHasuraAdapter(jwt)

        return await adapter.mutationAddAnimalBehaviourToSpecies(animalBehaviour)
    }

    async updateAnimalBehaviour(jwt: string, animalBehaviour: AnimalBehaviour): Promise<AnimalBehaviour | Array<UseCaseError>> {
        const adapter: AnimalBehaviourAdapterInterface = new AnimalBehaviourHasuraAdapter(jwt)

        return await adapter.mutationEditAnimalBehaviour(animalBehaviour)
    }

    async createAquariumConstraints(jwt: string, aquariumConstraints: AquariumConstraints): Promise<string | Array<UseCaseError>> {
        const adapter: AquariumConstraintsAdapterInterface = new AquariumConstraintsHasuraAdapter(jwt)

        return await adapter.mutationCreateAquariumConstraints(aquariumConstraints)
    }

    async addAquariumConstraintsToSpecies(jwt: string, aquariumConstraints: AquariumConstraints): Promise<AquariumConstraints | UseCaseError> {
        const adapter: AquariumConstraintsAdapterInterface = new AquariumConstraintsHasuraAdapter(jwt)

        return await adapter.mutationAddAquariumConstraintsToSpecies(aquariumConstraints)
    }

    async updateAquariumConstraints(jwt: string, aquariumConstraints: AquariumConstraints): Promise<AquariumConstraints | Array<UseCaseError>> {
        const adapter: AquariumConstraintsAdapterInterface = new AquariumConstraintsHasuraAdapter(jwt)

        return await adapter.mutationEditAquariumConstraints(aquariumConstraints)
    }

    async checkNextState(species: Species, nextState: string): Promise<boolean | Array<UseCaseError>> {
        return true
    }

    async updatePublicationState(jwt: string, uuid: string, state: string): Promise<string | Array<UseCaseError>> {
        const adapter: AdapterInterface = new HasuraAdapter(jwt)

        return await adapter.mutationUpdatePublicationState(uuid, state)
    }

    async deleteSpecies(jwt: string, uuid: string): Promise<boolean | Array<UseCaseError>> {
        const adapter: AdapterInterface = new HasuraAdapter(jwt)

        return await adapter.mutationDeleteSpecies(uuid)
    }
}
