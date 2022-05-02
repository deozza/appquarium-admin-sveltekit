<script lang="ts">
	import BaseButton from '../../../atoms/button/BaseButton.svelte';
	import BaseLabel from '../../../atoms/input/BaseLabel.svelte';
	import BaseTextInput from '../../../atoms/input/text/BaseTextInput.svelte';
	import type SpeciesGenre from '../../../../app/species/global/entities/SpeciesGenre';
	import type SpeciesFamily from '../../../../app/species/global/entities/SpeciesFamily';
	import Species from '../../../../app/species/global/entities/Species';
	import SpeciesUseCase from '../../../../app/species/global/useCases/UseCase';

	import { goto } from '$app/navigation';
	import type Result from '../../../../app/utils/useCasesResult/Result';
	import User from '../../../../app/user/entities/User';
	import UserUseCase from '../../../../app/user/useCases/UseCase';
	import BaseLabelModel from '../../../atoms/input/BaseLabelModel';
	import BaseTextInputModel from '../../../atoms/input/text/BaseTextInputModel';
	import BaseButtonModel from '../../../atoms/button/BaseButtonModel';

	export let species: Species = new Species([]);
	export let speciesGenres: Array<SpeciesGenre> = [];
	export let speciesFamilies: Array<SpeciesFamily> = [];
	export let user: User = new User('');

	const speciesNameLabel: BaseLabelModel = new BaseLabelModel("Nom de l'espèce", 'speciesName');
	const speciesNameInput: BaseTextInputModel = new BaseTextInputModel('speciesName');
	speciesNameInput.required = true;
	speciesNameInput.value = species.naming.name;

	const speciesGenreLabel: BaseLabelModel = new BaseLabelModel('Genre', 'speciesGenre');
	const speciesGenreInput: BaseTextInputModel = new BaseTextInputModel('speciesGenre');
	speciesGenreInput.datalist = 'speciesGenre-list';
	speciesGenreInput.required = true;
	speciesGenreInput.value = species.naming.species_genre.name;

	const speciesFamilyLabel: BaseLabelModel = new BaseLabelModel('Famille', 'speciesFamily');
	const speciesFamilyInput: BaseTextInputModel = new BaseTextInputModel('speciesFamily');
	speciesFamilyInput.datalist = 'speciesFamily-list';
	speciesFamilyInput.required = true;
	speciesFamilyInput.value = species.naming.species_family.name;

	const speciesCommonNamesLabel: BaseLabelModel = new BaseLabelModel(
		'Noms communs',
		'speciesCommonNames'
	);
	const speciesCommonNamesInput: BaseTextInputModel = new BaseTextInputModel('speciesCommonNames');

	const speciesOldNamesLabel: BaseLabelModel = new BaseLabelModel('Anciens noms', 'speciesOldNames');
	const speciesOldNamesInput: BaseTextInputModel = new BaseTextInputModel('speciesOldNames');

	let submitButton: BaseButtonModel = new BaseButtonModel('Ajouter');

	let commonNames: Array<string> = species.naming.common_names;
	let oldNames: Array<string> = species.naming.old_names;

	if (species.naming.uuid !== '') {
		submitButton.setStyleOrThrowError('warning');
		submitButton.content = 'Modifier';
	}

	if (species.publication_state !== 'DRAFT' && species.publication_state !== 'MODERATED') {
		submitButton.isDisabled = true;
		speciesGenreInput.readonly = true;
		speciesFamilyInput.readonly = true;
		speciesNameInput.readonly = true;
		speciesCommonNamesInput.readonly = true;
		speciesOldNamesInput.readonly = true;
	}

	function linkUuidWithSpeciesGenre(speciesGenreName: string) {
		const speciesGenre = speciesGenres.find(
			(genre: SpeciesGenre) => genre.name === speciesGenreName
		);

		if (speciesGenre !== undefined) {
			species.naming.species_genre = speciesGenre;
			return;
		}
		species.naming.species_genre.name = speciesGenreName;
	}

	function linkUuidWithSpeciesFamily(speciesFamilyName: string) {
		const speciesFamily = speciesFamilies.find(
			(genre: SpeciesFamily) => genre.name === speciesFamilyName
		);

		if (speciesFamily !== undefined) {
			species.naming.species_family = speciesFamily;
			return;
		}

		species.naming.species_family.name = speciesFamilyName;
	}

	function newCommonName() {
		if (speciesCommonNamesInput.value === '') {
			return;
		}

		commonNames = [...commonNames, speciesCommonNamesInput.value];
		species.naming.common_names = commonNames;
		speciesCommonNamesInput.value = '';
	}

	function newOldName() {
		if (speciesOldNamesInput.value === '') {
			return;
		}

		oldNames = [...oldNames, speciesOldNamesInput.value];
		species.naming.old_names = oldNames;
		speciesOldNamesInput.value = '';
	}

	async function submitNamingForm() {
		submitButton.setLoading(true);

		species.naming.name = speciesNameInput.value;

		const speciesUseCase: SpeciesUseCase = new SpeciesUseCase();
		let result: Result;
		if (species.uuid !== '') {
			result = await speciesUseCase.updateSpeciesNaming(user.jwt, species);
		} else {
			result = await speciesUseCase.createSpecies(user.jwt, species);
		}

		if (result.isFailed()) {
			submitButton.setLoading(false);

			console.log(result.errors);

			for (const error of result.errors) {
				if (error.code === 401) {
					const userUseCase: UserUseCase = new UserUseCase();
					userUseCase.logout();
					return goto('/');
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

<form class="min-w-full" on:submit|preventDefault={submitNamingForm}>
	<ul class="space-y-6">
		<li class="flex-c">
			<div class="flex-r">
				<BaseLabel baseLabelModel={speciesGenreLabel} />
				<BaseTextInput
					baseTextInputModel={speciesGenreInput}
					on:change={() => linkUuidWithSpeciesGenre(speciesGenreInput.value)}
				/>
				<datalist id={speciesGenreInput.datalist}>
					{#each speciesGenres as genre}
						<option value={genre.name}>
							{genre.name}
						</option>
					{/each}
				</datalist>
			</div>
		</li>

		<li class="flex-c">
			<div class="flex-r">
				<BaseLabel baseLabelModel={speciesFamilyLabel} />
				<BaseTextInput
					baseTextInputModel={speciesFamilyInput}
					on:change={() => linkUuidWithSpeciesFamily(speciesFamilyInput.value)}
				/>
				<datalist id={speciesFamilyInput.datalist}>
					{#each speciesFamilies as family}
						<option value={family.name}>
							{family.name}
						</option>
					{/each}
				</datalist>
			</div>
		</li>

		<li class="flex-c">
			<div class="flex-r">
				<BaseLabel baseLabelModel={speciesNameLabel} />
				<BaseTextInput baseTextInputModel={speciesNameInput} />
			</div>
		</li>

		<li class="flex-c">
			<div class="flex-r">
				<BaseLabel baseLabelModel={speciesCommonNamesLabel} />
				<div class="flex-c">
					<ul>
						{#each species.naming.common_names as name}
							<li class="flex-c">
								<div class="flex-r">
									<input
										class="w-full py-2 px-3 border rounded-md border-black px-2"
										type="text"
										value={name}
									/>
								</div>
							</li>
						{/each}
					</ul>
					<BaseTextInput
						baseTextInputModel={speciesCommonNamesInput}
						on:focusout={newCommonName}
					/>
				</div>
			</div>
		</li>

		<li class="flex-c">
			<div class="flex-r">
				<BaseLabel baseLabelModel={speciesOldNamesLabel} />
				<div class="flex-c">
					<ul>
						{#each species.naming.old_names as name}
							<li class="flex-c">
								<div class="flex-r">
									<input
										class="w-full py-2 px-3 border rounded-md border-black px-2"
										type="text"
										value={name}
									/>
								</div>
							</li>
						{/each}
					</ul>
					<BaseTextInput
						baseTextInputModel={speciesOldNamesInput}
						on:focusout={newOldName}
					/>
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
