import type UseCaseInterface from './UseCaseInterface';

import Result from '../../../utils/useCasesResult/Result';
import UseCaseError from '../../../utils/useCasesResult/types/UseCaseError';

import type Species from '../entities/Species';
import WaterConstraints from '../entities/WaterConstraints';
import type SpeciesNaming from '../entities/SpeciesNaming';
import AnimalSpecs from '../entities/AnimalSpecs';

import Services from '../services/Services';
import { default as FileServices } from '../../../file/services/Service';
import Image from '../../../file/entities/Image';
import PlantSpecs from '../entities/PlantSpecs';
import AnimalBehaviour from '../entities/AnimalBehaviour';
import AquariumConstraints from '../entities/AquariumConstraints';
import Constraints from '../../../adapters/hasura/HasuraRequestBuilderV2/Constraints';
import ConstraintPart from '../../../adapters/hasura/HasuraRequestBuilderV2/ConstraintPart';

export default class SpeciesUseCase implements UseCaseInterface {
	private static async handleNewSpeciesNaming(
		jwt: string,
		species: Species
	): Promise<Species | UseCaseError> {
		const speciesService: Services = new Services();

		if (species.naming.species_family.uuid === '') {
			const newSpeciesFamily: string | UseCaseError = await speciesService.createSpeciesFamily(
				jwt,
				species.naming.species_family
			);
			if (newSpeciesFamily instanceof UseCaseError) {
				return newSpeciesFamily;
			}

			species.naming.species_family.uuid = newSpeciesFamily;
		}

		if (species.naming.species_genre.uuid === '') {
			const newSpeciesGenre: string | UseCaseError = await speciesService.createSpeciesGenre(
				jwt,
				species.naming.species_genre
			);
			if (newSpeciesGenre instanceof UseCaseError) {
				return newSpeciesGenre;
			}

			species.naming.species_genre.uuid = newSpeciesGenre;
		}

		return species;
	}

	async getTotalSpecies(jwt: string, filters: Array<object> = []): Promise<Result> {
		const result: Result = new Result();
		const speciesService: Services = new Services();

		const speciesConstraints: Constraints = new Constraints();

		if(filters.length > 0){
			speciesConstraints.where = new ConstraintPart('where').addConstraint(filters);
		}

		const totalSpecies: number | null = await speciesService.queryTotalSpecies(
			jwt,
			speciesConstraints
		);

		if (totalSpecies === null) {
			result.addError('Query failed', 400);
			return result;
		}

		result.content = totalSpecies;
		result.addSuccess('Query is ok', 200);
		return result;
	}

	async getSpecies(jwt: string, uuid: string): Promise<Result> {
		let result: Result = new Result();
		const speciesService: Services = new Services();

		let species: Species | UseCaseError = await speciesService.queryGetSpecies(jwt, uuid);

		if (species instanceof UseCaseError) {
			if (species.code === 400) {
				result.addError('Query failed', species.code);
				return result;
			}

			if (species.code === 404) {
				result.addError('Species not found', species.code);
				return result;
			}
		}

		result.content = species;
		result.addSuccess('Query is ok', 200);
		return result;
	}

	async getListOfSpecies(
		jwt: string,
		filters: Array<object>,
		itemsPerPage: number,
		offset: number
	): Promise<Result> {
		let result: Result = new Result();

		let speciesConstraints: Constraints = new Constraints();
		speciesConstraints.offset = offset;
		speciesConstraints.limit = itemsPerPage;

		if (filters.length > 0) {
			speciesConstraints.where = new ConstraintPart('where').addConstraint(filters);
		}

		const speciesService: Services = new Services();

		const listOfSpecies: Array<Species> | UseCaseError = await speciesService.queryListOfSpecies(
			jwt,
			speciesConstraints
		);

		if (listOfSpecies instanceof UseCaseError) {
			result.errors.push(listOfSpecies);
			return result;
		}

		result.content = listOfSpecies;
		result.addSuccess('Query is ok', 200);
		return result;
	}

