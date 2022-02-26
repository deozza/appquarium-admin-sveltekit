<script lang="ts">

    import {buttonsAdd, header} from "../../../components/pages/admin/index/Modeles";

    import BaseHeader from "../../../components/atoms/typography/header/BaseHeader.svelte";
    import BaseButton from "../../../components/atoms/button/BaseButton.svelte";
    import Species from "../../../app/species/global/entities/Species";
    import UserUseCase from '../../../app/user/useCases/UseCase';
    import Result from '../../../app/utils/useCasesResult/Result';
    import SpeciesUseCase from '../../../app/species/global/useCases/UseCase';
    import Constraints from '../../../app/adapters/hasura/HasuraRequestBuilderV2/Constraints';
    import {goto} from '$app/navigation';
    import { onMount } from 'svelte';
    import { page } from '$app/stores'

    let listOfSpecies: Array<Species> = []
    const userUseCase: UserUseCase = new UserUseCase()
    const jwt: Result = userUseCase.getToken()

    let totalOfSpecies: number = 0
    let totalPages: number = 1
    let itemsPerPage : number = 10
    let currentPage: number | string = 1

    let loadingSpecies: boolean = true

    onMount(async () => {
        totalOfSpecies = await loadTotalOfSpecies()
        
        totalPages = computePagination(totalOfSpecies, itemsPerPage)
        currentPage = $page.url.searchParams.get('page') !== null ? $page.url.searchParams.get('page') : 1
        currentPage--

        listOfSpecies = await loadSpecies([], itemsPerPage, currentPage)
        loadingSpecies = false
    })

    async function loadSpecies(filters: Array<object> = [], limit: number = itemsPerPage, currentPage = currentPage): Promise<Array<Species>>{

        const speciesUseCase: SpeciesUseCase = new SpeciesUseCase()

        const listOfSpeciesFromHasura: Result = await speciesUseCase.getListOfSpecies(jwt.content, [], limit, currentPage*limit)
        console.log(listOfSpeciesFromHasura)

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

    async function loadTotalOfSpecies(): Promise<number>{
        const userUseCase: UserUseCase = new UserUseCase()
        const jwt: Result = userUseCase.getToken()

        const speciesUseCase: SpeciesUseCase = new SpeciesUseCase()
        const totalOfSpeciesFromHasura: Result = await speciesUseCase.getTotalSpecies(jwt.content)

        if (totalOfSpeciesFromHasura.isFailed()) {
            for (const error of totalOfSpeciesFromHasura.errors) {
                if (error.code === 401) {
                    userUseCase.logout()
                    return goto('/')
                }
            }

            return totalOfSpeciesFromHasura.content
        }

        return totalOfSpeciesFromHasura.content
    }

    function computePagination(totalSpecies: number, itemPerPages: number): number{
        return Math.ceil(totalSpecies/itemPerPages)
    }

    async function loadSpeciesWithFilters(itemsPerPage: number = itemsPerPage, newPage: number = 1){
        loadingSpecies = true
        currentPage = newPage - 1
        listOfSpecies = await loadSpecies([], itemsPerPage, currentPage)
        $page.url.searchParams.set('page', currentPage+'')
        window.history.replaceState({}, '',$page.url.pathname + $page.url.search)

        loadingSpecies = false
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

        <div class='flex-r space-x-3 my-6'>
            {#each Array(totalPages) as _, i}
                {#if i === currentPage}
                    <button disabled class='font-bold text-blue-500'>{i+1}</button>
                {:else}
                    <button on:click={e => loadSpeciesWithFilters(itemsPerPage, i+1)} class='text-blue-500'>{i+1}</button>
                {/if}
            {/each}
        </div>
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