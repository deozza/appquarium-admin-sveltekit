<script lang="ts">
    import {
        header,
        statusPill,
        generalFormHeader,
        namingFormHeader,
        waterConstraintsFormHeader,
        specsFormHeader,
        imageFormHeader
    } from '../../../../components/pages/admin/[uuid]/Modeles';

    import Species from '../../../../app/species/global/entities/Species';
    import BaseHeader from '../../../../components/atoms/typography/header/BaseHeader.svelte';
    import NamingForm from '../../../../components/molecules/species/namingForm/NamingForm.svelte';
    import SpeciesGenre from '../../../../app/species/global/entities/SpeciesGenre';
    import SpeciesFamily from '../../../../app/species/global/entities/SpeciesFamily';
    import WaterConstraintsForm
        from '../../../../components/molecules/species/waterConstraintsForm/WaterConstraintsForm.svelte';
    import BasePill from '../../../../components/atoms/pill/BasePill.svelte';
    import PublicationStateSwitcher
        from '../../../../components/molecules/species/publicationStateSwitcher/PublicationStateSwitcher.svelte';
    import GeneralForm from '../../../../components/molecules/species/generalForm/GeneralForm.svelte';
    import UserUseCase from '../../../../app/user/useCases/UseCase';
    import Result from '../../../../app/utils/useCasesResult/Result';
    import User from '../../../../app/user/entities/User';
    import SpeciesUseCase from '../../../../app/species/global/useCases/UseCase';
    import PlantUseCase from '../../../../app/species/plant/useCases/UseCase';
    import ImagesForm from '../../../../components/molecules/species/imagesForm/ImagesForm.svelte';

    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import PlantSpecsForm from '../../../../components/molecules/species/plantSpecsForm/PlantSpecsForm.svelte';
    import BaseOptionModel from '../../../../components/atoms/input/select/BaseOptionModel';

    let plant: Species = new Species([]);
    let speciesOrigins: Array<string> = [];
    let speciesGenres: Array<SpeciesGenre> = [];
    let speciesFamilies: Array<SpeciesFamily> = [];
    let growthSpeeds: Array<BaseOptionModel> = [];
    let zones: Array<BaseOptionModel> = [];

    const userUseCase: UserUseCase = new UserUseCase();
    const plantUseCase: PlantUseCase = new PlantUseCase();
    const speciesUseCase: SpeciesUseCase = new SpeciesUseCase();

    const jwt: Result = userUseCase.getToken();
    const user: User = new User(jwt.content);

    let loadingPlant: boolean = true;

    onMount(async () => {
        plant = await loadPlant();

        header.setContent(plant.computeName());
        statusPill.setStyleOrThrowError(plant.getPublicationStateStyle());
        statusPill.content = plant.getPublicationStateContent();

        speciesGenres = await loadPlantGenres();
        speciesFamilies = await loadPlantFamilies();
        speciesOrigins = await loadOrigins();
        growthSpeeds = await loadListOfGrowthSpeeds();
        zones = await loadListOfZones();

        loadingPlant = false;
    });

    async function loadPlant(): Promise<Species> {
        const plantResult: Result = await speciesUseCase.getSpecies(jwt.content, $page.params.uuid);

        if (plantResult.isFailed()) {
            for (const error of plantResult.errors) {
                if (error.code === 401) {
                    userUseCase.logout();
                    return goto('/');
                }
            }
            return plantResult.content;
        }

        return plantResult.content;
    }

    async function loadPlantGenres(): Promise<Array<SpeciesGenre>> {
        const speciesGenresResult: Result = await plantUseCase.getPlantGenres(jwt.content);
        if (speciesGenresResult.isFailed()) {
            for (const error of speciesGenresResult.errors) {
                if (error.code === 401) {
                    userUseCase.logout();
                    return goto('/');

                }
            }
            return speciesGenresResult.content;
        }

        return speciesGenresResult.content;
    }

    async function loadPlantFamilies(): Promise<Array<SpeciesGenre>> {
        const speciesFamiliesResult: Result = await plantUseCase.getPlantFamilies(jwt.content);
        if (speciesFamiliesResult.isFailed()) {
            for (const error of speciesFamiliesResult.errors) {
                if (error.code === 401) {
                    userUseCase.logout();
                    return goto('/');

                }
            }
            return speciesFamiliesResult.content;
        }
        return speciesFamiliesResult.content;
    }

    async function loadOrigins(): Promise<Array<string>> {
        const speciesOriginsResult: Result = await speciesUseCase.getSpeciesOrigins(jwt.content);
        if (speciesOriginsResult.isFailed()) {
            for (const error of speciesOriginsResult.errors) {
                if (error.code === 401) {
                    userUseCase.logout();
                    return goto('/');

                }
            }
            return speciesOriginsResult.content;
        }

        return speciesOriginsResult.content;
    }

    async function loadListOfGrowthSpeeds(): Promise<Array<BaseOptionModel>> {

        const listOfGrowthSpeedsFromAdapter: Result = await plantUseCase.getListOfGrowthSpeeds(jwt.content);
        if (listOfGrowthSpeedsFromAdapter.isFailed()) {
            for (const error of listOfGrowthSpeedsFromAdapter.errors) {
                console.log(error);
            }
            return null;
        }
        const options: Array<BaseOptionModel> = listOfGrowthSpeedsFromAdapter.content.map((growthSpeed: object) => new BaseOptionModel(growthSpeed.name, growthSpeed.name));
        return options;
    }

    async function loadListOfZones(): Promise<Array<BaseOptionModel>> {

        const listOfZonesFromAdapter: Result = await plantUseCase.getListOfZones(jwt.content);
        if (listOfZonesFromAdapter.isFailed()) {
            for (const error of listOfZonesFromAdapter.errors) {
                console.log(error);
            }
            return null;
        }
        const options: Array<BaseOptionModel> = listOfZonesFromAdapter.content.map((zone: object) => new BaseOptionModel(zone.name, zone.name));
        return options;
    }

</script>

<div class="flex-c space-y-6">
    {#if loadingPlant}

        <section>
            <BaseHeader baseHeaderModel={header}>
                <BasePill basePillModel={statusPill}/>
            </BaseHeader>
        </section>

    {:else}
        <section>
            <BaseHeader baseHeaderModel={header}>
                <BasePill basePillModel={statusPill}/>
            </BaseHeader>
        </section>

        <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
            <BaseHeader baseHeaderModel={generalFormHeader}/>
            <GeneralForm species={plant} speciesOrigins={speciesOrigins} user={user}/>
        </section>


        <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
            <BaseHeader baseHeaderModel={namingFormHeader}/>
            <NamingForm species={plant} speciesFamilies={speciesFamilies} speciesGenres={speciesGenres} user={user}/>
        </section>

        <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
            <BaseHeader baseHeaderModel={waterConstraintsFormHeader}/>
            <WaterConstraintsForm species={plant} user={user}/>
        </section>

        <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
            <BaseHeader baseHeaderModel={specsFormHeader}/>
            <PlantSpecsForm species={plant} user={user} growthSpeeds={growthSpeeds} zones={zones}/>
        </section>


        <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
            <BaseHeader baseHeaderModel={imageFormHeader}/>
            <ImagesForm species={plant}/>
        </section>

        <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
            <PublicationStateSwitcher species={plant} user={user}/>
        </section>

    {/if}
</div>