	async getSpeciesCategories(jwt: string): Promise<Result> {
		let result: Result = new Result();
		const speciesService: Services = new Services();

		const speciesCategories: Array<string> | UseCaseError =
			await speciesService.querySpeciesCategories(jwt);

		if (speciesCategories instanceof UseCaseError) {
			result.errors.push(speciesCategories);
			return result;
		}

		result.content = speciesCategories;
		result.addSuccess('Query is ok', 200);
		return result;
	}

	async getSpeciesOrigins(jwt: string): Promise<Result> {
		let result: Result = new Result();
		const speciesService: Services = new Services();

		const speciesOrigins: Array<string> | UseCaseError = await speciesService.querySpeciesOrigins(
			jwt
		);

		if (speciesOrigins instanceof UseCaseError) {
			result.errors.push(speciesOrigins);
			return result;
		}

		result.content = speciesOrigins;
		result.addSuccess('Query is ok', 200);
		return result;
	}

	async getAlimentations(jwt: string): Promise<Result> {
		let result: Result = new Result();
		const speciesService: Services = new Services();

		const alimentations: Array<string> | UseCaseError = await speciesService.queryAlimentations(
			jwt
		);

		if (alimentations instanceof UseCaseError) {
			result.errors.push(alimentations);
			return result;
		}

		result.content = alimentations;
		result.addSuccess('Query is ok', 200);
		return result;
	}

	async getAnimalZones(jwt: string): Promise<Result> {
		let result: Result = new Result();
		const speciesService: Services = new Services();

		const animalZones: Array<string> | UseCaseError = await speciesService.queryAnimalZones(jwt);

		if (animalZones instanceof UseCaseError) {
			result.errors.push(animalZones);
			return result;
		}

		result.content = animalZones;
		result.addSuccess('Query is ok', 200);
		return result;
	}

	async getAquariumKinds(jwt: string): Promise<Result> {
		let result: Result = new Result();
		const speciesService: Services = new Services();

		const aquariumKinds: Array<string> | UseCaseError = await speciesService.queryAquariumKinds(
			jwt
		);

		if (aquariumKinds instanceof UseCaseError) {
			result.errors.push(aquariumKinds);
			return result;
		}

		result.content = aquariumKinds;
		result.addSuccess('Query is ok', 200);
		return result;
	}

	async getBehaviours(jwt: string): Promise<Result> {
		let result: Result = new Result();
		const speciesService: Services = new Services();

		const behaviours: Array<string> | UseCaseError = await speciesService.queryBehaviours(jwt);

		if (behaviours instanceof UseCaseError) {
			result.errors.push(behaviours);
			return result;
		}

		result.content = behaviours;
		result.addSuccess('Query is ok', 200);
		return result;
	}

	async getDecors(jwt: string): Promise<Result> {
		let result: Result = new Result();
		const speciesService: Services = new Services();

		const decors: Array<string> | UseCaseError = await speciesService.queryDecors(jwt);

		if (decors instanceof UseCaseError) {
			result.errors.push(decors);
			return result;
		}

		result.content = decors;
		result.addSuccess('Query is ok', 200);
		return result;
	}

	async getSoilKinds(jwt: string): Promise<Result> {
		let result: Result = new Result();
		const speciesService: Services = new Services();

		const soilKinds: Array<string> | UseCaseError = await speciesService.querySoilKinds(jwt);

		if (soilKinds instanceof UseCaseError) {
			result.errors.push(soilKinds);
			return result;
		}

		result.content = soilKinds;
		result.addSuccess('Query is ok', 200);
		return result;
	}

