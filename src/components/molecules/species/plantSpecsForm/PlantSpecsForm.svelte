<script lang="ts">
	import BaseLabel from '../../../atoms/input/BaseLabel.svelte';
	import BaseNumberInput from '../../../atoms/input/number/BaseNumberInput.svelte';
	import BaseButton from '../../../atoms/button/BaseButton.svelte';
	import Species from '../../../../app/species/global/entities/Species';
	import User from '../../../../app/user/entities/User';
	import SpeciesUseCase from '../../../../app/species/global/useCases/UseCase';
	import type Result from '../../../../app/utils/useCasesResult/Result';
	import UserUseCase from '../../../../app/user/useCases/UseCase';
	import BaseSelectInput from '../../../atoms/input/select/BaseSelectInput.svelte';
	import { plantZones, growthSpeeds } from '../../../../store/SpeciesStore';
	import BaseButtonModel from '../../../atoms/button/BaseButtonModel';
	import BaseLabelModel from '../../../atoms/input/BaseLabelModel';
	import BaseSelectInputModel from '../../../atoms/input/select/BaseSelectInputModel';
	import BaseNumberInputModel from '../../../atoms/input/number/BaseNumberInputModel';

	export let species: Species = new Species([]);
	export let user: User = new User('');

	const sizeLabel: BaseLabelModel = new BaseLabelModel('Taille maximale (cm)', 'size');
	const sizeInput: BaseNumberInputModel = new BaseNumberInputModel('size');
	sizeInput.required = true;
	sizeInput.min = 0;
	sizeInput.value = species.plant_specs.size.toString();

	const zoneLabel: BaseLabelModel = new BaseLabelModel('Zone de plantation', 'zone');
	const zoneInput: BaseSelectInputModel = new BaseSelectInputModel('zone');
	zoneInput.required = true;
	zoneInput.value = species.plant_specs.zone.toString();

	const growthSpeedLabel: BaseLabelModel = new BaseLabelModel('Croissance', 'growthSpeed');
	const growthSpeedInput: BaseSelectInputModel = new BaseSelectInputModel('growthSpeed');
	growthSpeedInput.required = true;
	growthSpeedInput.value = species.plant_specs.growth_speed;

	const needInFertilizerLabel: BaseLabelModel = new BaseLabelModel(
		"Besoin d'un fertilizant ?",
		'needInFertilizer'
	);

	const needInCarboneLabel: BaseLabelModel = new BaseLabelModel('Besoin de CO2 ?', 'needInCarbone');

	let submitButton: BaseButtonModel = new BaseButtonModel('Ajouter');

	if (species.plant_specs.uuid !== '') {
		submitButton.setStyleOrThrowError('warning');
		submitButton.content = 'Modifier';
	}

	if (species.publication_state !== 'DRAFT' && species.publication_state !== 'MODERATED') {
		submitButton.isDisabled = true;
		sizeInput.readonly = true;
		zoneInput.readonly = true;
		growthSpeedInput.readonly = true;
	}

	async function submitPlantSpecsForm() {
		submitButton.setLoading(true);

		species.plant_specs.size = parseInt(sizeInput.value);
		species.plant_specs.zone = zoneInput.value;
		species.plant_specs.growth_speed = growthSpeedInput.value;
		species.plant_specs.species_uuid = species.uuid;

		const speciesUseCase: SpeciesUseCase = new SpeciesUseCase();
		let result: Result;
		if (species.plant_specs.uuid !== '') {
			result = await speciesUseCase.updatePlantSpecs(user.jwt, species);
		} else {
			result = await speciesUseCase.addPlantSpecs(user.jwt, species);
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
			species.plant_specs.uuid = result.content;
		}
	}
</script>

<form class="min-w-full" on:submit|preventDefault={submitPlantSpecsForm}>
	<ul class="space-y-6">
		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={sizeLabel} />
				<BaseNumberInput baseNumberInputModel={sizeInput} />
			</div>
		</li>
		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={zoneLabel} />
				<BaseSelectInput baseSelectInputModel={zoneInput} options={$plantZones} />
			</div>
		</li>
		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={needInFertilizerLabel} />
				<div class="flex-r" style="flex: 2">
					<label class="w-1/2 py-2 px-3 " for="needInFertilizerTrue">
						<input
							class=""
							type="radio"
							bind:group={species.plant_specs.need_in_fertilizer}
							value={true}
							id="needInFertilizerTrue"
							name="needInFertilizerTrue"
						/>
						Oui
					</label>
					<label class="w-1/2 py-2 px-3 " for="needInFertilizerFalse">
						<input
							class=""
							type="radio"
							bind:group={species.plant_specs.need_in_fertilizer}
							value={false}
							id="needInFertilizerFalse"
							name="needInFertilizerFalse"
						/>
						Non
					</label>
				</div>
			</div>
		</li>
		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={needInCarboneLabel} />
				<div class="flex-r" style="flex: 2">
					<label class="w-1/2 py-2 px-3 " for="needInCarboneTrue">
						<input
							class=""
							type="radio"
							bind:group={species.plant_specs.need_in_carbone}
							value={true}
							id="needInCarboneTrue"
							name="needInCarboneTrue"
						/>
						Oui
					</label>
					<label class="w-1/2 py-2 px-3 " for="needInCarboneFalse">
						<input
							class=""
							type="radio"
							bind:group={species.plant_specs.need_in_carbone}
							value={false}
							id="needInCarboneFalse"
							name="needInCarboneFalse"
						/>
						Non
					</label>
				</div>
			</div>
		</li>
		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={growthSpeedLabel} />
				<BaseSelectInput
					baseSelectInputModel={growthSpeedInput}
					options={$growthSpeeds}
				/>
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
