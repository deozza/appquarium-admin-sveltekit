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
    import BasePill from '../../../../components/atoms/pill/BasePill.svelte';

    import NamingForm from '../../../../components/molecules/species/namingForm/NamingForm.svelte';
    import WaterConstraintsForm
        from '../../../../components/molecules/species/waterConstraintsForm/WaterConstraintsForm.svelte';
    import PlantSpecsForm from '../../../../components/molecules/species/plantSpecsForm/PlantSpecsForm.svelte';
    import ImagesForm from '../../../../components/molecules/species/imagesForm/ImagesForm.svelte';

    import PublicationStateSwitcher
        from '../../../../components/molecules/species/publicationStateSwitcher/PublicationStateSwitcher.svelte';
    import GeneralForm from '../../../../components/molecules/species/generalForm/GeneralForm.svelte';
    import UserUseCase from '../../../../app/user/useCases/UseCase';
    import type Result from '../../../../app/utils/useCasesResult/Result';
    import User from '../../../../app/user/entities/User';
    import SpeciesUseCase from '../../../../app/species/global/useCases/UseCase';

    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import {hasLoaded, loadEnums,  origins, plantGenres, plantFamilies, plantZones, growthSpeeds} from '../../../../store/SpeciesStore';

    let plant: Species = new Species([]);

    const userUseCase: UserUseCase = new UserUseCase();
    const speciesUseCase: SpeciesUseCase = new SpeciesUseCase();

    const jwt: Result = userUseCase.getToken();
    const user: User = new User(jwt.content);

    let loadingPlant: boolean = true;

    onMount(async () => {
        plant = await loadPlant();

        header.setContent(plant.computeName());
        statusPill.setStyleOrThrowError(plant.getPublicationStateStyle());
        statusPill.content = plant.getPublicationStateContent();

        if($hasLoaded !== true){
            await loadEnums()
        }
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
            <GeneralForm species={plant} speciesOrigins={$origins} user={user}/>
        </section>


        <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
            <BaseHeader baseHeaderModel={namingFormHeader}/>
            <NamingForm species={plant} speciesFamilies={$plantFamilies} speciesGenres={$plantGenres} user={user}/>
        </section>

        <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
            <BaseHeader baseHeaderModel={waterConstraintsFormHeader}/>
            <WaterConstraintsForm species={plant} user={user}/>
        </section>

        <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
            <BaseHeader baseHeaderModel={specsFormHeader}/>
            <PlantSpecsForm species={plant} user={user} growthSpeeds={$growthSpeeds} zones={$plantZones}/>
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