	async createSpecies(jwt: string, species: Species): Promise<Result> {
		let result: Result = new Result();
		const speciesService: Services = new Services();

		const updatedSpecies: Species | UseCaseError = await SpeciesUseCase.handleNewSpeciesNaming(
			jwt,
			species
		);

		if (updatedSpecies instanceof UseCaseError) {
			result.errors.push(updatedSpecies);
			return result;
		}

		const speciesResult: string | UseCaseError = await speciesService.createSpecies(
			jwt,
			updatedSpecies
		);

		if (speciesResult instanceof UseCaseError) {
			result.errors.push(speciesResult);

			return result;
		}

		species.uuid = speciesResult;
		species.naming.species_uid = speciesResult;

		const speciesNamingResult: string | UseCaseError = await speciesService.createSpeciesNaming(
			jwt,
			updatedSpecies.naming
		);
		if (speciesNamingResult instanceof UseCaseError) {
			await speciesService.deleteSpecies(jwt, species.uuid);
			result.errors.push(speciesNamingResult);

			return result;
		}

		species.naming.uuid = speciesNamingResult;

		const addNamingToSpeciesResult: SpeciesNaming | UseCaseError =
			await speciesService.addNamingToSpecies(jwt, updatedSpecies.naming);
		if (addNamingToSpeciesResult instanceof UseCaseError) {
			await speciesService.deleteSpecies(jwt, species.uuid);
			result.errors.push(addNamingToSpeciesResult);

			return result;
		}

		result.addSuccess('Query is OK', 201);
		result.content = speciesResult;
		return result;
	}

	async updateGeneralInfos(jwt: string, species: Species): Promise<Result> {
		let result: Result = new Result();
		const speciesService: Services = new Services();

		const editedSpecies: string | Array<UseCaseError> = await speciesService.updateGeneralInfos(
			jwt,
			species.uuid,
			species.origin
		);
		if (typeof editedSpecies !== 'string') {
			result.errors = editedSpecies;
			return result;
		}

		result.addSuccess('Query is OK', 200);
		return result;
	}

	async updateSpeciesNaming(jwt: string, species: Species): Promise<Result> {
		let result: Result = new Result();
		const speciesService: Services = new Services();

		const updatedSpecies: Species | UseCaseError = await SpeciesUseCase.handleNewSpeciesNaming(
			jwt,
			species
		);

		if (updatedSpecies instanceof UseCaseError) {
			result.errors.push(updatedSpecies);
			return result;
		}

		const editedSpecies: string | UseCaseError = await speciesService.updateSpeciesNaming(
			jwt,
			updatedSpecies.naming
		);
		if (editedSpecies instanceof UseCaseError) {
			result.errors.push(editedSpecies);
			return result;
		}

		result.addSuccess('Query is OK', 200);
		return result;
	}

	async updateWaterConstraints(jwt: string, species: Species): Promise<Result> {
		let result: Result = new Result();
		const speciesService: Services = new Services();
		const updatedWaterConstraints: WaterConstraints | Array<UseCaseError> =
			await speciesService.updateWaterConstraints(jwt, species.water_constraints);

		if (updatedWaterConstraints instanceof WaterConstraints) {
			result.addSuccess('Query is OK', 200);
			return result;
		}

		result.errors = updatedWaterConstraints;
		return result;
	}

	async addWaterConstraints(jwt: string, species: Species): Promise<Result> {
		let result: Result = new Result();
		const speciesService: Services = new Services();
		const waterConstraintsUuid: string | Array<UseCaseError> =
			await speciesService.createWaterConstraints(jwt, species.water_constraints);

		if (typeof waterConstraintsUuid !== 'string') {
			result.errors = waterConstraintsUuid;
			return result;
		}

		species.water_constraints.uuid = waterConstraintsUuid;

		const updatedSpecies: WaterConstraints | UseCaseError =
			await speciesService.addWaterConstraintsToSpecies(jwt, species.water_constraints);

		if (updatedSpecies instanceof UseCaseError) {
			result.errors.push(updatedSpecies);
			return result;
		}

		result.addSuccess('Query is OK', 201);
		result.content = waterConstraintsUuid;
		return result;
	}

