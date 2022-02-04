<script lang="ts">
    import {
        header,
        statusPill,
        generalFormHeader,
        namingFormHeader,
        waterConstraintsFormHeader,
        imageFormHeader,
        specsFormHeader,
        animalBehaviourFormHeader,
        aquariumConstraintsFormHeader
    } from '../../../../components/pages/admin/[uuid]/Modeles';

    import BaseHeader from '../../../../components/atoms/typography/header/BaseHeader.svelte';
    import BasePill from '../../../../components/atoms/pill/BasePill.svelte';
    import GeneralForm from '../../../../components/molecules/species/generalForm/GeneralForm.svelte';
    import NamingForm from '../../../../components/molecules/species/namingForm/NamingForm.svelte';
    import WaterConstraintsForm
        from '../../../../components/molecules/species/waterConstraintsForm/WaterConstraintsForm.svelte';
    import AnimalSpecsForm from '../../../../components/molecules/species/animalSpecsForm/AnimalSpecsForm.svelte';
    import AnimalBehaviourForm
        from '../../../../components/molecules/species/animalBehaviourForm/AnimalBehaviourForm.svelte';
    import ImagesForm from '../../../../components/molecules/species/imagesForm/ImagesForm.svelte';
    import PublicationStateSwitcher
        from '../../../../components/molecules/species/publicationStateSwitcher/PublicationStateSwitcher.svelte';

    import User from '../../../../app/user/entities/User';
    import Species from '../../../../app/species/global/entities/Species';

    import UserUseCase from '../../../../app/user/useCases/UseCase';
    import SpeciesUseCase from '../../../../app/species/global/useCases/UseCase';
    import FishUseCase from '../../../../app/species/fish/useCases/UseCase';
    import Result from '../../../../app/utils/useCasesResult/Result';

    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import {hasLoaded, loadEnums, origins, fishGenres, fishFamilies} from '../../../../store/SpeciesStore';
    import AquariumConstraintsForm
        from '../../../../components/molecules/species/aquariumConstraintsForm/AquariumConstraintsForm.svelte';

    let fish: Species = new Species([]);

    const userUseCase: UserUseCase = new UserUseCase();
    const fishUseCase: FishUseCase = new FishUseCase();
    const speciesUseCase: SpeciesUseCase = new SpeciesUseCase();

    const jwt: Result = userUseCase.getToken();
    const user: User = new User(jwt.content);

    let loadingFish: boolean = true;

    onMount(async () => {
        fish = await loadFish();

        header.setContent(fish.computeName());
        statusPill.setStyleOrThrowError(fish.getPublicationStateStyle());
        statusPill.content = fish.getPublicationStateContent();

        if($hasLoaded !== true){
            await loadEnums()
        }

        loadingFish = false;
    });

    async function loadFish(): Promise<Species> {
        const fishResult: Result = await speciesUseCase.getSpecies(jwt.content, $page.params.uuid);

        if (fishResult.isFailed()) {
            for (const error of fishResult.errors) {
                if (error.code === 401) {
                    userUseCase.logout();
                    return goto('/');
                }
            }
            return fishResult.content;
        }

        return fishResult.content;
    }

</script>

<div class="flex-c space-y-6">
    {#if loadingFish}

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
            <GeneralForm species={fish} speciesOrigins={$origins} user={user}/>
        </section>

        <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
            <BaseHeader baseHeaderModel={namingFormHeader}/>
            <NamingForm species={fish} speciesFamilies={$fishFamilies} speciesGenres={$fishGenres} user={user}/>
        </section>

        <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
            <BaseHeader baseHeaderModel={waterConstraintsFormHeader}/>
            <WaterConstraintsForm species={fish} user={user}/>
        </section>

        <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
            <BaseHeader baseHeaderModel={specsFormHeader}/>
            <AnimalSpecsForm species={fish} user={user}/>
        </section>

        <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
            <BaseHeader baseHeaderModel={animalBehaviourFormHeader}/>
            <AnimalBehaviourForm species={fish} user={user}/>
        </section>


        <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
            <BaseHeader baseHeaderModel={aquariumConstraintsFormHeader}/>
            <AquariumConstraintsForm species={fish} user={user}/>
        </section>

        <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
            <BaseHeader baseHeaderModel={imageFormHeader}/>
            <ImagesForm species={fish}/>
        </section>

        <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
            <PublicationStateSwitcher species={fish} user={user}/>
        </section>

    {/if}
</div>