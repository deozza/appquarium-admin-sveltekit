<script lang="ts">
    import {header, addFishButton} from "../../../../components/pages/admin/fish/index/Modeles";
    import BaseHeader from "../../../../components/atoms/typography/header/BaseHeader.svelte";
    import BaseButton from "../../../../components/atoms/button/BaseButton.svelte";

    import Species from "../../../../app/species/global/entities/Species";

    import UserUseCase from '../../../../app/user/useCases/UseCase';
    import FishUseCase from '../../../../app/species/fish/useCases/UseCase';
    import Result from '../../../../app/utils/useCasesResult/Result';
    import UseCaseError from '../../../../app/utils/useCasesResult/types/UseCaseError';

    import {goto} from '$app/navigation';

    export let listOfFishes: Array<Species> = []
    const userUseCase: UserUseCase = new UserUseCase()
    const jwt: Result = userUseCase.getToken()

    async function loadFishes(): Promise<Array<Species> | Array<UseCaseError>>{
        const fishUseCase: FishUseCase = new FishUseCase()
        const listOfFishesResult: Result = await fishUseCase.getListOfFishes(jwt.content)

        if (listOfFishesResult.isFailed()) {
            for (const error of listOfFishesResult.errors) {
                if (error.code === 401) {
                    userUseCase.logout()
                    return goto('/admin')

                }
            }

            return listOfFishes
        }

        listOfFishes = listOfFishesResult.content

        return listOfFishes
    }
</script>

<div class="flex-c" id="content">
    <BaseHeader baseHeaderModel={header}/>
    {#await loadFishes()}
        <p>chargement</p>
    {:then listOfFishes}
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
                            <a class="font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-300"
                               href={fish.computeLinkToSpecies()} sveltekit:prefetch>{fish.computeName()}</a>
                        </td>
                        <td>{fish.getPublicationStateContent()}</td>
                        <td>{fish.created_at.getDate() + '/' + fish.created_at.getMonth() + '/' + fish.created_at.getFullYear() + ' ' + fish.created_at.getHours() + ':' + fish.created_at.getMinutes()}</td>
                        <td>{fish.updated_at.getDate() + '/' + fish.updated_at.getMonth() + '/' + fish.updated_at.getFullYear() + ' ' + fish.updated_at.getHours() + ':' + fish.updated_at.getMinutes()}</td>
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
    <a href="/admin/species/fish/add">
        <BaseButton baseButtonModel={addFishButton}/>
    </a>
</div>

<style>
</style>