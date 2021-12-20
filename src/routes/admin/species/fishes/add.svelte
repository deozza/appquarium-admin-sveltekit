<script lang="ts" context="module">
    import FishUseCase from "../../../../app/species/fish/useCases/UseCase";
    import UserUseCase from "../../../../app/user/useCases/UseCase";
    import User from "../../../../app/user/entities/User";
    import Result from "../../../../app/utils/useCasesResult/Result";


    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load(){
        const userUseCase: UserUseCase = new UserUseCase()
        const cookie: Result = userUseCase.getToken()

        const user: User = new User(cookie.content)
        const fishUseCase: FishUseCase = new FishUseCase()

        const speciesGenres: Result = await fishUseCase.getFishGenres(cookie.content)
        if (speciesGenres.isFailed()) {
            for (const error of speciesGenres.errors) {
                if (error.code === 401) {
                    userUseCase.logout()
                    return {
                        redirect: "/login",
                        status: 302
                    }
                }
            }
            return {}
        }

        const speciesFamilies: Result = await fishUseCase.getFishFamilies(cookie.content)
        if (speciesFamilies.isFailed()) {
            for (const error of speciesFamilies.errors) {
                if (error.code === 401) {
                    userUseCase.logout()
                    return {
                        redirect: "/login",
                        status: 302
                    }
                }
            }
            return {}
        }

        return {
            props: {
                speciesFamilies: speciesFamilies.content,
                speciesGenres: speciesGenres.content,
                user: user
            }
        }
    }
</script>

<script lang="ts">
    import {header, formElements} from "../../../../components/pages/admin/fishes/add/Modeles";
    import BaseHeader from "../../../../components/atoms/typography/header/BaseHeader.svelte";
    import BaseButton from "../../../../components/atoms/button/BaseButton.svelte";
    import BaseLabel from "../../../../components/atoms/input/BaseLabel.svelte";
    import BaseTextInput from "../../../../components/atoms/input/text/BaseTextInput.svelte";
    import SpeciesGenre from "../../../../app/species/global/entities/SpeciesGenre";
    import SpeciesFamily from "../../../../app/species/global/entities/SpeciesFamily";
    import Species from "../../../../app/species/global/entities/Species";
    import SpeciesUseCase from "../../../../app/species/global/useCases/UseCase";
    import {goto} from '$app/navigation';

    export let speciesGenres: Array<SpeciesGenre> = []
    export let speciesFamilies: Array<SpeciesFamily> = []
    export let user: User = new User('')
    user.extractUserInfoFromJwt()

    const fishUseCase: FishUseCase = new FishUseCase()
    let fish: Species = fishUseCase.initNewFish(user)
    let commonNames: Array<string> = fish.species_naming.common_names
    let oldNames: Array<string> = fish.species_naming.old_names


    function linkUuidWithSpeciesGenre(speciesGenreName: string) {
        const speciesGenre = speciesGenres.find((genre: SpeciesGenre) => genre.name === speciesGenreName)

        if (speciesGenre !== undefined) {
            fish.species_naming.species_genre = speciesGenre
            return
        }
    }

    function linkUuidWithSpeciesFamily(speciesFamilyName: string) {
        const speciesFamily = speciesFamilies.find((genre: SpeciesFamily) => genre.name === speciesFamilyName)

        if (speciesFamily !== undefined) {
            fish.species_naming.species_family = speciesFamily
            return
        }
    }

    function newCommonName(){
        if(formElements.speciesCommonNamesInput.value === ''){
            return
        }

        commonNames = [...commonNames, formElements.speciesCommonNamesInput.value]
        fish.species_naming.common_names = commonNames
        formElements.speciesCommonNamesInput.value = ''

        console.log(fish.species_naming.common_names)

    }

    function newOldName(){
        if(formElements.speciesOldNamesInput.value === ''){
            return
        }

        oldNames = [...oldNames, formElements.speciesOldNamesInput.value]
        fish.species_naming.old_names = oldNames
        formElements.speciesOldNamesInput.value = ''

        console.log(fish.species_naming.old_names)

    }

    async function add(){
        fish.species_naming.name = formElements.speciesNameInput.value

        const speciesUseCase: SpeciesUseCase = new SpeciesUseCase()
        let result: Result
        if (fish.uuid !== '') {
            result = await speciesUseCase.updateSpeciesNaming(user.jwt, fish)
        } else {
            result = await speciesUseCase.createSpecies(user.jwt, fish)
        }
        if (result.isFailed()) {
            console.log(result.errors)
        }
        if (result.success?.code === 201) {
            fish.uuid = result.content
            return goto(fish.computeLinkToSpecies())
        }
    }
</script>

<section class="flex-c pb-12">
    <BaseHeader baseHeaderModel="{header}" />
</section>

<div class="flex-c">
    <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
        <form class="min-w-full"  on:submit|preventDefault={add}>
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
                                {#each fish.species_naming.common_names as name, index}
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
                                {#each fish.species_naming.old_names as name, index}
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
    </section>
</div>

<style>

    li > div {
        padding: 0.5em;
        align-items: normal;
        width: 98%;
    }

</style>