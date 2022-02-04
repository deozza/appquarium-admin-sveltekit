<script lang="ts">
    import { formElements } from './Modeles';

    import BaseLabel from '../../../atoms/input/BaseLabel.svelte';
    import BaseNumberInput from '../../../atoms/input/number/BaseNumberInput.svelte';
    import BaseButton from '../../../atoms/button/BaseButton.svelte';
    import Species from '../../../../app/species/global/entities/Species';
    import User from '../../../../app/user/entities/User';
    import SpeciesUseCase from '../../../../app/species/global/useCases/UseCase';
    import Result from '../../../../app/utils/useCasesResult/Result';
    import UserUseCase from '../../../../app/user/useCases/UseCase';
    import BaseSelectInput from '../../../atoms/input/select/BaseSelectInput.svelte';
    import {plantZones, growthSpeeds} from '../../../../store/SpeciesStore';
    import plant from '../../../../routes/admin/species/plant/index.svelte';

    export let species: Species = new Species([]);
    export let user: User = new User('');

    formElements.sizeInput.value = species.plant_specs.size;
    formElements.zoneInput.value = species.plant_specs.zone;
    formElements.growthSpeedInput.value = species.plant_specs.growth_speed;


    if (species.plant_specs.uuid !== '') {
        formElements.submitButton.setStyleOrThrowError('warning');
        formElements.submitButton.content = 'Modifier';
    }

    if (species.publication_state !== 'DRAFT' && species.publication_state !== 'MODERATED') {
        formElements.submitButton.isDisabled = true;
        formElements.sizeInput.readonly = true;
        formElements.zoneInput.readonly = true;
        formElements.growthSpeedInput.readonly = true;
    }

    async function submitPlantSpecsForm() {

        formElements.submitButton.setLoading(true);

        species.plant_specs.size = formElements.sizeInput.value;
        species.plant_specs.zone = formElements.zoneInput.value;
        species.plant_specs.growth_speed = formElements.growthSpeedInput.value;
        species.plant_specs.species_uuid = species.uuid;

        const speciesUseCase: SpeciesUseCase = new SpeciesUseCase();
        let result: Result;
        if (species.plant_specs.uuid !== '') {
            result = await speciesUseCase.updatePlantSpecs(user.jwt, species);
        } else {
            result = await speciesUseCase.addPlantSpecs(user.jwt, species);
        }

        if (result.isFailed()) {
            formElements.submitButton.setLoading(false);

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

        formElements.submitButton.setLoading(false);

        if (result.success?.code === 201) {
            species.plant_specs.uuid = result.content;
        }

    }
</script>

<form class="min-w-full" on:submit|preventDefault={submitPlantSpecsForm}>
    <ul class="space-y-6">
        <li class="flex-c">
            <div class="flex-r ">
                <BaseLabel baseLabelModel={formElements.sizeLabel}/>
                <BaseNumberInput baseNumberInputModel={formElements.sizeInput}/>
            </div>
        </li>
        <li class="flex-c">
            <div class="flex-r ">
                <BaseLabel baseLabelModel={formElements.zoneLabel}/>
                <BaseSelectInput baseSelectInputModel={formElements.zoneInput} options={$plantZones}/>
            </div>
        </li>
        <li class="flex-c">
            <div class="flex-r ">
                <BaseLabel baseLabelModel={formElements.needInFertilizerLabel}/>
                <div class='flex-r' style="flex: 2">
                    <label class='w-1/2 py-2 px-3 ' for='needInFertilizerTrue'>
                        <input class="" type="radio" bind:group={species.plant_specs.need_in_fertilizer} value={true} id="needInFertilizerTrue" name="needInFertilizerTrue">
                        Oui
                    </label>
                    <label class='w-1/2 py-2 px-3 ' for='needInFertilizerFalse'>
                        <input class="" type="radio" bind:group={species.plant_specs.need_in_fertilizer} value={false} id="needInFertilizerFalse" name="needInFertilizerFalse">
                        Non
                    </label>
                </div>
            </div>
        </li>
        <li class="flex-c">
            <div class="flex-r ">
                <BaseLabel baseLabelModel={formElements.needInCarboneLabel}/>
                <div class='flex-r' style="flex: 2">
                    <label class='w-1/2 py-2 px-3 ' for='needInCarboneTrue'>
                        <input class="" type="radio" bind:group={species.plant_specs.need_in_carbone} value={true} id="needInCarboneTrue" name="needInCarboneTrue">
                        Oui
                    </label>
                    <label class='w-1/2 py-2 px-3 ' for='needInCarboneFalse'>
                        <input class="" type="radio" bind:group={species.plant_specs.need_in_carbone} value={false} id="needInCarboneFalse" name="needInCarboneFalse">
                        Non
                    </label>
                </div>
            </div>
        </li>
        <li class="flex-c">
            <div class="flex-r ">
                <BaseLabel baseLabelModel={formElements.growthSpeedLabel}/>
                <BaseSelectInput baseSelectInputModel={formElements.growthSpeedInput} options={$growthSpeeds}/>

            </div>
        </li>

        <li class="flex-c space-y-2">
            <BaseButton baseButtonModel="{formElements.submitButton}"/>
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