<script context="module" lang="ts">
    import SpeciesUseCase from "../app/species/global/useCases/UseCase";
    import Result from "../app/utils/useCasesResult/Result";

    const speciesUseCase: SpeciesUseCase = new SpeciesUseCase()
    const jwt: string = ''
    export async function load(){
        const listOfSpecies: Result = await speciesUseCase.getListOfSpecies(jwt)

        if(listOfSpecies.isFailed()){
            console.log('error : ')
            console.log(listOfSpecies.errors)
            return
        }

        console.log(listOfSpecies)

        return{
            props: {
                listOfSpecies
            }
        }
    }
</script>

<script lang="ts">
    export let listOfSpecies
</script>

{#each listOfSpecies.content as species}
<pre>
    {species.species_naming.name}
</pre>

{/each}
