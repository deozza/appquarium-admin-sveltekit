<script lang="ts">
    import {header, addPlantButton} from "../../../../components/pages/admin/plant/index/Modeles";
    import BaseHeader from "../../../../components/atoms/typography/header/BaseHeader.svelte";
    import BaseButton from "../../../../components/atoms/button/BaseButton.svelte";

    import Species from "../../../../app/species/global/entities/Species";

    import UserUseCase from '../../../../app/user/useCases/UseCase';
    import PlantUseCase from '../../../../app/species/plant/useCases/UseCase';
    import Result from '../../../../app/utils/useCasesResult/Result';
    import UseCaseError from '../../../../app/utils/useCasesResult/types/UseCaseError';

    import {goto} from '$app/navigation';

    export let listOfPlants: Array<Species> = []
    const userUseCase: UserUseCase = new UserUseCase()
    const jwt: Result = userUseCase.getToken()

    async function loadPlants(): Promise<Array<Species> | Array<UseCaseError>> {
        const plantUseCase: PlantUseCase = new PlantUseCase()
        const listOfPlantsResult: Result = await plantUseCase.getListOfPlants(jwt.content)

        if (listOfPlantsResult.isFailed()) {
            for (const error of listOfPlantsResult.errors) {
                if (error.code === 401) {
                    userUseCase.logout()
                    return goto('/login')
                }
            }

            return listOfPlantsResult.errors
        }

        listOfPlants = listOfPlantsResult.content
        return listOfPlants
    }

</script>


<div class="flex-c" id="content">
    <BaseHeader baseHeaderModel={header}/>
    {#await loadPlants()}
        <p>chargement</p>
    {:then listOfPlants}
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
                {#each listOfPlants as plant, i}
                    <tr>
                        <td>{i + 1}</td>
                        <td>
                            <a class="font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-300"
                               href={plant.computeLinkToSpecies()} sveltekit:prefetch>{plant.computeName()}</a>
                        </td>
                        <td>{plant.getPublicationStateContent()}</td>
                        <td>{plant.created_at.getDate() + '/' + plant.created_at.getMonth() + '/' + plant.created_at.getFullYear() + ' ' + plant.created_at.getHours() + ':' + plant.created_at.getMinutes()}</td>
                        <td>{plant.updated_at.getDate() + '/' + plant.updated_at.getMonth() + '/' + plant.updated_at.getFullYear() + ' ' + plant.updated_at.getHours() + ':' + plant.updated_at.getMinutes()}</td>
                    </tr>
                {/each}
                </tbody>
            </table>
        </template>

    {:catch errors}
        {#each errors as error}
            <p>{error.type}</p>
        {/each}
    {/await}

    <a href="/admin/species/plant/add">
        <BaseButton baseButtonModel={addPlantButton}/>
    </a>
</div>

<style>
</style>