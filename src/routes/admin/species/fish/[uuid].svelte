<script lang="ts">
    import {
        header,
        statusPill,
        generalFormHeader,
        namingFormHeader,
        waterConstraintsFormHeader,
        imageFormHeader,
        animalSpecsFormHeader
    } from '../../../../components/pages/admin/[uuid]/Modeles';

    import BaseHeader from "../../../../components/atoms/typography/header/BaseHeader.svelte";
    import BasePill from "../../../../components/atoms/pill/BasePill.svelte";
    import GeneralForm from "../../../../components/molecules/species/generalForm/GeneralForm.svelte";
    import NamingForm from "../../../../components/molecules/species/namingForm/NamingForm.svelte";
    import WaterConstraintsForm
        from "../../../../components/molecules/species/waterConstraintsForm/WaterConstraintsForm.svelte";
    import AnimalSpecsForm from "../../../../components/molecules/species/animalSpecsForm/AnimalSpecsForm.svelte";
    import ImagesForm from "../../../../components/molecules/species/imagesForm/ImagesForm.svelte";
    import PublicationStateSwitcher
        from "../../../../components/molecules/species/publicationStateSwitcher/PublicationStateSwitcher.svelte";

    import User from '../../../../app/user/entities/User';
    import Species from "../../../../app/species/global/entities/Species";
    import SpeciesGenre from "../../../../app/species/global/entities/SpeciesGenre";
    import SpeciesFamily from "../../../../app/species/global/entities/SpeciesFamily";

    import UserUseCase from '../../../../app/user/useCases/UseCase';
    import SpeciesUseCase from '../../../../app/species/global/useCases/UseCase';
    import FishUseCase from '../../../../app/species/fish/useCases/UseCase';
    import Result from '../../../../app/utils/useCasesResult/Result';

    import {page} from "$app/stores";
    import {goto} from '$app/navigation';
    import { onMount } from 'svelte';

    let fish: Species = new Species([])
    let speciesOrigins: Array<string> = []
    let speciesGenres: Array<SpeciesGenre> = []
    let speciesFamilies: Array<SpeciesFamily> = []

    const userUseCase: UserUseCase = new UserUseCase()
    const fishUseCase: FishUseCase = new FishUseCase()
    const speciesUseCase: SpeciesUseCase = new SpeciesUseCase()

    const jwt: Result = userUseCase.getToken()
    const user: User = new User(jwt.content)

    let loadingFish: boolean = true

    onMount(async () => {
        fish = await loadFish()

        header.setContent(fish.computeName())
        statusPill.setStyleOrThrowError(fish.getPublicationStateStyle())
        statusPill.content = fish.getPublicationStateContent()

        speciesGenres = await loadFishGenres()
        speciesFamilies = await loadFishFamilies()
        speciesOrigins = await loadOrigins()

        loadingFish = false
    })

    async function loadFish(): Promise<Species>{
        const fishResult: Result = await speciesUseCase.getSpecies(jwt.content, $page.params.uuid)

        if (fishResult.isFailed()) {
            for (const error of fishResult.errors) {
                if (error.code === 401) {
                    userUseCase.logout()
                    return goto('/')
                }
            }
            return fishResult.content
        }

        return fishResult.content
    }

    async function loadFishGenres(): Promise<Array<SpeciesGenre>> {
        const speciesGenresResult: Result = await fishUseCase.getFishGenres(jwt.content)
        if (speciesGenresResult.isFailed()) {
            for (const error of speciesGenresResult.errors) {
                if (error.code === 401) {
                    userUseCase.logout()
                    return goto('/')

                }
            }
            return speciesGenresResult.content
        }

        return speciesGenresResult.content
    }

    async function loadFishFamilies(): Promise<Array<SpeciesGenre>> {
        const speciesFamiliesResult: Result = await fishUseCase.getFishFamilies(jwt.content)
        if (speciesFamiliesResult.isFailed()) {
            for (const error of speciesFamiliesResult.errors) {
                if (error.code === 401) {
                    userUseCase.logout()
                    return goto('/')

                }
            }
            return speciesFamiliesResult.content
        }
        return speciesFamiliesResult.content
    }

    async function loadOrigins(): Promise<Array<string>> {
        const speciesOriginsResult: Result = await speciesUseCase.getSpeciesOrigins(jwt.content)
        if (speciesOriginsResult.isFailed()) {
            for (const error of speciesOriginsResult.errors) {
                if (error.code === 401) {
                    userUseCase.logout()
                    return goto('/')

                }
            }
            return speciesOriginsResult.content
        }

        return speciesOriginsResult.content
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
            <GeneralForm species={fish} speciesOrigins={speciesOrigins} user={user}/>
        </section>

        <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
            <BaseHeader baseHeaderModel={namingFormHeader}/>
            <NamingForm species={fish} speciesFamilies={speciesFamilies} speciesGenres={speciesGenres} user={user}/>
        </section>

        <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
            <BaseHeader baseHeaderModel={waterConstraintsFormHeader}/>
            <WaterConstraintsForm species={fish} user={user}/>
        </section>

        <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
            <BaseHeader baseHeaderModel={animalSpecsFormHeader}/>
            <AnimalSpecsForm species={fish} user={user}/>
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