<script lang="ts">
    import Species from '../../../../app/species/global/entities/Species';
    import BaseHeaderModel from '../../../../components/atoms/typography/header/BaseHeaderModel';
    import BaseHeader from '../../../../components/atoms/typography/header/BaseHeader.svelte';
    import NamingForm from '../../../../components/molecules/species/namingForm/NamingForm.svelte';
    import SpeciesGenre from '../../../../app/species/global/entities/SpeciesGenre';
    import SpeciesFamily from '../../../../app/species/global/entities/SpeciesFamily';
    import WaterConstraintsForm
        from '../../../../components/molecules/species/waterConstraintsForm/WaterConstraintsForm.svelte';
    import BasePillModel from '../../../../components/atoms/pill/BasePillModel';
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
    import {goto} from '$app/navigation';
    import UseCaseError from '../../../../app/utils/useCasesResult/types/UseCaseError';
    import { onMount } from 'svelte';

    export let plant: Species = new Species([]);
    export let speciesOrigins: Array<string> = [];
    export let speciesGenres: Array<SpeciesGenre> = [];
    export let speciesFamilies: Array<SpeciesFamily> = [];

    const userUseCase: UserUseCase = new UserUseCase()
    const plantUseCase: PlantUseCase = new PlantUseCase()
    const speciesUseCase: SpeciesUseCase = new SpeciesUseCase()

    const jwt: Result = userUseCase.getToken();
    const user: User = new User(jwt.content);

    const header: BaseHeaderModel = new BaseHeaderModel('Chargement ...')
      .setDisplaySizeOrTrowError('xxxl')
      .setSizeOrTrowError('h1');

    const statusPill: BasePillModel = new BasePillModel('');

    const generalFormHeader: BaseHeaderModel = new BaseHeaderModel('Infos générales')
      .setDisplaySizeOrTrowError('xxl')
      .setSizeOrTrowError('h2');

    const namingFormHeader: BaseHeaderModel = new BaseHeaderModel('Nom')
      .setDisplaySizeOrTrowError('xxl')
      .setSizeOrTrowError('h2');

    const waterConstraintsFormHeader: BaseHeaderModel = new BaseHeaderModel('Contraintes d\'eau')
      .setDisplaySizeOrTrowError('xxl')
      .setSizeOrTrowError('h2');

    const imageFormHeader: BaseHeaderModel = new BaseHeaderModel("Images")
      .setDisplaySizeOrTrowError('xxl')
      .setSizeOrTrowError('h2')

    let loadingPlant: boolean = true

    onMount(async () => {
        plant = await loadPlant()

        header.setContent(plant.computeName())
        statusPill.setStyleOrThrowError(plant.getPublicationStateStyle())
        statusPill.content = plant.getPublicationStateContent()

        speciesGenres = await loadPlantGenres()
        speciesFamilies = await loadPlantFamilies()
        speciesOrigins = await loadOrigins()

        loadingPlant = false

    })

    async function loadPlant(): Promise<Species>{
        const plantResult: Result = await speciesUseCase.getSpecies(jwt.content, $page.params.uuid)

        if (plantResult.isFailed()) {
            for (const error of plantResult.errors) {
                if (error.code === 401) {
                    userUseCase.logout()
                    return goto('/')
                }
            }
            return plantResult.content
        }

        return plantResult.content
    }

    async function loadPlantGenres(): Promise<Array<SpeciesGenre>> {
        const speciesGenresResult: Result = await plantUseCase.getPlantGenres(jwt.content)
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

    async function loadPlantFamilies(): Promise<Array<SpeciesGenre>> {
        const speciesFamiliesResult: Result = await plantUseCase.getPlantFamilies(jwt.content)
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
    {#await loadPlant()}

        <section>
            <BaseHeader baseHeaderModel={header}>
                <BasePill basePillModel={statusPill}/>
            </BaseHeader>
        </section>

    {:then plant}
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
            <BaseHeader baseHeaderModel={imageFormHeader}/>
            <ImagesForm species={plant}/>
        </section>

        <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
            <PublicationStateSwitcher species={plant} user={user}/>
        </section>

    {:catch errors}
        {#each errors as error}
            <p>{error.type}</p>
        {/each}
    {/await}
</div>