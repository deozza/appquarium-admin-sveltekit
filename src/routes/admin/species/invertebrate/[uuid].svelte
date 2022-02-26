<script lang="ts">
	import {
		header,
		statusPill,
		generalFormHeader,
		namingFormHeader,
		waterConstraintsFormHeader,
		imageFormHeader,
		specsFormHeader
	} from '../../../../components/pages/admin/[uuid]/Modeles';

	import BaseHeader from '../../../../components/atoms/typography/header/BaseHeader.svelte';
	import GeneralForm from '../../../../components/molecules/species/generalForm/GeneralForm.svelte';
	import NamingForm from '../../../../components/molecules/species/namingForm/NamingForm.svelte';
	import WaterConstraintsForm from '../../../../components/molecules/species/waterConstraintsForm/WaterConstraintsForm.svelte';
	import AnimalSpecsForm from '../../../../components/molecules/species/animalSpecsForm/AnimalSpecsForm.svelte';
	import BasePill from '../../../../components/atoms/pill/BasePill.svelte';
	import ImagesForm from '../../../../components/molecules/species/imagesForm/ImagesForm.svelte';
	import PublicationStateSwitcher from '../../../../components/molecules/species/publicationStateSwitcher/PublicationStateSwitcher.svelte';

	import User from '../../../../app/user/entities/User';
	import Species from '../../../../app/species/global/entities/Species';

	import UserUseCase from '../../../../app/user/useCases/UseCase';
	import SpeciesUseCase from '../../../../app/species/global/useCases/UseCase';
	import type Result from '../../../../app/utils/useCasesResult/Result';

	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	import {
		hasLoaded,
		loadEnums,
		origins,
		invertebrateFamilies,
		invertebrateGenres
	} from '../../../../store/SpeciesStore';

	export let invertebrate: Species = new Species([]);

	const userUseCase: UserUseCase = new UserUseCase();
	const speciesUseCase: SpeciesUseCase = new SpeciesUseCase();

	const jwt: Result = userUseCase.getToken();
	const user: User = new User(jwt.content);

	let loadingInvertebrate: boolean = true;

	onMount(async () => {
		const loadInvertebrateResult: Species | void = await loadInvertebrate();

		if (loadInvertebrateResult instanceof Species) {
			invertebrate = loadInvertebrateResult;
		}

		header.setContent(invertebrate.computeName());
		statusPill.setStyleOrThrowError(invertebrate.getPublicationStateStyle());
		statusPill.content = invertebrate.getPublicationStateContent();

		if ($hasLoaded !== true) {
			await loadEnums();
		}

		loadingInvertebrate = false;
	});

	async function loadInvertebrate(): Promise<Species | void> {
		const invertebrateResult: Result = await speciesUseCase.getSpecies(
			jwt.content,
			$page.params.uuid
		);

		if (invertebrateResult.isFailed()) {
			for (const error of invertebrateResult.errors) {
				if (error.code === 401) {
					userUseCase.logout();
					return goto('/');
				}
			}
			return invertebrateResult.content;
		}

		return invertebrateResult.content;
	}
</script>

<div class="flex-c">
	{#if loadingInvertebrate}
		<section>
			<BaseHeader baseHeaderModel={header}>
				<BasePill basePillModel={statusPill} />
			</BaseHeader>
		</section>
	{:else}
		<section>
			<BaseHeader baseHeaderModel={header}>
				<BasePill basePillModel={statusPill} />
			</BaseHeader>
		</section>

		<section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
			<BaseHeader baseHeaderModel={generalFormHeader} />
			<GeneralForm species={invertebrate} speciesOrigins={$origins} {user} />
		</section>

		<section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
			<BaseHeader baseHeaderModel={namingFormHeader} />
			<NamingForm
				species={invertebrate}
				speciesFamilies={$invertebrateFamilies}
				speciesGenres={$invertebrateGenres}
				{user}
			/>
		</section>

		<section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
			<BaseHeader baseHeaderModel={waterConstraintsFormHeader} />
			<WaterConstraintsForm species={invertebrate} {user} />
		</section>

		<section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
			<BaseHeader baseHeaderModel={specsFormHeader} />
			<AnimalSpecsForm species={invertebrate} {user} />
		</section>

		<section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
			<BaseHeader baseHeaderModel={imageFormHeader} />
			<ImagesForm species={invertebrate} />
		</section>

		<section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
			<PublicationStateSwitcher species={invertebrate} {user} />
		</section>
	{/if}
</div>
