<script lang="ts">
	import BaseLabel from '../../../atoms/input/BaseLabel.svelte';
	import BaseNumberInput from '../../../atoms/input/number/BaseNumberInput.svelte';
	import BaseButton from '../../../atoms/button/BaseButton.svelte';
	import BaseSelectInput from '../../../atoms/input/select/BaseSelectInput.svelte';

	import Species from '../../../../app/species/global/entities/Species';
	import User from '../../../../app/user/entities/User';
	import SpeciesUseCase from '../../../../app/species/global/useCases/UseCase';
	import type Result from '../../../../app/utils/useCasesResult/Result';
	import UserUseCase from '../../../../app/user/useCases/UseCase';
	import Translation from '../../../../app/utils/i18n/Translation';

	import { soilKinds, decors } from '../../../../store/SpeciesStore';
	import BaseLabelModel from '../../../atoms/input/BaseLabelModel';
	import BaseNumberInputModel from '../../../atoms/input/number/BaseNumberInputModel';
	import BaseSelectInputModel from '../../../atoms/input/select/BaseSelectInputModel';
	import BaseButtonModel from '../../../atoms/button/BaseButtonModel';

	export let species: Species = new Species([]);
	export let user: User = new User('');
	
	const minVolumeLabel: BaseLabelModel = new BaseLabelModel('Volume minimal (L)', 'minVolume');
	const minVolumeInput: BaseNumberInputModel = new BaseNumberInputModel('minVolume');
	minVolumeInput.min = 1;
	minVolumeInput.required = true;
	minVolumeInput.value = species.aquarium_constraints.min_volume.toString();

	const maxVolumeLabel: BaseLabelModel = new BaseLabelModel('Volume maximal (L)', 'maxVolume');
	const maxVolumeInput: BaseNumberInputModel = new BaseNumberInputModel('maxVolume');
	maxVolumeInput.value = species.aquarium_constraints.max_volume !== null ? species.aquarium_constraints.max_volume.toString() : null;

	const minLengthLabel: BaseLabelModel = new BaseLabelModel('Longueur minimale (cm)', 'minLength');
	const minLengthInput: BaseNumberInputModel = new BaseNumberInputModel('minLength');
	minLengthInput.value = species.aquarium_constraints.min_length !== null ? species.aquarium_constraints.min_length.toString() : null;

	const maxHeightLabel: BaseLabelModel = new BaseLabelModel('Hauteur maximale (cm)', 'maxHeight');
	const maxHeightInput: BaseNumberInputModel = new BaseNumberInputModel('maxHeight');
	maxHeightInput.value = species.aquarium_constraints.max_height !== null ? species.aquarium_constraints.max_height.toString() : null;

	const soilKindLabel: BaseLabelModel = new BaseLabelModel('Type de sol', 'soilKind');
	const soilKindInput: BaseSelectInputModel = new BaseSelectInputModel('soilKind');
	soilKindInput.value = species.aquarium_constraints.soil_kind;

	const decorLabel: BaseLabelModel = new BaseLabelModel('Décor', 'decor');

	let submitButton: BaseButtonModel = new BaseButtonModel('Ajouter');

	if (species.aquarium_constraints.uuid !== '') {
		submitButton.setStyleOrThrowError('warning');
		submitButton.content = 'Modifier';
	}

	if (species.publication_state !== 'DRAFT' && species.publication_state !== 'MODERATED') {
		submitButton.isDisabled = true;
		minVolumeInput.readonly = true;
		maxVolumeInput.readonly = true;
		minLengthInput.readonly = true;
		maxHeightInput.readonly = true;
		soilKindInput.readonly = true;
	}

	async function submitAquariumConstraintsForm() {
		submitButton.setLoading(true);

		species.aquarium_constraints.min_volume = parseInt(minVolumeInput.value);
		species.aquarium_constraints.max_volume = parseInt(maxVolumeInput.value);
		species.aquarium_constraints.min_length = parseInt(minLengthInput.value);
		species.aquarium_constraints.max_height = parseInt(maxHeightInput.value);
		species.aquarium_constraints.soil_kind = soilKindInput.value;
		species.aquarium_constraints.species_uuid = species.uuid;

		const speciesUseCase: SpeciesUseCase = new SpeciesUseCase();
		let result: Result;
		if (species.aquarium_constraints.uuid !== '') {
			result = await speciesUseCase.updateAquariumConstraints(user.jwt, species);
		} else {
			result = await speciesUseCase.addAquariumConstraints(user.jwt, species);
		}

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
			console.log(result.errors);
		}

		submitButton.setLoading(false);

		if (result.success?.code === 201) {
			species.aquarium_constraints.uuid = result.content;
		}
	}
</script>

<form class="min-w-full" on:submit|preventDefault={submitAquariumConstraintsForm}>
	<ul class="space-y-6">
		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={minVolumeLabel} />
				<BaseNumberInput baseNumberInputModel={minVolumeInput} />
			</div>
		</li>
		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={maxVolumeLabel} />
				<BaseNumberInput baseNumberInputModel={maxVolumeInput} />
			</div>
		</li>
		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={minLengthLabel} />
				<BaseNumberInput baseNumberInputModel={minLengthInput} />
			</div>
		</li>
		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={maxHeightLabel} />
				<BaseNumberInput baseNumberInputModel={maxHeightInput} />
			</div>
		</li>

		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={soilKindLabel} />
				<BaseSelectInput
					baseSelectInputModel={soilKindInput}
					options={$soilKinds}
				/>
			</div>
		</li>

		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={decorLabel} />
				{#each $decors as decor}
					<label class="px-1" for={decor.name}>
						<input
							class=""
							type="checkbox"
							bind:group={species.aquarium_constraints.decor}
							value={decor.name}
							id={decor.name}
							name={decor.name}
						/>
						{Translation.translate(['aquarium_decors', decor.name])}
					</label>
				{/each}
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
