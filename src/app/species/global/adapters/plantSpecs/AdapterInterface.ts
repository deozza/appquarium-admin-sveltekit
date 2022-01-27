import UseCaseError from '../../../../utils/useCasesResult/types/UseCaseError';
import PlantSpecs from '../../entities/PlantSpecs';

export default interface PlantSpecsAdapterInterface{
	mutationCreatePlantSpecs(plantSpecs: PlantSpecs): Promise<string | Array<UseCaseError>>

	mutationEditPlantSpecs(plantSpecs: PlantSpecs): Promise<PlantSpecs | Array<UseCaseError>>

	mutationAddPlantSpecsToSpecies(plantSpecs: PlantSpecs): Promise<PlantSpecs | UseCaseError>
}