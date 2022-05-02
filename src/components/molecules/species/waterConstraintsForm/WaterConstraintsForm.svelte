<script lang="ts">
	import BaseLabel from '../../../atoms/input/BaseLabel.svelte';
	import BaseButton from '../../../atoms/button/BaseButton.svelte';
	import Species from '../../../../app/species/global/entities/Species';
	import User from '../../../../app/user/entities/User';
	import SpeciesUseCase from '../../../../app/species/global/useCases/UseCase';
	import type Result from '../../../../app/utils/useCasesResult/Result';
	import UserUseCase from '../../../../app/user/useCases/UseCase';
	import BaseLabelModel from '../../../atoms/input/BaseLabelModel';
	import BaseNumberInputModel from '../../../atoms/input/number/BaseNumberInputModel';
	import BaseButtonModel from '../../../atoms/button/BaseButtonModel';
	import BaseNumberInput from '../../../atoms/input/number/BaseNumberInput.svelte';

	export let species: Species = new Species([]);
	export let user: User = new User('');

	const phMinLabel: BaseLabelModel = new BaseLabelModel('pH minimum', 'phMin');
	const phMinInput: BaseNumberInputModel = new BaseNumberInputModel('phMin');
	phMinInput.required = true;
	phMinInput.min = 0;
	phMinInput.max = 14;
	phMinInput.step = 0.1;
	phMinInput.errorMessage = 'Cette valeur doit etre inférieure au pH maximum';
	phMinInput.value = species.water_constraints.ph_min.toString();

	const phMaxLabel: BaseLabelModel = new BaseLabelModel('pH maximum', 'phMax');
	const phMaxInput: BaseNumberInputModel = new BaseNumberInputModel('phMax');
	phMaxInput.required = true;
	phMaxInput.min = 0;
	phMaxInput.max = 14;
	phMaxInput.step = 0.1;
	phMaxInput.errorMessage = 'Cette valeur doit etre supérieure au pH minimum';
	phMaxInput.value = species.water_constraints.ph_max.toString();

	const ghMinLabel: BaseLabelModel = new BaseLabelModel('GH minimum', 'ghMin');
	const ghMinInput: BaseNumberInputModel = new BaseNumberInputModel('ghMin');
	ghMinInput.required = true;
	ghMinInput.min = 0;
	ghMinInput.max = 50;
	ghMinInput.step = 1;
	ghMinInput.errorMessage = 'Cette valeur doit etre inférieure au GH maximum';
	ghMinInput.value = species.water_constraints.gh_min.toString();

	const ghMaxLabel: BaseLabelModel = new BaseLabelModel('GH maximum', 'ghMax');
	const ghMaxInput: BaseNumberInputModel = new BaseNumberInputModel('ghMax');
	ghMaxInput.required = true;
	ghMaxInput.min = 0;
	ghMaxInput.max = 50;
	ghMaxInput.step = 1;
	ghMaxInput.errorMessage = 'Cette valeur doit etre supérieure au GH minimum';
	ghMaxInput.value = species.water_constraints.gh_max.toString();

	const tempMinLabel: BaseLabelModel = new BaseLabelModel('Température minimum', 'tempMin');
	const tempMinInput: BaseNumberInputModel = new BaseNumberInputModel('tempMin');
	tempMinInput.required = true;
	tempMinInput.min = 10;
	tempMinInput.max = 35;
	tempMinInput.step = 1;
	tempMinInput.errorMessage = 'Cette valeur doit etre inférieure à la température maximum';
	tempMinInput.value = species.water_constraints.temp_min.toString();

	const tempMaxLabel: BaseLabelModel = new BaseLabelModel('Température maximum', 'tempMax');
	const tempMaxInput: BaseNumberInputModel = new BaseNumberInputModel('tempMax');
	tempMaxInput.required = true;
	tempMaxInput.min = 10;
	tempMaxInput.max = 35;
	tempMaxInput.step = 1;
	tempMaxInput.errorMessage = 'Cette valeur doit etre supérieure à la température minimum';
	tempMaxInput.value = species.water_constraints.temp_max.toString();

	let submitButton: BaseButtonModel = new BaseButtonModel('Ajouter');

	if (species.water_constraints.uuid !== '') {
		submitButton.setStyleOrThrowError('warning');
		submitButton.content = 'Modifier';
	}

	if (species.publication_state !== 'DRAFT' && species.publication_state !== 'MODERATED') {
		submitButton.isDisabled = true;
		phMinInput.readonly = true;
		phMaxInput.readonly = true;
		ghMinInput.readonly = true;
		ghMaxInput.readonly = true;
		tempMinInput.readonly = true;
		tempMaxInput.readonly = true;
	}

	async function submitWaterConstraintsForm() {
		submitButton.setLoading(true);
		species.water_constraints.ph_min = parseInt(phMinInput.value);
		species.water_constraints.ph_max = parseInt(phMaxInput.value);
		species.water_constraints.gh_min = parseInt(ghMinInput.value);
		species.water_constraints.gh_max = parseInt(ghMaxInput.value);
		species.water_constraints.temp_min = parseInt(tempMinInput.value);
		species.water_constraints.temp_max = parseInt(tempMaxInput.value);
		species.water_constraints.species_uuid = species.uuid;

		const speciesUseCase: SpeciesUseCase = new SpeciesUseCase();
		let result: Result;
		if (species.water_constraints.uuid !== '') {
			result = await speciesUseCase.updateWaterConstraints(user.jwt, species);
		} else {
			result = await speciesUseCase.addWaterConstraints(user.jwt, species);
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

				switch (error.type) {
					case 'ph_min':
						phMinInput.error = true;
						phMaxInput.error = true;
						break;
					case 'gh_min':
						ghMinInput.error = true;
						ghMaxInput.error = true;
						break;
					case 'temp_min':
						tempMinInput.error = true;
						tempMaxInput.error = true;
						break;
				}
			}
		}

		submitButton.setLoading(false);

		if (result.success?.code === 201) {
			species.water_constraints.uuid = result.content;
		}
	}
</script>

<form class="min-w-full" on:submit|preventDefault={submitWaterConstraintsForm}>
	<ul class="space-y-6">
		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={phMinLabel} />
				<BaseNumberInput baseNumberInputModel={phMinInput} />
			</div>
		</li>
		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={phMaxLabel} />
				<BaseNumberInput baseNumberInputModel={phMaxInput} />
			</div>
		</li>
		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={ghMinLabel} />
				<BaseNumberInput baseNumberInputModel={ghMinInput} />
			</div>
		</li>
		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={ghMaxLabel} />
				<BaseNumberInput baseNumberInputModel={ghMaxInput} />
			</div>
		</li>

		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={tempMinLabel} />
				<BaseNumberInput baseNumberInputModel={tempMinInput} />
			</div>
		</li>
		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={tempMaxLabel} />
				<BaseNumberInput baseNumberInputModel={tempMaxInput} />
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
