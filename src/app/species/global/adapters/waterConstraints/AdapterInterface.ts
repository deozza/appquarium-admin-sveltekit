import UseCaseError from '../../../../utils/useCasesResult/types/UseCaseError';
import WaterConstraints from '../../entities/WaterConstraints';

export default interface WaterConstraintsAdapterInterface{
	mutationCreateWaterConstraints(waterConstraints: WaterConstraints): Promise<string | Array<UseCaseError>>

	mutationEditWaterConstraints(waterConstraints: WaterConstraints): Promise<WaterConstraints | Array<UseCaseError>>

	mutationAddWaterConstraintsToSpecies(waterConstraint: WaterConstraints): Promise<WaterConstraints | UseCaseError>
}