	async updateAnimalSpecs(jwt: string, species: Species): Promise<Result> {
		let result: Result = new Result();
		const speciesService: Services = new Services();
		const updatedAnimalSpecs: AnimalSpecs | Array<UseCaseError> =
			await speciesService.updateAnimalSpecs(jwt, species.animal_specs);

		if (updatedAnimalSpecs instanceof AnimalSpecs) {
			result.addSuccess('Query is OK', 200);
			return result;
		}

		result.errors = updatedAnimalSpecs;
		return result;
	}

	async addAnimalSpecs(jwt: string, species: Species): Promise<Result> {
		let result: Result = new Result();
		const speciesService: Services = new Services();

		const animalSpecsUuid: string | Array<UseCaseError> = await speciesService.createAnimalSpecs(
			jwt,
			species.animal_specs
		);
		if (typeof animalSpecsUuid !== 'string') {
			result.errors = animalSpecsUuid;
			return result;
		}

		species.animal_specs.uuid = animalSpecsUuid;

		const updatedSpecies: AnimalSpecs | UseCaseError = await speciesService.addAnimalSpecsToSpecies(
			jwt,
			species.animal_specs
		);
		if (updatedSpecies instanceof UseCaseError) {
			result.errors.push(updatedSpecies);
			return result;
		}

		result.content = animalSpecsUuid;
		result.addSuccess('Query is OK', 201);
		return result;
	}

	async updatePlantSpecs(jwt: string, species: Species): Promise<Result> {
		let result: Result = new Result();
		const speciesService: Services = new Services();
		const updatedPlantSpecs: PlantSpecs | Array<UseCaseError> =
			await speciesService.updatePlantSpecs(jwt, species.plant_specs);

		if (updatedPlantSpecs instanceof PlantSpecs) {
			result.addSuccess('Query is OK', 200);
			return result;
		}

		result.errors = updatedPlantSpecs;
		return result;
	}

	async addPlantSpecs(jwt: string, species: Species): Promise<Result> {
		let result: Result = new Result();
		const speciesService: Services = new Services();

		const plantSpecsUuid: string | Array<UseCaseError> = await speciesService.createPlantSpecs(
			jwt,
			species.plant_specs
		);
		if (typeof plantSpecsUuid !== 'string') {
			result.errors = plantSpecsUuid;
			return result;
		}

		species.plant_specs.uuid = plantSpecsUuid;

		const updatedSpecies: PlantSpecs | UseCaseError = await speciesService.addPlantSpecsToSpecies(
			jwt,
			species.plant_specs
		);
		if (updatedSpecies instanceof UseCaseError) {
			result.errors.push(updatedSpecies);
			return result;
		}

		result.content = plantSpecsUuid;
		result.addSuccess('Query is OK', 201);
		return result;
	}

	async addAnimalBehaviour(jwt: string, species: Species): Promise<Result> {
		let result: Result = new Result();
		const speciesService: Services = new Services();

		const animalBehaviourUuid: string | Array<UseCaseError> =
			await speciesService.createAnimalBehaviour(jwt, species.animal_behaviour);
		if (typeof animalBehaviourUuid !== 'string') {
			result.errors = animalBehaviourUuid;
			return result;
		}

		species.animal_behaviour.uuid = animalBehaviourUuid;

		const updatedSpecies: AnimalBehaviour | UseCaseError =
			await speciesService.addAnimalBehaviourToSpecies(jwt, species.animal_behaviour);
		if (updatedSpecies instanceof UseCaseError) {
			result.errors.push(updatedSpecies);
			return result;
		}

		result.content = animalBehaviourUuid;
		result.addSuccess('Query is OK', 201);
		return result;
	}

	async updateAnimalBehaviour(jwt: string, species: Species): Promise<Result> {
		let result: Result = new Result();
		const speciesService: Services = new Services();
		const updatedAnimalBehaviour: AnimalBehaviour | Array<UseCaseError> =
			await speciesService.updateAnimalBehaviour(jwt, species.animal_behaviour);

		if (updatedAnimalBehaviour instanceof AnimalBehaviour) {
			result.addSuccess('Query is OK', 200);
			return result;
		}

		result.errors = updatedAnimalBehaviour;
		return result;
	}

