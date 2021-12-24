<script lang="ts" context="module">
    import FishUseCase from "../../../../app/species/fish/useCases/UseCase";
    import UserUseCase from "../../../../app/user/useCases/UseCase";
    import User from "../../../../app/user/entities/User";
    import Result from "../../../../app/utils/useCasesResult/Result";

    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load(){
        const userUseCase: UserUseCase = new UserUseCase()
        const cookie: Result = userUseCase.getToken()

        const user: User = new User(cookie.content)
        const fishUseCase: FishUseCase = new FishUseCase()

        const speciesGenres: Result = await fishUseCase.getFishGenres(cookie.content)
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

        const speciesFamilies: Result = await fishUseCase.getFishFamilies(cookie.content)
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
    import {header} from "../../../../components/pages/admin/fish/add/Modeles";
    import BaseHeader from "../../../../components/atoms/typography/header/BaseHeader.svelte";
    import SpeciesGenre from "../../../../app/species/global/entities/SpeciesGenre";
    import SpeciesFamily from "../../../../app/species/global/entities/SpeciesFamily";
    import Species from "../../../../app/species/global/entities/Species";
    import NamingForm from "../../../../components/molecules/species/namingForm/NamingForm.svelte";

    export let speciesGenres: Array<SpeciesGenre> = []
    export let speciesFamilies: Array<SpeciesFamily> = []
    export let user: User = new User('')
    user.extractUserInfoFromJwt()

    const fishUseCase: FishUseCase = new FishUseCase()
    let fish: Species = fishUseCase.initNewFish(user)

</script>

<section class="flex-c pb-12">
    <BaseHeader baseHeaderModel="{header}" />
</section>

<div class="flex-c">
    <section class="w-3/5 flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
        <NamingForm species={fish} speciesFamilies={speciesFamilies} speciesGenres={speciesGenres} user={user}/>
    </section>
</div>