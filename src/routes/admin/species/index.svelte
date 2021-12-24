<script lang="ts" context="module">
    import Result from "../../../app/utils/useCasesResult/Result";
    import UserUseCase from "../../../app/user/useCases/UseCase";
    import SpeciesUseCase from "../../../app/species/global/useCases/UseCase";

    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load(){
        const userUseCase: UserUseCase = new UserUseCase()
        const jwt: Result = userUseCase.getToken()

        const speciesUseCase: SpeciesUseCase = new SpeciesUseCase()
        const listOfSpecies: Result = await speciesUseCase.getListOfSpecies(jwt.content)

        if(listOfSpecies.isFailed()){
            for(const error of listOfSpecies.errors){
                if(error.code === 401){
                    userUseCase.logout()
                    return {
                        redirect: '/login',
                        status: 302
                    }
                }
            }

            return {
                props: {
                    listOfSpecies: []
                }
            }
        }

        return {
            props: {
                listOfSpecies: listOfSpecies.content
            }
        }
    }
</script>

<script lang="ts">

import {buttonsAdd, header} from "../../../components/pages/admin/index/Modeles";

import BaseHeader from "../../../components/atoms/typography/header/BaseHeader.svelte";
import BaseButton from "../../../components/atoms/button/BaseButton.svelte";
import Species from "../../../app/species/global/entities/Species";

export let listOfSpecies: Array<Species> = []

</script>


<div class="flex-c" id="content">
    <BaseHeader baseHeaderModel={header}/>

    <template slot="body">
        <table class="table-auto">
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Nom scientifique</th>
                <th scope="col">Type</th>
                <th scope="col">Etat</th>
                <th scope="col">Créé le</th>
                <th scope="col">Modifié le</th>
            </tr>
            </thead>
            <tbody>
            {#each listOfSpecies as species, i}
                <tr>
                    <td>{i + 1}</td>
                    <td>
                        <a class="font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-300" href={species.computeLinkToSpecies()} sveltekit:prefetch>{species.computeName()}</a>
                    </td>
                    <td>{species.category}</td>
                    <td>{species.publication_state}</td>
                    <td>{species.created_at.getDate() + '/' + species.created_at.getMonth() + '/' + species.created_at.getFullYear() + ' ' + species.created_at.getHours() + ':' + species.created_at.getMinutes()}</td>
                    <td>{species.updated_at.getDate() + '/' + species.updated_at.getMonth() + '/' + species.updated_at.getFullYear() + ' ' + species.updated_at.getHours() + ':' + species.updated_at.getMinutes()}</td>
                </tr>
            {/each}
            </tbody>
        </table>
    </template>

    <div class="flex-r">
        {#each buttonsAdd as button}
            <a href={button.link}>
                <BaseButton baseButtonModel={button.modele}/>
            </a>
        {/each}
    </div>

</div>

<style>
</style>