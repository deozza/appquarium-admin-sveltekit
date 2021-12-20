<script lang="ts" context="module">
    import Result from "../../../../app/utils/useCasesResult/Result";
    import UserUseCase from "../../../../app/user/useCases/UseCase";
    import FishUseCase from "../../../../app/species/fish/useCases/UseCase";

    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load(){
        const userUseCase: UserUseCase = new UserUseCase()
        const jwt: Result = userUseCase.getToken()

        const fishUseCase: FishUseCase = new FishUseCase()
        const listOfFishes: Result = await fishUseCase.getListOfFishes(jwt.content)

        return {
            props: {
                listOfFishes: listOfFishes.content
            }
        }
    }
</script>

<script lang="ts">
    import {header, addFishButton} from "../../../../components/pages/admin/fish/index/Modeles";

    import BaseHeader from "../../../../components/atoms/typography/header/BaseHeader.svelte";
    import Species from "../../../../app/species/global/entities/Species";
    import BaseButton from "../../../../components/atoms/button/BaseButton.svelte";

    export let listOfFishes: Array<Species> = []
</script>


<div class="flex-c" id="content">
    <BaseHeader baseHeaderModel={header} />

    <template slot="body">
        <table class="table-auto">
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Nom scientifique</th>
                <th scope="col">Etat</th>
                <th scope="col">Créé le</th>
                <th scope="col">Modifié le</th>
            </tr>
            </thead>
            <tbody>
            {#each listOfFishes as fish, i}
                <tr>
                    <td>{i + 1}</td>
                    <td>
                        <a class="font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-300" href={fish.computeLinkToSpecies()} sveltekit:prefetch>{fish.computeName()}</a>
                    </td>
                    <td>{fish.publication_state}</td>
                    <td>{fish.created_at.getDate() + '/' + fish.created_at.getMonth() + '/' + fish.created_at.getFullYear() + ' ' + fish.created_at.getHours() + ':' + fish.created_at.getMinutes()}</td>
                    <td>{fish.updated_at.getDate() + '/' + fish.updated_at.getMonth() + '/' + fish.updated_at.getFullYear() + ' ' + fish.updated_at.getHours() + ':' + fish.updated_at.getMinutes()}</td>
                </tr>
            {/each}
            </tbody>
        </table>
    </template>

    <a href="/admin/species/fish/add">
        <BaseButton baseButtonModel={addFishButton}/>
    </a>
</div>

<style>
</style>