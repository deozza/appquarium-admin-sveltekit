import UseCaseError from '../../../../utils/useCasesResult/types/UseCaseError';
import AnimalSpecs from '../../entities/AnimalSpecs';

export default interface AnimalSpecsAdapterInterface{
	mutationCreateAnimalSpecs(animalSpecs: AnimalSpecs): Promise<string | Array<UseCaseError>>

	mutationEditAnimalSpecs(animalSpecs: AnimalSpecs): Promise<AnimalSpecs | Array<UseCaseError>>

	mutationAddAnimalSpecsToSpecies(animalSpecs: AnimalSpecs): Promise<AnimalSpecs | UseCaseError>
}