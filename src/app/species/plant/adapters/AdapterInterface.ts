import UseCaseError from "../../../utils/useCasesResult/types/UseCaseError";

export default interface AdapterInterface {
	queryListOfGrowthSpeeds(): Promise<Array<string> | UseCaseError>

	queryListOfZones(): Promise<Array<string> | UseCaseError>

}
