<script lang="ts">
    import {formElements} from "./Modeles";

    import BaseButton from "../../../atoms/button/BaseButton.svelte";
    import BaseLabel from "../../../atoms/input/BaseLabel.svelte";
    import BaseTextInput from "../../../atoms/input/text/BaseTextInput.svelte";
    import SpeciesGenre from "../../../../app/species/global/entities/SpeciesGenre";
    import SpeciesFamily from "../../../../app/species/global/entities/SpeciesFamily";
    import Species from "../../../../app/species/global/entities/Species";
    import SpeciesUseCase from "../../../../app/species/global/useCases/UseCase";

    import {goto} from '$app/navigation';
    import Result from "../../../../app/utils/useCasesResult/Result";
    import User from "../../../../app/user/entities/User";
    import UserUseCase from "../../../../app/user/useCases/UseCase";

    export let species: Species = new Species([])
    export let speciesGenres: Array<SpeciesGenre> = []
    export let speciesFamilies: Array<SpeciesFamily> = []
    export let user: User = new User('')

    let commonNames: Array<string> = species.species_naming.common_names
    let oldNames: Array<string> = species.species_naming.old_names

    formElements.speciesNameInput.value = species.species_naming.name
    formElements.speciesGenreInput.value = species.species_naming.species_genre.name
    formElements.speciesFamilyInput.value = species.species_naming.species_family.name

    if(species.species_naming.uuid !== ''){
        formElements.submitButton.setStyleOrThrowError('warning')
        formElements.submitButton.content = 'Modifier'
    }

    function linkUuidWithSpeciesGenre(speciesGenreName: string) {
        const speciesGenre = speciesGenres.find((genre: SpeciesGenre) => genre.name === speciesGenreName)

        if (speciesGenre !== undefined) {
            species.species_naming.species_genre = speciesGenre
            return
        }
    }

    function linkUuidWithSpeciesFamily(speciesFamilyName: string) {
        const speciesFamily = speciesFamilies.find((genre: SpeciesFamily) => genre.name === speciesFamilyName)

        if (speciesFamily !== undefined) {
            species.species_naming.species_family = speciesFamily
            return
        }
    }

    function newCommonName(){
        if(formElements.speciesCommonNamesInput.value === ''){
            return
        }

        commonNames = [...commonNames, formElements.speciesCommonNamesInput.value]
        species.species_naming.common_names = commonNames
        formElements.speciesCommonNamesInput.value = ''
    }

    function newOldName(){
        if(formElements.speciesOldNamesInput.value === ''){
            return
        }

        oldNames = [...oldNames, formElements.speciesOldNamesInput.value]
        species.species_naming.old_names = oldNames
        formElements.speciesOldNamesInput.value = ''
    }

    async function submitNamingForm(){

        formElements.submitButton.setLoading(true)

        species.species_naming.name = formElements.speciesNameInput.value

        const speciesUseCase: SpeciesUseCase = new SpeciesUseCase()
        let result: Result
        if (species.uuid !== '') {
            result = await speciesUseCase.updateSpeciesNaming(user.jwt, species)
        } else {
            result = await speciesUseCase.createSpecies(user.jwt, species)
        }

        if (result.isFailed()) {
            formElements.submitButton.setLoading(false)

            for(const error of result.errors){

                if (error.code === 401) {
                    const userUseCase: UserUseCase = new UserUseCase()
                    userUseCase.logout()
                    return {
                        redirect: "/login",
                        status: 302
                    }
                }
            }

        }

        formElements.submitButton.setLoading(false)

        if (result.success?.code === 201) {
            species.uuid = result.content
            return goto(species.computeLinkToSpecies())
        }

    }
</script>


<form class="min-w-full"  on:submit|preventDefault={submitNamingForm}>
    <ul class="space-y-6">
        <li class="flex-c">
            <div class="flex-r">
                <BaseLabel baseLabelModel="{formElements.speciesGenreLabel}" />
                <BaseTextInput baseTextInputModel="{formElements.speciesGenreInput}" on:change={linkUuidWithSpeciesGenre(formElements.speciesGenreInput.value)} />
                <datalist id={formElements.speciesGenreInput.datalist}>
                    {#each speciesGenres as genre, index}
                        <option value={genre.name}>
                            { genre.name }
                        </option>
                    {/each}
                </datalist>
            </div>
        </li>

        <li class="flex-c">
            <div class="flex-r">
                <BaseLabel baseLabelModel="{formElements.speciesFamilyLabel}" />
                <BaseTextInput baseTextInputModel="{formElements.speciesFamilyInput}" on:change={linkUuidWithSpeciesFamily(formElements.speciesFamilyInput.value)}  />
                <datalist id={formElements.speciesFamilyInput.datalist}>
                    {#each speciesFamilies as family, index}
                        <option value={family.name}>
                            { family.name }
                        </option>
                    {/each}
                </datalist>
            </div>
        </li>

        <li class="flex-c">
            <div class="flex-r">
                <BaseLabel baseLabelModel="{formElements.speciesNameLabel}" />
                <BaseTextInput baseTextInputModel="{formElements.speciesNameInput}" />
            </div>
        </li>

        <li class="flex-c">
            <div class="flex-r">
                <BaseLabel baseLabelModel="{formElements.speciesCommonNamesLabel}" />
                <div class="flex-c">
                    <ul>
                        {#each species.species_naming.common_names as name, index}
                            <li class="flex-c">
                                <div class="flex-r">
                                    <input class="w-full py-2 px-3 border rounded-md border-black px-2" type="text" value={name}>
                                </div>
                            </li>
                        {/each}
                    </ul>
                    <BaseTextInput baseTextInputModel="{formElements.speciesCommonNamesInput}" on:focusout={newCommonName} />

                </div>
            </div>
        </li>

        <li class="flex-c">
            <div class="flex-r">
                <BaseLabel baseLabelModel="{formElements.speciesOldNamesLabel}" />
                <div class="flex-c">
                    <ul>
                        {#each species.species_naming.old_names as name, index}
                            <li class="flex-c">
                                <div class="flex-r">
                                    <input class="w-full py-2 px-3 border rounded-md border-black px-2" type="text" value={name}>
                                </div>
                            </li>
                        {/each}
                    </ul>
                    <BaseTextInput baseTextInputModel="{formElements.speciesOldNamesInput}" on:focusout={newOldName} />

                </div>
            </div>
        </li>

        <li class="flex-c space-y-2">
            <BaseButton baseButtonModel="{formElements.submitButton}" />
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