<script lang="ts">
    import {
        header,
        statusPill,
        generalFormHeader,
        namingFormHeader,
        waterConstraintsFormHeader,
        imageFormHeader,
        specsFormHeader
    } from '../../../../components/pages/admin/[uuid]/Modeles';

    import BaseHeader from '../../../../components/atoms/typography/header/BaseHeader.svelte';
    import GeneralForm from '../../../../components/molecules/species/generalForm/GeneralForm.svelte';
    import NamingForm from '../../../../components/molecules/species/namingForm/NamingForm.svelte';
    import WaterConstraintsForm
        from '../../../../components/molecules/species/waterConstraintsForm/WaterConstraintsForm.svelte';
    import AnimalSpecsForm from '../../../../components/molecules/species/animalSpecsForm/AnimalSpecsForm.svelte';
    import BasePill from '../../../../components/atoms/pill/BasePill.svelte';
    import ImagesForm from '../../../../components/molecules/species/imagesForm/ImagesForm.svelte';
    import PublicationStateSwitcher
        from '../../../../components/molecules/species/publicationStateSwitcher/PublicationStateSwitcher.svelte';

    import User from '../../../../app/user/entities/User';
    import Species from '../../../../app/species/global/entities/Species';
    import SpeciesGenre from '../../../../app/species/global/entities/SpeciesGenre';
    import SpeciesFamily from '../../../../app/species/global/entities/SpeciesFamily';

    import UserUseCase from '../../../../app/user/useCases/UseCase';
    import SpeciesUseCase from '../../../../app/species/global/useCases/UseCase';
    import InvertebrateUseCase from '../../../../app/species/invertebrate/useCases/UseCase';
    import Result from '../../../../app/utils/useCasesResult/Result';

    import {page} from '$app/stores';
    import {goto} from '$app/navigation';
    import { onMount } from 'svelte';

    export let invertebrate: Species = new Species([]);
    export let speciesOrigins: Array<string> = [];
    export let speciesGenres: Array<SpeciesGenre> = [];
    export let speciesFamilies: Array<SpeciesFamily> = [];

    const userUseCase: UserUseCase = new UserUseCase()
    const invertebrateUseCase: InvertebrateUseCase = new InvertebrateUseCase()
    const speciesUseCase: SpeciesUseCase = new SpeciesUseCase()

    const jwt: Result = userUseCase.getToken();
    const user: User = new User(jwt.content);

    let loadingInvertebrate: boolean = true

    onMount(async () => {
        invertebrate = await loadInvertebrate()

        header.setContent(invertebrate.computeName())
        statusPill.setStyleOrThrowError(invertebrate.getPublicationStateStyle())
        statusPill.content = invertebrate.getPublicationStateContent()

        speciesGenres = await loadInvertebrateGenres()
        speciesFamilies = await loadInvertebrateFamilies()
        speciesOrigins = await loadOrigins()

        loadingInvertebrate = false
    })

    async function loadInvertebrate(): Promise<Species>{
        const invertebrateResult: Result = await speciesUseCase.getSpecies(jwt.content, $page.params.uuid)

        if (invertebrateResult.isFailed()) {
            for (const error of invertebrateResult.errors) {
                if (error.code === 401) {
                    userUseCase.logout()
                    return goto('/')
                }
            }
            return invertebrateResult.content
        }

        return invertebrateResult.content
    }

    async function loadInvertebrateGenres(): Promise<Array<SpeciesGenre>> {
        const speciesGenresResult: Result = await invertebrateUseCase.getInvertebrateGenres(jwt.content)
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

    async function loadInvertebrateFamilies(): Promise<Array<SpeciesGenre>> {
        const speciesFamiliesResult: Result = await invertebrateUseCase.getInvertebrateFamilies(jwt.content)
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

<div class="flex-c">
    {#await loadInvertebrate()}

        <section>
            <BaseHeader baseHeaderModel={header}>
                <BasePill basePillModel={statusPill}/>
            </BaseHeader>
        </section>

    {:then invertebrate}

        <section>
            <BaseHeader baseHeaderModel={header}>
                <BasePill basePillModel={statusPill}/>
            </BaseHeader>
        </section>

        <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
            <BaseHeader baseHeaderModel={generalFormHeader}/>
            <GeneralForm species={invertebrate} speciesOrigins={speciesOrigins} user={user}/>
        </section>

        <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
            <BaseHeader baseHeaderModel={namingFormHeader}/>
            <NamingForm species={invertebrate} speciesFamilies={speciesFamilies} speciesGenres={speciesGenres} user={user}/>
        </section>

        <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
            <BaseHeader baseHeaderModel={waterConstraintsFormHeader}/>
            <WaterConstraintsForm species={invertebrate} user={user}/>
        </section>

        <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
            <BaseHeader baseHeaderModel={specsFormHeader}/>
            <AnimalSpecsForm species={invertebrate} user={user}/>
        </section>

        <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
            <BaseHeader baseHeaderModel={imageFormHeader}/>
            <ImagesForm species={invertebrate}/>
        </section>

        <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
            <PublicationStateSwitcher species={invertebrate} user={user}/>
        </section>
    {:catch errors}
        {#each errors as error}
            <p>{error.type}</p>
        {/each}
    {/await}
</div>