import type UseCaseError from '../../../../utils/useCasesResult/types/UseCaseError';
import type AnimalBehaviour from '../../entities/AnimalBehaviour';

export default interface AnimalBehaviourAdapterInterface{
	queryListOfAlimentations(): Promise<Array<string> | UseCaseError>

	queryListOfAnimalZones(): Promise<Array<string> | UseCaseError>

	queryListOfAquariumKinds(): Promise<Array<string> | UseCaseError>

	queryListOfBehaviours(): Promise<Array<string> | UseCaseError>

	mutationCreateAnimalBehaviour(animalBehaviour: AnimalBehaviour): Promise<string | Array<UseCaseError>>

	mutationEditAnimalBehaviour(animalBehaviour: AnimalBehaviour): Promise<AnimalBehaviour | Array<UseCaseError>>

	mutationAddAnimalBehaviourToSpecies(animalBehaviour: AnimalBehaviour): Promise<AnimalBehaviour | UseCaseError>
}