<script lang="ts">
	import BaseLabel from '../../../atoms/input/BaseLabel.svelte';
	import BaseNumberInput from '../../../atoms/input/number/BaseNumberInput.svelte';
	import BaseButton from '../../../atoms/button/BaseButton.svelte';
	import BaseSelectInput from '../../../atoms/input/select/BaseSelectInput.svelte';

	import Species from '../../../../app/species/global/entities/Species';
	import User from '../../../../app/user/entities/User';
	import UserUseCase from '../../../../app/user/useCases/UseCase';
	import SpeciesUseCase from '../../../../app/species/global/useCases/UseCase';
	import type Result from '../../../../app/utils/useCasesResult/Result';
	import Translation from '../../../../app/utils/i18n/Translation';

	import {
		alimentations,
		animalZones,
		aquariumKinds,
		behaviours
	} from '../../../../store/SpeciesStore';
	import BaseLabelModel from '../../../atoms/input/BaseLabelModel';
	import BaseSelectInputModel from '../../../atoms/input/select/BaseSelectInputModel';
	import BaseNumberInputModel from '../../../atoms/input/number/BaseNumberInputModel';
	import BaseButtonModel from '../../../atoms/button/BaseButtonModel';

	export let species: Species = new Species([]);
	export let user: User = new User('');

	const alimentationLabel: BaseLabelModel = new BaseLabelModel('Alimentation', 'alimentation');

	const animalZoneLabel: BaseLabelModel = new BaseLabelModel('Dans la zone', 'zoneLabel');

	const aquariumKindLabel: BaseLabelModel = new BaseLabelModel("Type d'aquarium", 'aquariumKind');
	const aquariumKindInput: BaseSelectInputModel = new BaseSelectInputModel('aquariumKind');
	aquariumKindInput.required = true;
	aquariumKindInput.value = species.animal_behaviour.aquarium_kind;

	const intraspecificBehaviourLabel: BaseLabelModel = new BaseLabelModel(
		'Comportement intraspécifique',
		'intraspecificBehaviour'
	);
	const intraspecificBehaviourInput: BaseSelectInputModel = new BaseSelectInputModel(
		'intraspecificBehaviour'
	);
	intraspecificBehaviourInput.required = true;
	intraspecificBehaviourInput.value = species.animal_behaviour.intraspecific_behaviour;

	const extraspecificBehaviourLabel: BaseLabelModel = new BaseLabelModel(
		'Comportement extraspécifique',
		'extraspecificBehaviour'
	);
	const extraspecificBehaviourInput: BaseSelectInputModel = new BaseSelectInputModel(
		'extraspecificBehaviour'
	);
	extraspecificBehaviourInput.required = true;
	extraspecificBehaviourInput.value = species.animal_behaviour.extraspecific_behaviour;

	const femalePerMaleLabel: BaseLabelModel = new BaseLabelModel(
		'Nombre de femelles par male',
		'femalePerMale'
	);
	const femalePerMaleInput: BaseNumberInputModel = new BaseNumberInputModel('femalePerMale');
	femalePerMaleInput.value = species.animal_behaviour.female_per_male !== null ? species.animal_behaviour.female_per_male.toString() : null;

	const minGroupLabel: BaseLabelModel = new BaseLabelModel('Groupe minimum', 'minGroup');
	const minGroupInput: BaseNumberInputModel = new BaseNumberInputModel('minGroup');
	minGroupInput.required = true;
	minGroupInput.min = 0;
	minGroupInput.value = species.animal_behaviour.min_group.toString();

	const maxGroupLabel: BaseLabelModel = new BaseLabelModel('Groupe maximum', 'maxGroup');
	const maxGroupInput: BaseNumberInputModel = new BaseNumberInputModel('maxGroup');
	maxGroupInput.value = species.animal_behaviour.max_group !== null ? species.animal_behaviour.max_group.toString() : null;

	const diurnalLabel: BaseLabelModel = new BaseLabelModel('Est actif', 'diurnal');

	let submitButton: BaseButtonModel = new BaseButtonModel('Ajouter');
	
	if (species.animal_behaviour.uuid !== '') {
		submitButton.setStyleOrThrowError('warning');
		submitButton.content = 'Modifier';
	}

	if (species.publication_state !== 'DRAFT' && species.publication_state !== 'MODERATED') {
		submitButton.isDisabled = true;
		minGroupInput.readonly = true;
		maxGroupInput.readonly = true;
	}

	async function submitAnimalBehaviourForm() {
		submitButton.setLoading(true);

		species.animal_behaviour.female_per_male = parseInt(femalePerMaleInput.value);
		species.animal_behaviour.min_group = parseInt(minGroupInput.value);
		species.animal_behaviour.max_group = parseInt(maxGroupInput.value);
		species.animal_behaviour.aquarium_kind = aquariumKindInput.value;
		species.animal_behaviour.extraspecific_behaviour =
			extraspecificBehaviourInput.value;
		species.animal_behaviour.intraspecific_behaviour =
			intraspecificBehaviourInput.value;

		species.animal_behaviour.species_uuid = species.uuid;

		const speciesUseCase: SpeciesUseCase = new SpeciesUseCase();
		let result: Result;
		if (species.animal_behaviour.uuid !== '') {
			result = await speciesUseCase.updateAnimalBehaviour(user.jwt, species);
		} else {
			result = await speciesUseCase.addAnimalBehaviour(user.jwt, species);
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
			species.animal_behaviour.uuid = result.content;
		}
	}
