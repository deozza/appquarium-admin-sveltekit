<script lang="ts">
	import BaseButton from '../../../atoms/button/BaseButton.svelte';

	import Species from '../../../../app/species/global/entities/Species';
	import User from '../../../../app/user/entities/User';

	import SpeciesUseCase from '../../../../app/species/global/useCases/UseCase';
	import UserUseCase from '../../../../app/user/useCases/UseCase';
	import type Result from '../../../../app/utils/useCasesResult/Result';

	import { goto } from '$app/navigation';
	import BaseButtonModel from '../../../atoms/button/BaseButtonModel';

	export let species: Species = new Species([]);
	export let user: User = new User('');
	let isLoading: boolean = false;

	const prePublishButton: BaseButtonModel = new BaseButtonModel('Pré-publier');
	prePublishButton.setStyleOrThrowError('info');
	prePublishButton.setTypeOrThrowError('button');
	prePublishButton.event = 'PRE_PUBLISHED';

	const publishButton: BaseButtonModel = new BaseButtonModel('Publier');
	publishButton.setStyleOrThrowError('success');
	publishButton.setTypeOrThrowError('button');
	publishButton.event = 'PUBLISHED';

	const moderateButton: BaseButtonModel = new BaseButtonModel('Modérer');
	moderateButton.setStyleOrThrowError('warning');
	moderateButton.setTypeOrThrowError('button');
	moderateButton.event = 'MODERATED';

	const archiveButton: BaseButtonModel = new BaseButtonModel('Archiver');
	archiveButton.setStyleOrThrowError('secondary');
	archiveButton.setTypeOrThrowError('button');
	archiveButton.event = 'ARCHIVED';

	const deleteButton: BaseButtonModel = new BaseButtonModel('Supprimer');
	deleteButton.setStyleOrThrowError('danger');
	deleteButton.setTypeOrThrowError('button');
	deleteButton.event = 'DELETE';

	const possibleNextStates: object = {
		DRAFT: [prePublishButton, archiveButton],
		PRE_PUBLISHED: [publishButton, moderateButton],
		PUBLISHED: [moderateButton],
		MODERATED: [publishButton, archiveButton],
		ARCHIVED: [moderateButton, deleteButton]
	};
	async function editPublicationState(newState: string) {
		isLoading = true;

		const speciesUseCase: SpeciesUseCase = new SpeciesUseCase();

		let result: Result;

		if (newState !== 'DELETE') {
			result = await speciesUseCase.updatePublicationState(user.jwt, species, newState);
		} else {
			result = await speciesUseCase.deleteSpecies(user.jwt, species);
		}

		if (result.isFailed()) {
			for (const error of result.errors) {
				console.log(error);

				if (error.code === 401) {
					const userUseCase: UserUseCase = new UserUseCase();
					userUseCase.logout();
					return goto('/admin');
				}
			}
			isLoading = false;
			return;
		}

		if (newState === 'DELETE') {
			return goto('/admin/species/' + species.category);
		}

		isLoading = false;
		species.publication_state = result.content;
	}
</script>

<div class="flex-r space-x-6">
	{#if isLoading === false}
		{#each possibleNextStates[species.publication_state] as button}
			<BaseButton baseButtonModel={button} on:click={() => editPublicationState(button.event)} />
		{/each}
	{:else}
		<p>chargement ...</p>
	{/if}
</div>
