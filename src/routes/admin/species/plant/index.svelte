<script lang="ts" context="module">
    import Result from "../../../../app/utils/useCasesResult/Result";
    import UserUseCase from "../../../../app/user/useCases/UseCase";
    import PlantUseCase from "../../../../app/species/plant/useCases/UseCase";

    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load(){
        const userUseCase: UserUseCase = new UserUseCase()

        const jwt: Result = userUseCase.getToken()

        const plantUseCase: PlantUseCase = new PlantUseCase()

        const listOfPlants: Result = await plantUseCase.getListOfPlants(jwt.content)

        return {
            props: {
                listOfPlants: listOfPlants.content
            }
        }
    }
</script>

<script lang="ts">
    import {header, addPlantButton} from "../../../../components/pages/admin/plant/index/Modeles";

    import BaseHeader from "../../../../components/atoms/typography/header/BaseHeader.svelte";
    import Species from "../../../../app/species/global/entities/Species";
    import BaseButton from "../../../../components/atoms/button/BaseButton.svelte";

    export let listOfPlant: Array<Species> = []

</script>


<div class="flex-c" id="content">
    <BaseHeader baseHeaderModel={header}/>

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
            {#each listOfPlant as plant, i}
                <tr>
                    <td>{i + 1}</td>
                    <td>
                        <a class="font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-300" href={plant.computeLinkToSpecies()} sveltekit:prefetch>{plant.computeName()}</a>
                    </td>
                    <td>{plant.publication_state}</td>
                    <td>{plant.created_at.getDate() + '/' + plant.created_at.getMonth() + '/' + plant.created_at.getFullYear() + ' ' + plant.created_at.getHours() + ':' + plant.created_at.getMinutes()}</td>
                    <td>{plant.updated_at.getDate() + '/' + plant.updated_at.getMonth() + '/' + plant.updated_at.getFullYear() + ' ' + plant.updated_at.getHours() + ':' + plant.updated_at.getMinutes()}</td>
                </tr>
            {/each}
            </tbody>
        </table>
    </template>


    <a href="/admin/species/plan/add">
        <BaseButton baseButtonModel={addPlantButton}/>
    </a>
</div>

<style>
</style>