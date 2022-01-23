<script lang="ts">
    import BaseHeaderModel from "../../../../components/atoms/typography/header/BaseHeaderModel";
    import BaseHeader from "../../../../components/atoms/typography/header/BaseHeader.svelte";
    import BasePillModel from "../../../../components/atoms/pill/BasePillModel";
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
    import UseCaseError from '../../../../app/utils/useCasesResult/types/UseCaseError';

    import {page} from "$app/stores";
    import {goto} from '$app/navigation';

    export let fish: Species = new Species([])
    export let speciesOrigins: Array<string> = []
    export let speciesGenres: Array<SpeciesGenre> = []
    export let speciesFamilies: Array<SpeciesFamily> = []

    const userUseCase: UserUseCase = new UserUseCase()
    const jwt: Result = userUseCase.getToken()
    const user: User = new User(jwt.content)

    const header: BaseHeaderModel = new BaseHeaderModel('Chargement ...')
      .setDisplaySizeOrTrowError('xxxl')
      .setSizeOrTrowError('h1')

    const statusPill: BasePillModel = new BasePillModel('')

    const generalFormHeader: BaseHeaderModel = new BaseHeaderModel('Infos générales')
      .setDisplaySizeOrTrowError('xxl')
      .setSizeOrTrowError('h2')

    const namingFormHeader: BaseHeaderModel = new BaseHeaderModel('Nom')
      .setDisplaySizeOrTrowError('xxl')
      .setSizeOrTrowError('h2')

    const waterConstraintsFormHeader: BaseHeaderModel = new BaseHeaderModel("Contraintes d'eau")
      .setDisplaySizeOrTrowError('xxl')
      .setSizeOrTrowError('h2')

    const animalSpecsFormHeader: BaseHeaderModel = new BaseHeaderModel("Caractéristiques animales")
      .setDisplaySizeOrTrowError('xxl')
      .setSizeOrTrowError('h2')

    const imageFormHeader: BaseHeaderModel = new BaseHeaderModel("Images")
      .setDisplaySizeOrTrowError('xxl')
      .setSizeOrTrowError('h2')

    async function loadSpecies(): Promise<Species | Array<UseCaseError>>{
        const speciesUseCase: SpeciesUseCase = new SpeciesUseCase()
        const fishResult: Result = await speciesUseCase.getSpecies(jwt.content, $page.params.uuid)

        if (fishResult.isFailed()) {
            for (const error of fishResult.errors) {
                if (error.code === 401) {
                    userUseCase.logout()
                    return goto('/')
                }
            }
            return fishResult.errors
        }

        fish = fishResult.content
        header.setContent(fish.computeName())
        statusPill.setStyleOrThrowError(fish.getPublicationStateStyle())
        statusPill.content = fish.getPublicationStateContent()

        const fishUseCase: FishUseCase = new FishUseCase()
        const speciesGenresResult: Result = await fishUseCase.getFishGenres(jwt.content)
        if (speciesGenresResult.isFailed()) {
            for (const error of speciesGenresResult.errors) {
                if (error.code === 401) {
                    userUseCase.logout()
                    return goto('/')

                }
            }
            return speciesGenresResult.errors
        }

        speciesGenres = speciesGenresResult.content

        const speciesFamiliesResult: Result = await fishUseCase.getFishFamilies(jwt.content)
        if (speciesFamiliesResult.isFailed()) {
            for (const error of speciesFamiliesResult.errors) {
                if (error.code === 401) {
                    userUseCase.logout()
                    return goto('/')

                }
            }
            return speciesFamiliesResult.errors
        }

        speciesFamilies = speciesFamiliesResult.content

        const speciesOriginsResult: Result = await speciesUseCase.getSpeciesOrigins(jwt.content)
        if (speciesOriginsResult.isFailed()) {
            for (const error of speciesOriginsResult.errors) {
                if (error.code === 401) {
                    userUseCase.logout()
                    return goto('/')

                }
            }
            return speciesOriginsResult.errors
        }

        speciesOrigins = speciesOriginsResult.content

        return fish
    }

</script>

<div class="flex-c space-y-6">
    {#await loadSpecies()}

        <section>
            <BaseHeader baseHeaderModel={header}>
                <BasePill basePillModel={statusPill}/>
            </BaseHeader>
        </section>

    {:then species}
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

    {:catch errors}
        {#each errors as error}
            <p>{error.type}</p>
        {/each}
    {/await}
</div>