	async addAquariumConstraints(jwt: string, species: Species): Promise<Result> {
		let result: Result = new Result();
		const speciesService: Services = new Services();

		const aquariumConstraintsUuid: string | Array<UseCaseError> =
			await speciesService.createAquariumConstraints(jwt, species.aquarium_constraints);
		if (typeof aquariumConstraintsUuid !== 'string') {
			result.errors = aquariumConstraintsUuid;
			return result;
		}

		species.aquarium_constraints.uuid = aquariumConstraintsUuid;

		const updatedSpecies: AquariumConstraints | UseCaseError =
			await speciesService.addAquariumConstraintsToSpecies(jwt, species.aquarium_constraints);
		if (updatedSpecies instanceof UseCaseError) {
			result.errors.push(updatedSpecies);
			return result;
		}

		result.content = aquariumConstraintsUuid;
		result.addSuccess('Query is OK', 201);
		return result;
	}

	async updateAquariumConstraints(jwt: string, species: Species): Promise<Result> {
		let result: Result = new Result();
		const speciesService: Services = new Services();
		const updatedAquariumConstraints: AquariumConstraints | Array<UseCaseError> =
			await speciesService.updateAquariumConstraints(jwt, species.aquarium_constraints);

		if (updatedAquariumConstraints instanceof AquariumConstraints) {
			result.addSuccess('Query is OK', 200);
			return result;
		}

		result.errors = updatedAquariumConstraints;
		return result;
	}

	async addFile(jwt: string, species: Species, image: Image) {
		const result: Result = new Result();
		const fileService: FileServices = new FileServices();

		if (image.file === null) {
			result.addError('File should not be empty', 400);
			return result;
		}

		const computedFileName: string = fileService.getComputedFileName(image.title);
		const completeRemotePath: string = 'species/' + species.uuid + '/' + computedFileName;

		const uploaded: Image | Array<UseCaseError> = await fileService.uploadFile(
			completeRemotePath,
			image.file
		);
		if (!(uploaded instanceof Image)) {
			result.errors = uploaded;
			return result;
		}

		uploaded.title = image.title;
		uploaded.source = image.source;
		uploaded.associated_to = image.associated_to;

		const fileMetadata: Image | Array<UseCaseError> = await fileService.postMetadata(jwt, uploaded);

		if (!(fileMetadata instanceof Image)) {
			result.errors = fileMetadata;
			return result;
		}

		result.content = fileMetadata;
		result.addSuccess('Query is OK', 201);

		return result;
	}

	async updatePublicationState(jwt: string, species: Species, nextState: string): Promise<Result> {
		let result: Result = new Result();
		const speciesService: Services = new Services();

		const isAbleToMoveToState: boolean | Array<UseCaseError> = await speciesService.checkNextState(
			species,
			nextState
		);

		if (typeof isAbleToMoveToState !== 'boolean') {
			result.errors = isAbleToMoveToState;
			return result;
		}

		const speciesPublicationState: string | Array<UseCaseError> =
			await speciesService.updatePublicationState(jwt, species.uuid, nextState);

		if (typeof speciesPublicationState !== 'string') {
			result.errors = speciesPublicationState;
			return result;
		}

		result.content = speciesPublicationState;
		result.addSuccess('Query is OK', 200);
		return result;
	}

	async deleteSpecies(jwt: string, species: Species): Promise<Result> {
		let result: Result = new Result();
		const speciesService: Services = new Services();

		const isSpeciesDeleted: boolean | Array<UseCaseError> = await speciesService.deleteSpecies(
			jwt,
			species.uuid
		);

		if (typeof isSpeciesDeleted !== 'boolean') {
			result.errors = isSpeciesDeleted;
			return result;
		}

		result.addSuccess('Resource is deleted', 204);
		return result;
	}
}
