<script lang="ts" context="module">
    import Result from "../../../../app/utils/useCasesResult/Result";
    import UserUseCase from "../../../../app/user/useCases/UseCase";
    import SpeciesUseCase from "../../../../app/species/global/useCases/UseCase";
    import User from "../../../../app/user/entities/User";
    import InvertebrateUseCase from "../../../../app/species/invertebrate/useCases/UseCase";

    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load({page}){
        const userUseCase: UserUseCase = new UserUseCase()
        const jwt: Result = userUseCase.getToken()
        const user: User = new User(jwt.content)

        const speciesUseCase: SpeciesUseCase = new SpeciesUseCase()
        const invertebrate: Result = await speciesUseCase.getSpecies(jwt.content, page.params.uuid)

        if(invertebrate.isFailed()){
            return {
                redirect: '/admin/species',
                status: 302
            }
        }

        const invertebrateUseCase: InvertebrateUseCase = new InvertebrateUseCase()
        const speciesGenres: Result = await invertebrateUseCase.getInvertebrateGenres(jwt.content)
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

        const speciesFamilies: Result = await invertebrateUseCase.getInvertebrateFamilies(jwt.content)
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

        return {
            props: {
                invertebrate: invertebrate.content,
                speciesGenres: speciesGenres.content,
                speciesFamilies: speciesFamilies.content,
                user: user
            }
        }
    }
</script>

<script lang="ts">
    import Species from "../../../../app/species/global/entities/Species";
    import BaseHeaderModel from "../../../../components/atoms/typography/header/BaseHeaderModel";
    import BaseHeader from "../../../../components/atoms/typography/header/BaseHeader.svelte";
    import NamingForm from "../../../../components/molecules/species/namingForm/NamingForm.svelte";
    import SpeciesGenre from "../../../../app/species/global/entities/SpeciesGenre";
    import SpeciesFamily from "../../../../app/species/global/entities/SpeciesFamily";
    import WaterConstraintsForm
        from "../../../../components/molecules/species/waterConstraintsForm/WaterConstraintsForm.svelte";
    import AnimalSpecsForm from "../../../../components/molecules/species/animalSpecsForm/AnimalSpecsForm.svelte";
    import BasePillModel from "../../../../components/atoms/pill/BasePillModel";
    import BasePill from "../../../../components/atoms/pill/BasePill.svelte";

    export let invertebrate: Species = new Species([])
    export let speciesGenres: Array<SpeciesGenre> = []
    export let speciesFamilies: Array<SpeciesFamily> = []
    export let user: User = new User('')

    const header: BaseHeaderModel = new BaseHeaderModel(invertebrate.computeName())
        .setDisplaySizeOrTrowError('xxxl')
        .setSizeOrTrowError('h1')

    const statusPill: BasePillModel = new BasePillModel(invertebrate.getPublicationStateContent())
    statusPill.setStyleOrThrowError(invertebrate.getPublicationStateStyle())

    const namingFormHeader: BaseHeaderModel = new BaseHeaderModel('Nom')
        .setDisplaySizeOrTrowError('xxl')
        .setSizeOrTrowError('h2')

    const waterConstraintsFormHeader: BaseHeaderModel = new BaseHeaderModel("Contraintes d'eau")
        .setDisplaySizeOrTrowError('xxl')
        .setSizeOrTrowError('h2')

    const animalSpecsFormHeader: BaseHeaderModel = new BaseHeaderModel("Caractéristiques animales")
        .setDisplaySizeOrTrowError('xxl')
        .setSizeOrTrowError('h2')
</script>

<div class="flex-c">
    <section>
        <BaseHeader baseHeaderModel={header} >
            <BasePill basePillModel={statusPill} />
        </BaseHeader>
    </section>

    <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
        <BaseHeader baseHeaderModel={namingFormHeader} />
        <NamingForm species={invertebrate} speciesFamilies={speciesFamilies} speciesGenres={speciesGenres} user={user}/>
    </section>

    <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
        <BaseHeader baseHeaderModel={waterConstraintsFormHeader} />
        <WaterConstraintsForm species={invertebrate} user={user}/>
    </section>

    <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
        <BaseHeader baseHeaderModel={animalSpecsFormHeader} />
        <AnimalSpecsForm species={invertebrate} user={user} />
    </section>
</div>