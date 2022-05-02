<script lang="ts">
	import BaseLabel from '../../../atoms/input/BaseLabel.svelte';
	import BaseNumberInput from '../../../atoms/input/number/BaseNumberInput.svelte';
	import BaseButton from '../../../atoms/button/BaseButton.svelte';
	import Species from '../../../../app/species/global/entities/Species';
	import User from '../../../../app/user/entities/User';
	import SpeciesUseCase from '../../../../app/species/global/useCases/UseCase';
	import type Result from '../../../../app/utils/useCasesResult/Result';
	import UserUseCase from '../../../../app/user/useCases/UseCase';
	import BaseLabelModel from '../../../atoms/input/BaseLabelModel';
	import BaseNumberInputModel from '../../../atoms/input/number/BaseNumberInputModel';
	import BaseButtonModel from '../../../atoms/button/BaseButtonModel';

	export let species: Species = new Species([]);
	export let user: User = new User('');

	const maleSizeLabel: BaseLabelModel = new BaseLabelModel('Taille du male (cm)', 'maleSize');
	const maleSizeInput: BaseNumberInputModel = new BaseNumberInputModel('maleSize');
	maleSizeInput.required = true;
	maleSizeInput.min = 0;
	maleSizeInput.step = 0.1;
	maleSizeInput.value = species.animal_specs.male_size.toString();

	const femaleSizeLabel: BaseLabelModel = new BaseLabelModel(
		'Taille de la femelle (cm)',
		'femaleSize'
	);
	const femaleSizeInput: BaseNumberInputModel = new BaseNumberInputModel('femaleSize');
	femaleSizeInput.required = true;
	femaleSizeInput.min = 0;
	femaleSizeInput.step = 0.1;
	femaleSizeInput.value = species.animal_specs.female_size.toString();

	const longevityLabel: BaseLabelModel = new BaseLabelModel('Longévité (années)', 'longevity');
	const longevityInput: BaseNumberInputModel = new BaseNumberInputModel('longevity');
	longevityInput.required = true;
	longevityInput.min = 0;
	longevityInput.step = 1;
	longevityInput.value = species.animal_specs.longevity_in_years.toString();

	let submitButton: BaseButtonModel = new BaseButtonModel('Ajouter');

	if (species.animal_specs.uuid !== '') {
		submitButton.setStyleOrThrowError('warning');
		submitButton.content = 'Modifier';
	}

	if (species.publication_state !== 'DRAFT' && species.publication_state !== 'MODERATED') {
		submitButton.isDisabled = true;
		maleSizeInput.readonly = true;
		femaleSizeInput.readonly = true;
		longevityInput.readonly = true;
	}

	async function submitAnimalSpecsForm() {
		submitButton.setLoading(true);

		species.animal_specs.male_size = parseInt(maleSizeInput.value);
		species.animal_specs.female_size = parseInt(femaleSizeInput.value);
		species.animal_specs.longevity_in_years = parseInt(longevityInput.value);
		species.animal_specs.species_uuid = species.uuid;

		const speciesUseCase: SpeciesUseCase = new SpeciesUseCase();
		let result: Result;
		if (species.animal_specs.uuid !== '') {
			result = await speciesUseCase.updateAnimalSpecs(user.jwt, species);
		} else {
			result = await speciesUseCase.addAnimalSpecs(user.jwt, species);
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
		}

		submitButton.setLoading(false);

		if (result.success?.code === 201) {
			species.animal_specs.uuid = result.content;
		}
	}
</script>

<form class="min-w-full" on:submit|preventDefault={submitAnimalSpecsForm}>
	<ul class="space-y-6">
		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={maleSizeLabel} />
				<BaseNumberInput baseNumberInputModel={maleSizeInput} />
			</div>
		</li>
		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={femaleSizeLabel} />
				<BaseNumberInput baseNumberInputModel={femaleSizeInput} />
			</div>
		</li>
		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={longevityLabel} />
				<BaseNumberInput baseNumberInputModel={longevityInput} />
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
