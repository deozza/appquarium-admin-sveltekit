<script lang="ts">
    import {header, addInvertebrateButton} from "../../../../components/pages/admin/invertebrate/index/Modeles";
    import BaseHeader from "../../../../components/atoms/typography/header/BaseHeader.svelte";
    import BaseButton from "../../../../components/atoms/button/BaseButton.svelte";

    import Species from "../../../../app/species/global/entities/Species";

    import UserUseCase from '../../../../app/user/useCases/UseCase';
    import InvertebrateUseCase from '../../../../app/species/invertebrate/useCases/UseCase';
    import Result from '../../../../app/utils/useCasesResult/Result';
    import UseCaseError from '../../../../app/utils/useCasesResult/types/UseCaseError';

    import {goto} from '$app/navigation';

    export let listOfInvertebrates: Array<Species> = []
    const userUseCase: UserUseCase = new UserUseCase()
    const jwt: Result = userUseCase.getToken()

    async function loadInvertebrates(): Promise<Array<Species> |  Array<UseCaseError>>{
        const invertebrateUseCase: InvertebrateUseCase = new InvertebrateUseCase()
        const listOfInvertebratesResult: Result = await invertebrateUseCase.getListOfInvertebrates(jwt.content)

        if (listOfInvertebratesResult.isFailed()) {
            for (const error of listOfInvertebratesResult.errors) {
                if (error.code === 401) {
                    userUseCase.logout()
                    return goto('/admin')
                }
            }

            return listOfInvertebratesResult.errors
        }

        listOfInvertebrates = listOfInvertebratesResult.content

        return listOfInvertebrates
    }

</script>


<div class="flex-c" id="content">
    <BaseHeader baseHeaderModel={header}/>
    {#await loadInvertebrates()}
        <p>chargement</p>
    {:then listOfInvertebrates}
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
                {#each listOfInvertebrates as invertebrate, i}
                    <tr>
                        <td>{i + 1}</td>
                        <td>
                            <a class="font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-300"
                               href={invertebrate.computeLinkToSpecies()}
                               sveltekit:prefetch>{invertebrate.computeName()}</a>
                        </td>
                        <td>{invertebrate.getPublicationStateContent()}</td>
                        <td>{invertebrate.created_at.getDate() + '/' + invertebrate.created_at.getMonth() + '/' + invertebrate.created_at.getFullYear() + ' ' + invertebrate.created_at.getHours() + ':' + invertebrate.created_at.getMinutes()}</td>
                        <td>{invertebrate.updated_at.getDate() + '/' + invertebrate.updated_at.getMonth() + '/' + invertebrate.updated_at.getFullYear() + ' ' + invertebrate.updated_at.getHours() + ':' + invertebrate.updated_at.getMinutes()}</td>
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

    <a href="/admin/species/invertebrate/add">
        <BaseButton baseButtonModel={addInvertebrateButton}/>
    </a>
</div>

<style>
</style>