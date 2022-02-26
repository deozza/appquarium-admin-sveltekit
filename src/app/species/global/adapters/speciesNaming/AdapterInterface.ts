import type SpeciesNaming from '../../entities/SpeciesNaming';
import type UseCaseError from '../../../../utils/useCasesResult/types/UseCaseError';

export default interface SpeciesNamingAdapterInterface{
	mutationCreateNaming(speciesNaming: SpeciesNaming): Promise<string | UseCaseError>

	mutationAddNamingToSpecies(speciesNaming: SpeciesNaming): Promise<SpeciesNaming | UseCaseError>

	mutationUpdateSpeciesNaming(speciesNaming: SpeciesNaming): Promise<string | UseCaseError>
}