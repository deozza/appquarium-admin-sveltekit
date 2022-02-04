import UseCaseError from '../../../../utils/useCasesResult/types/UseCaseError';
import AquariumConstraints from '../../entities/AquariumConstraints';

export default interface AquariumConstraintsAdapterInterface{
	queryListOfDecors(): Promise<Array<string> | UseCaseError>

	queryListOfSoilKinds(): Promise<Array<string> | UseCaseError>

	mutationCreateAquariumConstraints(aquariumConstraints: AquariumConstraints): Promise<string | Array<UseCaseError>>

	mutationEditAquariumConstraints(aquariumConstraints: AquariumConstraints): Promise<AquariumConstraints | Array<UseCaseError>>

	mutationAddAquariumConstraintsToSpecies(aquariumConstraints: AquariumConstraints): Promise<AquariumConstraints | UseCaseError>
}