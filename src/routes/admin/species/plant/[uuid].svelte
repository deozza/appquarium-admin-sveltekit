<script lang="ts" context="module">
    import Result from "../../../../app/utils/useCasesResult/Result";
    import UserUseCase from "../../../../app/user/useCases/UseCase";
    import SpeciesUseCase from "../../../../app/species/global/useCases/UseCase";
    import User from "../../../../app/user/entities/User";
    import PlantUseCase from "../../../../app/species/plant/useCases/UseCase";

    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load({page}){
        const userUseCase: UserUseCase = new UserUseCase()
        const jwt: Result = userUseCase.getToken()
        const user: User = new User(jwt.content)

        const speciesUseCase: SpeciesUseCase = new SpeciesUseCase()
        const plant: Result = await speciesUseCase.getSpecies(jwt.content, page.params.uuid)

        if(plant.isFailed()){
            return {
                redirect: '/admin/species',
                status: 302
            }
        }

        const plantUseCase: PlantUseCase = new PlantUseCase()
        const speciesGenres: Result = await plantUseCase.getPlantGenres(jwt.content)
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

        const speciesFamilies: Result = await plantUseCase.getPlantFamilies(jwt.content)
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
                plant: plant.content,
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

    export let plant: Species = new Species([])
    export let speciesGenres: Array<SpeciesGenre> = []
    export let speciesFamilies: Array<SpeciesFamily> = []
    export let user: User = new User('')

    const header: BaseHeaderModel = new BaseHeaderModel(plant.computeName())
        .setDisplaySizeOrTrowError('xxxl')
        .setSizeOrTrowError('h1')

    const namingFormHeader: BaseHeaderModel = new BaseHeaderModel('Nom')
        .setDisplaySizeOrTrowError('xxl')
        .setSizeOrTrowError('h2')

    const waterConstraintsFormHeader: BaseHeaderModel = new BaseHeaderModel("Contraintes d'eau")
        .setDisplaySizeOrTrowError('xxl')
        .setSizeOrTrowError('h2')

</script>

<div class="flex-c">
    <section>
        <BaseHeader baseHeaderModel={header} />
    </section>

    <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
        <BaseHeader baseHeaderModel={namingFormHeader} />
        <NamingForm species={plant} speciesFamilies={speciesFamilies} speciesGenres={speciesGenres} user={user}/>
    </section>

    <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
        <BaseHeader baseHeaderModel={waterConstraintsFormHeader} />
        <WaterConstraintsForm species={plant} user={user}/>
    </section>
</div>