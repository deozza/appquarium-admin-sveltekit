<script lang="ts">
	import { formElements } from './Modeles';

	import BaseLabel from '../../../atoms/input/BaseLabel.svelte';
	import BaseNumberInput from '../../../atoms/input/number/BaseNumberInput.svelte';
	import BaseButton from '../../../atoms/button/BaseButton.svelte';
	import Species from '../../../../app/species/global/entities/Species';
	import User from '../../../../app/user/entities/User';
	import UserUseCase from '../../../../app/user/useCases/UseCase';
	import SpeciesUseCase from '../../../../app/species/global/useCases/UseCase';
	import type Result from '../../../../app/utils/useCasesResult/Result';
	import {
		alimentations,
		animalZones,
		aquariumKinds,
		behaviours
	} from '../../../../store/SpeciesStore';
	import BaseSelectInput from '../../../atoms/input/select/BaseSelectInput.svelte';

	export let species: Species = new Species([]);
	export let user: User = new User('');

	formElements['femalePerMaleInput'].value = species.animal_behaviour.female_per_male;
	formElements['minGroupInput'].value = species.animal_behaviour.min_group;
	formElements['maxGroupInput'].value = species.animal_behaviour.max_group;
	formElements['aquariumKindInput'].value = species.animal_behaviour.aquarium_kind;
	formElements['extraspecificBehaviourInput'].value =
		species.animal_behaviour.extraspecific_behaviour;
	formElements['intraspecificBehaviourInput'].value =
		species.animal_behaviour.intraspecific_behaviour;

	if (species.animal_behaviour.uuid !== '') {
		formElements['submitButton'].setStyleOrThrowError('warning');
		formElements['submitButton'].content = 'Modifier';
	}

	if (species.publication_state !== 'DRAFT' && species.publication_state !== 'MODERATED') {
		formElements['submitButton'].isDisabled = true;
		formElements['minGroupInput'].readonly = true;
		formElements['maxGroupInput'].readonly = true;
	}

	async function submitAnimalBehaviourForm() {
		formElements['submitButton'].setLoading(true);

		species.animal_behaviour.female_per_male = formElements['femalePerMaleInput'].value;
		species.animal_behaviour.min_group = formElements['minGroupInput'].value;
		species.animal_behaviour.max_group = formElements['maxGroupInput'].value;
		species.animal_behaviour.aquarium_kind = formElements['aquariumKindInput'].value;
		species.animal_behaviour.extraspecific_behaviour =
			formElements['extraspecificBehaviourInput'].value;
		species.animal_behaviour.intraspecific_behaviour =
			formElements['intraspecificBehaviourInput'].value;

		species.animal_behaviour.species_uuid = species.uuid;

		const speciesUseCase: SpeciesUseCase = new SpeciesUseCase();
		let result: Result;
		if (species.animal_behaviour.uuid !== '') {
			result = await speciesUseCase.updateAnimalBehaviour(user.jwt, species);
		} else {
			result = await speciesUseCase.addAnimalBehaviour(user.jwt, species);
		}

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
			console.log(result.errors);
		}

		formElements['submitButton'].setLoading(false);

		if (result.success?.code === 201) {
			species.animal_behaviour.uuid = result.content;
		}
	}
</script>

<form class="min-w-full" on:submit|preventDefault={submitAnimalBehaviourForm}>
	<ul class="space-y-6">
		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={formElements['aquariumKindLabel']} />
				<BaseSelectInput
					baseSelectInputModel={formElements['aquariumKindInput']}
					options={$aquariumKinds}
				/>
			</div>
		</li>
		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={formElements['minGroupLabel']} />
				<BaseNumberInput baseNumberInputModel={formElements['minGroupInput']} />
			</div>
		</li>
		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={formElements['maxGroupLabel']} />
				<BaseNumberInput baseNumberInputModel={formElements['maxGroupInput']} />
			</div>
		</li>

		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={formElements['femalePerMaleLabel']} />
				<BaseNumberInput baseNumberInputModel={formElements['femalePerMaleInput']} />
			</div>
		</li>
		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={formElements['intraspecificBehaviourLabel']} />
				<BaseSelectInput
					baseSelectInputModel={formElements['intraspecificBehaviourInput']}
					options={$behaviours}
				/>
			</div>
		</li>

		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={formElements['extraspecificBehaviourLabel']} />
				<BaseSelectInput
					baseSelectInputModel={formElements['extraspecificBehaviourInput']}
					options={$behaviours}
				/>
			</div>
		</li>
		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={formElements['diurnalLabel']} />
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
				<BaseLabel baseLabelModel={formElements['animalZoneLabel']} />
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
							{zone.name}
						</label>
					{/each}
				</div>
			</div>
		</li>
		<li class="flex-c">
			<div class="flex-r ">
				<BaseLabel baseLabelModel={formElements['alimentationLabel']} />
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
							{alimentation.name}
						</label>
					{/each}
				</div>
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
