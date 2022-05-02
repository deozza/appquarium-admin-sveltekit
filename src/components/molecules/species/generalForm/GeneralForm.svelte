<script lang="ts">
	import BaseLabel from '../../../atoms/input/BaseLabel.svelte';
	import BaseButton from '../../../atoms/button/BaseButton.svelte';
	import BaseTextInput from '../../../atoms/input/text/BaseTextInput.svelte';

	import Species from '../../../../app/species/global/entities/Species';
	import User from '../../../../app/user/entities/User';
	import SpeciesUseCase from '../../../../app/species/global/useCases/UseCase';
	import UserUseCase from '../../../../app/user/useCases/UseCase';
	import type Result from '../../../../app/utils/useCasesResult/Result';
	import Translation from '../../../../app/utils/i18n/Translation';

	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import BaseButtonModel from '../../../atoms/button/BaseButtonModel';
	import BaseLabelModel from '../../../atoms/input/BaseLabelModel';
	import BaseTextInputModel from '../../../atoms/input/text/BaseTextInputModel';

	export let species: Species = new Species([]);
	export let speciesOrigins: Array<object> = [];
	export let user: User = new User('');

	const submitButton: BaseButtonModel = new BaseButtonModel('Ajouter');
	const originLabel: BaseLabelModel = new BaseLabelModel('Origine', 'origin');
	const originInput: BaseTextInputModel = new BaseTextInputModel('origin');
	originInput.datalist = 'originInput-list';
	originInput.required = true;

	onMount(() => {
		originInput.value = species.origin;

		if (species.origin !== null) {
			submitButton.setStyleOrThrowError('warning');
			submitButton.content = 'Modifier';
		}

		if (species.publication_state !== 'DRAFT' && species.publication_state !== 'MODERATED') {
			submitButton.isDisabled = true;
			originInput.readonly = true;
		}
	});

	async function submitGeneralForm() {
		submitButton.setLoading(true);
		species.origin = originInput.value;

		const speciesUseCase: SpeciesUseCase = new SpeciesUseCase();
		const result: Result = await speciesUseCase.updateGeneralInfos(user.jwt, species);

		if (result.isFailed()) {
			submitButton.setLoading(false);

			for (const error of result.errors) {
				if (error.code === 401) {
					const userUseCase: UserUseCase = new UserUseCase();
					userUseCase.logout();
					return {
						redirect: '/login',
						status: 302
					};
				}
			}
		}

		submitButton.setLoading(false);

		if (result.success?.code === 201) {
			species.uuid = result.content;
			return goto(species.computeLinkToSpecies());
		}
	}
</script>

<form class="min-w-full" on:submit|preventDefault={submitGeneralForm}>
	<ul class="space-y-6">
		<li class="flex-c">
			<div class="flex-r">
				<BaseLabel baseLabelModel={originLabel} />
				<BaseTextInput baseTextInputModel={originInput} />
				<datalist id={originInput.datalist}>
					{#each speciesOrigins as origin}
						<option value={origin['name']}>
							{Translation.translate(['origins',origin['name']])}
						</option>
					{/each}
				</datalist>
			</div>
		</li>

		<li class="flex-c space-y-2">
			<BaseButton baseButtonModel={submitButton} />
		</li>
	</ul>
</form>

<style>
	li > div {
		padding: 0.5em;
		align-items: normal;
		width: 98%;
	}
</style>