</script>

<form class="min-w-full" on:submit|preventDefault={submitAnimalBehaviourForm}>
	<ul class="space-y-6">
		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={aquariumKindLabel} />
				<BaseSelectInput
					baseSelectInputModel={aquariumKindInput}
					options={$aquariumKinds}
				/>
			</div>
		</li>
		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={minGroupLabel} />
				<BaseNumberInput baseNumberInputModel={minGroupInput} />
			</div>
		</li>
		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={maxGroupLabel} />
				<BaseNumberInput baseNumberInputModel={maxGroupInput} />
			</div>
		</li>

		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={femalePerMaleLabel} />
				<BaseNumberInput baseNumberInputModel={femalePerMaleInput} />
			</div>
		</li>
		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={intraspecificBehaviourLabel} />
				<BaseSelectInput
					baseSelectInputModel={intraspecificBehaviourInput}
					options={$behaviours}
				/>
			</div>
		</li>

		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={extraspecificBehaviourLabel} />
				<BaseSelectInput
					baseSelectInputModel={extraspecificBehaviourInput}
					options={$behaviours}
				/>
			</div>
		</li>
		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={diurnalLabel} />
				<div class="flex-r" style="flex: 2">
					<label class="w-1/2 px-3 " for="diurnalTrue">
						<input
							class=""
							type="radio"
							bind:group={species.animal_behaviour.diurnal}
							value={true}
							id="diurnalTrue"
							name="diurnalTrue"
						/>
						Le jour
					</label>
					<label class="w-1/2 px-3 " for="diurnalFalse">
						<input
							class=""
							type="radio"
							bind:group={species.animal_behaviour.diurnal}
							value={false}
							id="diurnalFalse"
							name="diurnalFalse"
						/>
						La nuit
					</label>
				</div>
			</div>
		</li>
		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={animalZoneLabel} />
				<div class="flex-r" style="flex: 2">
					{#each $animalZones as zone}
						<label class="px-1" for={zone.name}>
							<input
								class=""
								type="checkbox"
								bind:group={species.animal_behaviour.zone}
								value={zone.name}
								id={zone.name}
								name={zone.name}
							/>
							{Translation.translate(["animal_zones", zone.name])}
						</label>
					{/each}
				</div>
			</div>
		</li>
		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={alimentationLabel} />
				<div class="flex-r" style="flex: 2">
					{#each $alimentations as alimentation}
						<label class="px-1" for={alimentation.name}>
							<input
								class=""
								type="checkbox"
								bind:group={species.animal_behaviour.alimentation}
								value={alimentation.name}
								id={alimentation.name}
								name={alimentation.name}
							/>
							{Translation.translate(["alimentations", alimentation.name])}
						</label>
					{/each}
				</div>
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
