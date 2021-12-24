<script lang="ts">
    import {formElements} from "./Modeles";

    import BaseLabel from "../../../atoms/input/BaseLabel.svelte";
    import BaseNumberInput from "../../../atoms/input/number/BaseNumberInput.svelte";
    import BaseButton from "../../../atoms/button/BaseButton.svelte";
    import Species from "../../../../app/species/global/entities/Species";
    import User from "../../../../app/user/entities/User";
    import SpeciesUseCase from "../../../../app/species/global/useCases/UseCase";
    import Result from "../../../../app/utils/useCasesResult/Result";
    import {goto} from '$app/navigation';
    import UserUseCase from "../../../../app/user/useCases/UseCase";

    export let species: Species = new Species([])
    export let user: User = new User('')

    formElements.maleSizeInput.value = species.animal_specs.male_size
    formElements.femaleSizeInput.value = species.animal_specs.female_size
    formElements.longevityInput.value = species.animal_specs.longevity_in_years

    if(species.animal_specs.uuid !== ''){
        formElements.submitButton.setStyleOrThrowError('warning')
        formElements.submitButton.content = 'Modifier'
    }

    if(species.publication_state !== 'DRAFT' && species.publication_state !== 'MODERATED'){
        formElements.submitButton.isDisabled = true
        formElements.maleSizeInput.readonly = true
        formElements.femaleSizeInput.readonly = true
        formElements.longevityInput.readonly = true
    }

    async function submitAnimalSpecsForm(){

        formElements.submitButton.setLoading(true)

        species.animal_specs.male_size = formElements.maleSizeInput.value
        species.animal_specs.female_size = formElements.femaleSizeInput.value
        species.animal_specs.longevity_in_years = formElements.longevityInput.value

        const speciesUseCase: SpeciesUseCase = new SpeciesUseCase()
        let result: Result
        if (species.uuid !== '') {
            result = await speciesUseCase.updateAnimalSpecs(user.jwt, species)
        } else {
            result = await speciesUseCase.addAnimalSpecs(user.jwt, species)
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

<form class="min-w-full" on:submit|preventDefault={submitAnimalSpecsForm}>
    <ul class="space-y-6">
        <li class="flex-c">
            <div class="flex-r ">
                <BaseLabel baseLabelModel={formElements.maleSizeLabel}/>
                <BaseNumberInput baseNumberInputModel={formElements.maleSizeInput} />
            </div>
        </li>
        <li class="flex-c">
            <div class="flex-r ">
                <BaseLabel baseLabelModel={formElements.femaleSizeLabel}/>
                <BaseNumberInput baseNumberInputModel={formElements.femaleSizeInput} />
            </div>
        </li>
        <li class="flex-c">
            <div class="flex-r ">
                <BaseLabel baseLabelModel={formElements.longevityLabel}/>
                <BaseNumberInput baseNumberInputModel={formElements.longevityInput} />
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