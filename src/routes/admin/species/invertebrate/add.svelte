<script lang="ts">
	import { header } from '../../../../components/pages/admin/fish/add/Modeles';
	import BaseHeader from '../../../../components/atoms/typography/header/BaseHeader.svelte';
	import NamingForm from '../../../../components/molecules/species/namingForm/NamingForm.svelte';

	import User from '../../../../app/user/entities/User';
	import type Species from '../../../../app/species/global/entities/Species';
	import type SpeciesGenre from '../../../../app/species/global/entities/SpeciesGenre';
	import type SpeciesFamily from '../../../../app/species/global/entities/SpeciesFamily';

	import UserUseCase from '../../../../app/user/useCases/UseCase';
	import InvertebrateUseCase from '../../../../app/species/invertebrate/useCases/UseCase';

	import type Result from '../../../../app/utils/useCasesResult/Result';
	import type UseCaseError from '../../../../app/utils/useCasesResult/types/UseCaseError';

	import { goto } from '$app/navigation';

	export let speciesGenres: Array<SpeciesGenre> = [];
	export let speciesFamilies: Array<SpeciesFamily> = [];
	const userUseCase: UserUseCase = new UserUseCase();
	const jwt: Result = userUseCase.getToken();
	const user: User = new User(jwt.content);
	user.extractUserInfoFromJwt();

	const invertebrateUseCase: InvertebrateUseCase = new InvertebrateUseCase();
	let invertebrate: Species = invertebrateUseCase.initNewInvertebrate(user);

	async function loadSpeciesNaming(): Promise<Species | Array<UseCaseError> | void> {
		const speciesGenresResult: Result = await invertebrateUseCase.getInvertebrateGenres(
			jwt.content
		);
		if (speciesGenresResult.isFailed()) {
			for (const error of speciesGenresResult.errors) {
				if (error.code === 401) {
					userUseCase.logout();
					return goto('/');
				}
			}
			return speciesGenresResult.errors;
		}

		speciesGenres = speciesGenresResult.content;

		const speciesFamiliesResult: Result = await invertebrateUseCase.getInvertebrateFamilies(
			jwt.content
		);
		if (speciesFamiliesResult.isFailed()) {
			for (const error of speciesFamiliesResult.errors) {
				if (error.code === 401) {
					userUseCase.logout();
					return goto('/');
				}
			}
			return speciesFamiliesResult.errors;
		}

		speciesFamilies = speciesFamiliesResult.content;
	}
</script>

<section class="flex-c pb-12">
	<BaseHeader baseHeaderModel={header} />
</section>

<div class="flex-c">
	<section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
		{#await loadSpeciesNaming()}
			<p>Chargement...</p>
		{:then { }}
			<NamingForm species={invertebrate} {speciesFamilies} {speciesGenres} {user} />
		{:catch errors}
			{#each errors as error}
				<p>{error.type}</p>
			{/each}
		{/await}
	</section>
</div>
