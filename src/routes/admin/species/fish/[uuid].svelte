<script lang="ts" context="module">
    import Result from "../../../../app/utils/useCasesResult/Result";
    import UserUseCase from "../../../../app/user/useCases/UseCase";
    import SpeciesUseCase from "../../../../app/species/global/useCases/UseCase";
    import FishUseCase from "../../../../app/species/fish/useCases/UseCase";
    import User from "../../../../app/user/entities/User";

    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load({page}){
        const userUseCase: UserUseCase = new UserUseCase()
        const jwt: Result = userUseCase.getToken()
        const user: User = new User(jwt.content)

        const speciesUseCase: SpeciesUseCase = new SpeciesUseCase()
        const fish: Result = await speciesUseCase.getSpecies(jwt.content, page.params.uuid)

        if(fish.isFailed()){
            return {
                error: new Error(`Could not load fish ${page.params.uuid}`)
            }
        }

        const fishUseCase: FishUseCase = new FishUseCase()
        const speciesGenres: Result = await fishUseCase.getFishGenres(jwt.content)
        if (speciesGenres.isFailed()) {
            for (const error of speciesGenres.errors) {
                if (error.code === 401) {
                    userUseCase.logout()
                    return {
                        redirect: "/login",
                        status: 302
                    }
                }
            }
            return {}
        }

        const speciesFamilies: Result = await fishUseCase.getFishFamilies(jwt.content)
        if (speciesFamilies.isFailed()) {
            for (const error of speciesFamilies.errors) {
                if (error.code === 401) {
                    userUseCase.logout()
                    return {
                        redirect: "/login",
                        status: 302
                    }
                }
            }
            return {}
        }

        const speciesOrigins: Result = await speciesUseCase.getSpeciesOrigins(jwt.content)
        if (speciesOrigins.isFailed()) {
            for (const error of speciesOrigins.errors) {
                if (error.code === 401) {
                    userUseCase.logout()
                    return {
                        redirect: "/login",
                        status: 302
                    }
                }
            }
            return {}
        }

        return {
            props: {
                fish: fish.content,
                speciesGenres: speciesGenres.content,
                speciesFamilies: speciesFamilies.content,
                speciesOrigins: speciesOrigins.content,
                user: user
            }
        }
    }
</script>

<script lang="ts">
    import Species from "../../../../app/species/global/entities/Species";
    import BaseHeaderModel from "../../../../components/atoms/typography/header/BaseHeaderModel";
    import BaseHeader from "../../../../components/atoms/typography/header/BaseHeader.svelte";
    import BasePillModel from "../../../../components/atoms/pill/BasePillModel";
    import BasePill from "../../../../components/atoms/pill/BasePill.svelte";
    import SpeciesGenre from "../../../../app/species/global/entities/SpeciesGenre";
    import SpeciesFamily from "../../../../app/species/global/entities/SpeciesFamily";
    import GeneralForm from "../../../../components/molecules/species/generalForm/GeneralForm.svelte";
    import NamingForm from "../../../../components/molecules/species/namingForm/NamingForm.svelte";
    import WaterConstraintsForm
        from "../../../../components/molecules/species/waterConstraintsForm/WaterConstraintsForm.svelte";
    import AnimalSpecsForm from "../../../../components/molecules/species/animalSpecsForm/AnimalSpecsForm.svelte";
    import PublicationStateSwitcher
        from "../../../../components/molecules/species/publicationStateSwitcher/PublicationStateSwitcher.svelte";
    import ImagesForm from "../../../../components/molecules/species/imagesForm/ImagesForm.svelte";

    export let fish: Species = new Species([])
    export let speciesOrigins: Array<string> = []
    export let speciesGenres: Array<SpeciesGenre> = []
    export let speciesFamilies: Array<SpeciesFamily> = []
    export let user: User = new User('')

    const header: BaseHeaderModel = new BaseHeaderModel(fish.computeName())
        .setDisplaySizeOrTrowError('xxxl')
        .setSizeOrTrowError('h1')

    const statusPill: BasePillModel = new BasePillModel(fish.getPublicationStateContent())
    statusPill.setStyleOrThrowError(fish.getPublicationStateStyle())

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
</script>

<div class="flex-c space-y-6">
    <section>
        <BaseHeader baseHeaderModel={header} >
            <BasePill basePillModel={statusPill} />
        </BaseHeader>
    </section>

    <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
        <BaseHeader baseHeaderModel={generalFormHeader} />
        <GeneralForm species={fish} speciesOrigins={speciesOrigins} user={user}/>
    </section>

    <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
        <BaseHeader baseHeaderModel={namingFormHeader} />
        <NamingForm species={fish} speciesFamilies={speciesFamilies} speciesGenres={speciesGenres} user={user}/>
    </section>

    <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
        <BaseHeader baseHeaderModel={waterConstraintsFormHeader} />
        <WaterConstraintsForm species={fish} user={user}/>
    </section>

    <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
        <BaseHeader baseHeaderModel={animalSpecsFormHeader} />
        <AnimalSpecsForm species={fish} user={user} />
    </section>

    <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
        <BaseHeader baseHeaderModel={imageFormHeader} />
        <ImagesForm species={fish} />
    </section>


    <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
        <PublicationStateSwitcher species={fish} user={user}/>
    </section>
</div>