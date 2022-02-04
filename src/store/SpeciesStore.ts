import { writable } from 'svelte/store';
import Result from '../app/utils/useCasesResult/Result';
import FishUseCase from '../app/species/fish/useCases/UseCase';
import SpeciesUseCase from '../app/species/global/useCases/UseCase';
import PlantUseCase from '../app/species/plant/useCases/UseCase';
import InvertebrateUseCase from '../app/species/invertebrate/useCases/UseCase';
import BaseOptionModel from '../components/atoms/input/select/BaseOptionModel';

const speciesUseCase: SpeciesUseCase = new SpeciesUseCase();
const fishUseCase: FishUseCase = new FishUseCase();
const plantUseCase: PlantUseCase = new PlantUseCase();
const invertebrateUseCase: InvertebrateUseCase = new InvertebrateUseCase();

export const origins = writable([]);

export const fishGenres = writable([]);
export const fishFamilies = writable([]);

export const invertebrateGenres = writable([]);
export const invertebrateFamilies = writable([]);

export const plantGenres = writable([]);
export const plantFamilies = writable([]);
export const growthSpeeds = writable([]);
export const plantZones = writable([]);

export const animalZones = writable([]);
export const alimentations = writable([]);
export const aquariumKinds = writable([]);
export const behaviours = writable([]);
export const soilKinds = writable([]);
export const decors = writable([]);

export const hasLoaded = writable(false)

export async function loadEnums(){
	await loadOrigins()
	await loadFishGenres()
	await loadFishFamilies()
	await loadInvertebrateGenres()
	await loadInvertebrateFamilies()
	await loadAlimentations()
	await loadAquariumKinds()
	await loadAnimalZones()
	await loadBehaviours()
	await loadSoilKinds()
	await loadDecors()
	await loadPlantGenres()
	await loadPlantFamilies()
	await loadListOfGrowthSpeeds()
	await loadListOfPlantZones()
	hasLoaded.set(true)
}

async function loadOrigins(){
	const speciesOriginsResult: Result = await speciesUseCase.getSpeciesOrigins('');
	if (speciesOriginsResult.isFailed()) {
		new Error(speciesOriginsResult.errors.toString());
	}

	origins.set(speciesOriginsResult.content);
}

export async function loadFishGenres(){
	const speciesGenresResult: Result = await fishUseCase.getFishGenres('');
	if (speciesGenresResult.isFailed()) {
		new Error(speciesGenresResult.errors.toString());
	}

	fishGenres.set(speciesGenresResult.content);
}

async function loadFishFamilies() {
	const speciesFamiliesResult: Result = await fishUseCase.getFishFamilies('');
	if (speciesFamiliesResult.isFailed()) {
		new Error(speciesFamiliesResult.errors.toString());
	}
	fishFamilies.set(speciesFamiliesResult.content);
}

async function loadInvertebrateGenres(){
	const speciesGenresResult: Result = await invertebrateUseCase.getInvertebrateGenres('')
	if (speciesGenresResult.isFailed()) {
		new Error(speciesGenresResult.errors.toString())
	}

	invertebrateGenres.set(speciesGenresResult.content)
}

async function loadInvertebrateFamilies() {
	const speciesFamiliesResult: Result = await invertebrateUseCase.getInvertebrateFamilies('')
	if (speciesFamiliesResult.isFailed()) {
		new Error(speciesFamiliesResult.errors.toString())
	}
	invertebrateFamilies.set(speciesFamiliesResult.content)
}

async function loadAlimentations(){
	const alimentationsResult: Result = await speciesUseCase.getAlimentations('');
	if (alimentationsResult.isFailed()) {
		new Error(alimentationsResult.errors.toString());
	}

	alimentations.set(alimentationsResult.content);
}

async function loadAnimalZones(){
	const animalZonesResult: Result = await speciesUseCase.getAnimalZones('');
	if (animalZonesResult.isFailed()) {
		new Error(animalZonesResult.errors.toString());
	}

	animalZones.set(animalZonesResult.content);
}

async function loadAquariumKinds(){
	const aquariumKindsResult: Result = await speciesUseCase.getAquariumKinds('');

	if (aquariumKindsResult.isFailed()) {
		new Error(aquariumKindsResult.errors.toString());
	}

	const options: Array<BaseOptionModel> = aquariumKindsResult.content.map((aquariumKind: object) => new BaseOptionModel(aquariumKind.name, aquariumKind.name));
	aquariumKinds.set(options);
}

async function loadBehaviours(){
	const behavioursResult: Result = await speciesUseCase.getBehaviours('');
	if (behavioursResult.isFailed()) {
		new Error(behavioursResult.errors.toString());
	}

	const options: Array<BaseOptionModel> = behavioursResult.content.map((behaviour: object) => new BaseOptionModel(behaviour.name, behaviour.name));
	behaviours.set(options);
}

async function loadSoilKinds(){
	const soilKindsResult: Result = await speciesUseCase.getSoilKinds('');
	if (soilKindsResult.isFailed()) {
		new Error(soilKindsResult.errors.toString());
	}

	const options: Array<BaseOptionModel> = soilKindsResult.content.map((soilKind: object) => new BaseOptionModel(soilKind.name, soilKind.name));
	soilKinds.set(options);
}

async function loadDecors(){
	const decorsResult: Result = await speciesUseCase.getDecors('');
	if (decorsResult.isFailed()) {
		new Error(decorsResult.errors.toString());
	}

	decors.set(decorsResult.content);
}

async function loadPlantGenres(){
	const speciesGenresResult: Result = await plantUseCase.getPlantGenres('');
	if (speciesGenresResult.isFailed()) {
		new Error(speciesGenresResult.errors.toString());
	}

	plantGenres.set(speciesGenresResult.content);
}

async function loadPlantFamilies(){
	const speciesFamiliesResult: Result = await plantUseCase.getPlantFamilies('');
	if (speciesFamiliesResult.isFailed()) {
		new Error(speciesFamiliesResult.errors.toString());
	}
	plantFamilies.set(speciesFamiliesResult.content);
}

async function loadListOfGrowthSpeeds(){

	const listOfGrowthSpeedsFromAdapter: Result = await plantUseCase.getListOfGrowthSpeeds('');
	if (listOfGrowthSpeedsFromAdapter.isFailed()) {
		new Error(listOfGrowthSpeedsFromAdapter.errors.toString());
	}

	const options: Array<BaseOptionModel> = listOfGrowthSpeedsFromAdapter.content.map((growthSpeed: object) => new BaseOptionModel(growthSpeed.name, growthSpeed.name));
	growthSpeeds.set(options)
}

async function loadListOfPlantZones(){

	const listOfZonesFromAdapter: Result = await plantUseCase.getListOfZones('');
	if (listOfZonesFromAdapter.isFailed()) {
		new Error(listOfZonesFromAdapter.errors.toString());
	}
	const options: Array<BaseOptionModel> = listOfZonesFromAdapter.content.map((zone: object) => new BaseOptionModel(zone.name, zone.name));
	plantZones.set(options)
}