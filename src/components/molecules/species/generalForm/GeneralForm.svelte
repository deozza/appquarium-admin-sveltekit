<script lang="ts">
	import { formElements } from './Modeles';

	import BaseLabel from '../../../atoms/input/BaseLabel.svelte';
	import BaseButton from '../../../atoms/button/BaseButton.svelte';
	import Species from '../../../../app/species/global/entities/Species';
	import User from '../../../../app/user/entities/User';
	import SpeciesUseCase from '../../../../app/species/global/useCases/UseCase';
	import type Result from '../../../../app/utils/useCasesResult/Result';
	import { goto } from '$app/navigation';
	import UserUseCase from '../../../../app/user/useCases/UseCase';
	import BaseTextInput from '../../../atoms/input/text/BaseTextInput.svelte';

	export let species: Species = new Species([]);
	export let speciesOrigins: Array<object> = [];
	export let user: User = new User('');

	formElements['originInput'].value = species.origin;

	if (species.origin !== null) {
		formElements['submitButton'].setStyleOrThrowError('warning');
		formElements['submitButton'].content = 'Modifier';
	}

	if (species.publication_state !== 'DRAFT' && species.publication_state !== 'MODERATED') {
		formElements['submitButton'].isDisabled = true;
		formElements['originInput'].readonly = true;
	}

	async function submitGeneralForm() {
		formElements['submitButton'].setLoading(true);
		species.origin = formElements['originInput'].value;

		const speciesUseCase: SpeciesUseCase = new SpeciesUseCase();
		const result: Result = await speciesUseCase.updateGeneralInfos(user.jwt, species);

		if (result.isFailed()) {
			formElements['submitButton'].setLoading(false);

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

		formElements['submitButton'].setLoading(false);

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
				<BaseLabel baseLabelModel={formElements['originLabel']} />
				<BaseTextInput baseTextInputModel={formElements['originInput']} />
				<datalist id={formElements['originInput'].datalist}>
					{#each speciesOrigins as origin}
						<option value={origin['name']}>
							{origin['name']}
						</option>
					{/each}
				</datalist>
			</div>
		</li>

		<li class="flex-c space-y-2">
			<BaseButton baseButtonModel={formElements['submitButton']} />
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
