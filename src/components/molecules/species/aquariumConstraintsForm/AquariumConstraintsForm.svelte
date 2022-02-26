<script lang="ts">
    import {formElements} from "./Modeles";

    import BaseLabel from "../../../atoms/input/BaseLabel.svelte";
    import BaseNumberInput from "../../../atoms/input/number/BaseNumberInput.svelte";
    import BaseButton from "../../../atoms/button/BaseButton.svelte";
    import Species from "../../../../app/species/global/entities/Species";
    import User from "../../../../app/user/entities/User";
    import SpeciesUseCase from "../../../../app/species/global/useCases/UseCase";
    import type Result from "../../../../app/utils/useCasesResult/Result";
    import UserUseCase from "../../../../app/user/useCases/UseCase";
    import BaseSelectInput from '../../../atoms/input/select/BaseSelectInput.svelte';
    import {soilKinds, decors} from '../../../../store/SpeciesStore';

    export let species: Species = new Species([])
    export let user: User = new User('')

    formElements['minVolumeInput'].value = species.aquarium_constraints.min_volume
    formElements['maxVolumeInput'].value = species.aquarium_constraints.max_volume
    formElements['minLengthInput'].value = species.aquarium_constraints.min_length
    formElements['maxHeightInput'].value = species.aquarium_constraints.max_height
    formElements['soilKindInput'].value = species.aquarium_constraints.soil_kind

    if (species.aquarium_constraints.uuid !== '') {
        formElements['submitButton'].setStyleOrThrowError('warning')
        formElements['submitButton'].content = 'Modifier'
    }

    if (species.publication_state !== 'DRAFT' && species.publication_state !== 'MODERATED') {
        formElements['submitButton'].isDisabled = true
        formElements['minVolumeInput'].readonly = true
        formElements['maxVolumeInput'].readonly = true
        formElements['minLengthInput'].readonly = true
        formElements['maxHeightInput'].readonly = true
        formElements['soilKindInput'].readonly = true
    }

    async function submitAquariumConstraintsForm() {

        formElements['submitButton'].setLoading(true)

        species.aquarium_constraints.min_volume = formElements['minVolumeInput'].value
        species.aquarium_constraints.max_volume = formElements['maxVolumeInput'].value
        species.aquarium_constraints.min_length = formElements['minLengthInput'].value
        species.aquarium_constraints.max_height = formElements['maxHeightInput'].value
        species.aquarium_constraints.soil_kind = formElements['soilKindInput'].value
        species.aquarium_constraints.species_uuid = species.uuid

        const speciesUseCase: SpeciesUseCase = new SpeciesUseCase()
        let result: Result
        if (species.aquarium_constraints.uuid !== '') {
            result = await speciesUseCase.updateAquariumConstraints(user.jwt, species)
        } else {
            result = await speciesUseCase.addAquariumConstraints(user.jwt, species)
        }

        if (result.isFailed()) {
            formElements['submitButton'].setLoading(false)

            for (const error of result.errors) {
                if (error.code === 401) {
                    const userUseCase: UserUseCase = new UserUseCase()
                    userUseCase.logout()
                    return {
                        redirect: "/login",
                        status: 302
                    }
                }
            }
        console.log(result.errors)
        }

        formElements['submitButton'].setLoading(false)

        if (result.success?.code === 201) {
            species.aquarium_constraints.uuid = result.content
        }

    }
</script>

<form class="min-w-full" on:submit|preventDefault={submitAquariumConstraintsForm}>
    <ul class="space-y-6">
        <li class="flex-c">
            <div class="flex-r ">
                <BaseLabel baseLabelModel={formElements['minVolumeLabel']}/>
                <BaseNumberInput baseNumberInputModel={formElements['minVolumeInput']}/>
            </div>
        </li>
        <li class="flex-c">
            <div class="flex-r ">
                <BaseLabel baseLabelModel={formElements['maxVolumeLabel']}/>
                <BaseNumberInput baseNumberInputModel={formElements['maxVolumeInput']}/>
            </div>
        </li>
        <li class="flex-c">
            <div class="flex-r ">
                <BaseLabel baseLabelModel={formElements['minLengthLabel']}/>
                <BaseNumberInput baseNumberInputModel={formElements['minLengthInput']}/>
            </div>
        </li>
        <li class="flex-c">
            <div class="flex-r ">
                <BaseLabel baseLabelModel={formElements['maxHeightLabel']}/>
                <BaseNumberInput baseNumberInputModel={formElements['maxHeightInput']}/>
            </div>
        </li>

        <li class="flex-c">
            <div class="flex-r ">
                <BaseLabel baseLabelModel={formElements['soilKindLabel']}/>
                <BaseSelectInput baseSelectInputModel={formElements['soilKindInput']} options={$soilKinds} />
            </div>
        </li>

        <li class="flex-c">
            <div class="flex-r ">
                <BaseLabel baseLabelModel={formElements['decorLabel']}/>
                {#each $decors as decor}
                    <label class='px-1' for={decor.name}>
                        <input class="" type="checkbox" bind:group={species.aquarium_constraints.decor} value={decor.name} id={decor.name} name={decor.name}>
                        {decor.name}
                    </label>
                {/each}
            </div>
        </li>

        <li class="flex-c space-y-2">
            <BaseButton baseButtonModel="{formElements['submitButton']}"/>
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