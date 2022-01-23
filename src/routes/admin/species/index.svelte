<script lang="ts">

    import {buttonsAdd, header} from "../../../components/pages/admin/index/Modeles";

    import BaseHeader from "../../../components/atoms/typography/header/BaseHeader.svelte";
    import BaseButton from "../../../components/atoms/button/BaseButton.svelte";
    import Species from "../../../app/species/global/entities/Species";
    import UserUseCase from '../../../app/user/useCases/UseCase';
    import Result from '../../../app/utils/useCasesResult/Result';
    import SpeciesUseCase from '../../../app/species/global/useCases/UseCase';
    import {goto} from '$app/navigation';
    import { onMount } from 'svelte';

    let listOfSpecies: Array<Species> = []
    let loadingSpecies: boolean = true

    onMount(async () => {
        listOfSpecies = await loadSpecies()
        loadingSpecies = false
    })

    async function loadSpecies(): Promise<Array<Species>>{
        const userUseCase: UserUseCase = new UserUseCase()
        const jwt: Result = userUseCase.getToken()

        const speciesUseCase: SpeciesUseCase = new SpeciesUseCase()
        const listOfSpeciesFromHasura: Result = await speciesUseCase.getListOfSpecies(jwt.content)

        if (listOfSpeciesFromHasura.isFailed()) {
            for (const error of listOfSpeciesFromHasura.errors) {
                if (error.code === 401) {
                    userUseCase.logout()
                    return goto('/')
                }
            }

            return listOfSpeciesFromHasura.content
        }

        return listOfSpeciesFromHasura.content
    }
</script>


<div class="flex-c" id="content">
    <BaseHeader baseHeaderModel={header}/>
    {#if loadingSpecies}
        <p>chargement</p>
    {:else}
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
                        <a class="font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-300"
                           href={species.computeLinkToSpecies()} sveltekit:prefetch>{species.computeName()}</a>
                    </td>
                    <td>{species.category}</td>
                    <td>{species.getPublicationStateContent()}</td>
                    <td>{species.created_at.getDate() + '/' + species.created_at.getMonth() + '/' + species.created_at.getFullYear() + ' ' + species.created_at.getHours() + ':' + species.created_at.getMinutes()}</td>
                    <td>{species.updated_at.getDate() + '/' + species.updated_at.getMonth() + '/' + species.updated_at.getFullYear() + ' ' + species.updated_at.getHours() + ':' + species.updated_at.getMinutes()}</td>
                </tr>
            {/each}
            </tbody>
        </table>
    {/if}

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