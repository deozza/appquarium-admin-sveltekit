<script lang="ts" context="module">
    import UserUseCase from "../../../../app/user/useCases/UseCase";
    import User from "../../../../app/user/entities/User";
    import Result from "../../../../app/utils/useCasesResult/Result";
    import PlantUseCase from "../../../../app/species/plant/useCases/UseCase";

    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load(){
        const userUseCase: UserUseCase = new UserUseCase()
        const cookie: Result = userUseCase.getToken()

        const user: User = new User(cookie.content)
        const plantUseCase: PlantUseCase = new PlantUseCase()

        const speciesGenres: Result = await plantUseCase.getPlantGenres(cookie.content)
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

        const speciesFamilies: Result = await plantUseCase.getPlantGenres(cookie.content)
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
                speciesFamilies: speciesFamilies.content,
                speciesGenres: speciesGenres.content,
                user: user
            }
        }
    }
</script>

<script lang="ts">
    import {header} from "../../../../components/pages/admin/plant/add/Modeles";
    import BaseHeader from "../../../../components/atoms/typography/header/BaseHeader.svelte";
    import SpeciesGenre from "../../../../app/species/global/entities/SpeciesGenre";
    import SpeciesFamily from "../../../../app/species/global/entities/SpeciesFamily";
    import Species from "../../../../app/species/global/entities/Species";
    import NamingForm from "../../../../components/molecules/species/NamingForm.svelte";

    export let speciesGenres: Array<SpeciesGenre> = []
    export let speciesFamilies: Array<SpeciesFamily> = []
    export let user: User = new User('')
    user.extractUserInfoFromJwt()

    const plantUseCase: PlantUseCase = new PlantUseCase()
    let plant: Species = plantUseCase.initNewPlant(user)

</script>

<section class="flex-c pb-12">
    <BaseHeader baseHeaderModel="{header}" />
</section>

<div class="flex-c">
    <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
        <NamingForm species={plant} speciesFamilies={speciesFamilies} speciesGenres={speciesGenres} user={user}/>
    </section>
</div>