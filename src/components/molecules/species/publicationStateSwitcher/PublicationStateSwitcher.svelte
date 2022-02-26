<script lang="ts">
    import {possibleNextStates} from "./Modele";
    import BaseButton from "../../../atoms/button/BaseButton.svelte";

    import Species from "../../../../app/species/global/entities/Species";
    import User from "../../../../app/user/entities/User";

    import SpeciesUseCase from "../../../../app/species/global/useCases/UseCase";
    import UserUseCase from "../../../../app/user/useCases/UseCase";
    import type Result from "../../../../app/utils/useCasesResult/Result";

    import {goto} from '$app/navigation';

    export let species: Species = new Species([])
    export let user: User = new User('')
    let isLoading: boolean = false

    async function editPublicationState(newState: string) {
        isLoading = true

        const speciesUseCase: SpeciesUseCase = new SpeciesUseCase()

        let result: Result

        if(newState !== 'DELETE'){
            result = await speciesUseCase.updatePublicationState(user.jwt, species, newState)
        }else{
            result = await speciesUseCase.deleteSpecies(user.jwt, species)
        }

        if (result.isFailed()) {

            for (const error of result.errors) {
                console.log(error)

                if (error.code === 401) {
                    const userUseCase: UserUseCase = new UserUseCase()
                    userUseCase.logout()
                    return goto('/admin')

                }
            }
            isLoading = false
            return
        }

        if(newState === 'DELETE'){
            return goto('/admin/species/'+species.category)
        }

        isLoading = false
        species.publication_state = result.content
    }

</script>

<div class="flex-r space-x-6">
    {#if isLoading === false}
        {#each possibleNextStates[species.publication_state] as button}
            <BaseButton baseButtonModel={button} on:click={() => editPublicationState(button.event)}/>
        {/each}
    {:else}
        <p>chargement ...</p>
    {/if}
</div>