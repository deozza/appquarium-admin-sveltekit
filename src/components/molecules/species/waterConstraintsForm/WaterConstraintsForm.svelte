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

    export let species: Species = new Species([])
    export let user: User = new User('')

    formElements['phMinInput'].value = species.water_constraints.ph_min.toString()
    formElements['phMaxInput'].value = species.water_constraints.ph_max.toString()
    formElements['ghMinInput'].value = species.water_constraints.gh_min.toString()
    formElements['ghMaxInput'].value = species.water_constraints.gh_max.toString()
    formElements['tempMinInput'].value = species.water_constraints.temp_min.toString()
    formElements['tempMaxInput'].value = species.water_constraints.temp_max.toString()

    if (species.water_constraints.uuid !== '') {
        formElements['submitButton'].setStyleOrThrowError('warning')
        formElements['submitButton'].content = 'Modifier'
    }

    if (species.publication_state !== 'DRAFT' && species.publication_state !== 'MODERATED') {
        formElements['submitButton'].isDisabled = true
        formElements['phMinInput'].readonly = true
        formElements['phMaxInput'].readonly = true
        formElements['ghMinInput'].readonly = true
        formElements['ghMaxInput'].readonly = true
        formElements['tempMinInput'].readonly = true
        formElements['tempMaxInput'].readonly = true
    }

    async function submitWaterConstraintsForm() {

        formElements['submitButton'].setLoading(true)
        species.water_constraints.ph_min = parseInt(formElements['phMinInput'].value)
        species.water_constraints.ph_max = parseInt(formElements['phMaxInput'].value)
        species.water_constraints.gh_min = parseInt(formElements['ghMinInput'].value)
        species.water_constraints.gh_max = parseInt(formElements['ghMaxInput'].value)
        species.water_constraints.temp_min = parseInt(formElements['tempMinInput'].value)
        species.water_constraints.temp_max = parseInt(formElements['tempMaxInput'].value)
        species.water_constraints.species_uuid = species.uuid

        const speciesUseCase: SpeciesUseCase = new SpeciesUseCase()
        let result: Result
        if (species.water_constraints.uuid !== '') {
            result = await speciesUseCase.updateWaterConstraints(user.jwt, species)
        } else {
            result = await speciesUseCase.addWaterConstraints(user.jwt, species)
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

                switch (error.type) {
                    case 'ph_min':
                        formElements['phMinInput'].error = true;
                        formElements['phMaxInput'].error = true;
                        break
                    case 'gh_min':
                        formElements['ghMinInput'].error = true;
                        formElements['ghMaxInput'].error = true;
                        break;
                    case 'temp_min':
                        formElements['tempMinInput'].error = true;
                        formElements['tempMaxInput'].error = true;
                        break;
                }
            }

        }

        formElements['submitButton'].setLoading(false)

        if (result.success?.code === 201) {
            species.water_constraints.uuid = result.content
        }
    }
</script>

<form class="min-w-full" on:submit|preventDefault={submitWaterConstraintsForm}>
    <ul class="space-y-6">
        <li class="flex-c">
            <div class="flex-r ">
                <BaseLabel baseLabelModel={formElements['phMinLabel']}/>
                <BaseNumberInput baseNumberInputModel={formElements['phMinInput']}/>
            </div>
        </li>
        <li class="flex-c">
            <div class="flex-r ">
                <BaseLabel baseLabelModel={formElements['phMaxLabel']}/>
                <BaseNumberInput baseNumberInputModel={formElements['phMaxInput']}/>
            </div>
        </li>
        <li class="flex-c">
            <div class="flex-r ">
                <BaseLabel baseLabelModel={formElements['ghMinLabel']}/>
                <BaseNumberInput baseNumberInputModel={formElements['ghMinInput']}/>
            </div>
        </li>
        <li class="flex-c">
            <div class="flex-r ">
                <BaseLabel baseLabelModel={formElements['ghMaxLabel']}/>
                <BaseNumberInput baseNumberInputModel={formElements['ghMaxInput']}/>
            </div>
        </li>

        <li class="flex-c">
            <div class="flex-r ">
                <BaseLabel baseLabelModel={formElements['tempMinLabel']}/>
                <BaseNumberInput baseNumberInputModel={formElements['tempMinInput']}/>
            </div>
        </li>
        <li class="flex-c">
            <div class="flex-r ">
                <BaseLabel baseLabelModel={formElements['tempMaxLabel']}/>
                <BaseNumberInput baseNumberInputModel={formElements['tempMaxInput']}/>
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