<script lang="ts">
    import { createEventDispatcher } from 'svelte'

    export let totalPages: number = 1
    export let currentPage: number = 1

	const dispatch = createEventDispatcher()

	function moveToPage(newPage: number) {
		dispatch('change_page', {
			page: newPage
		})
	}
</script>

<div class="flex-r space-x-3 my-6">
    {#each Array(totalPages) as _, i}
        {#if i === currentPage}
            <button disabled class="font-bold text-blue-500">{i + 1}</button>
        {:else}
            <button on:click={() => moveToPage(i+1)} class="text-blue-500"
                >{i + 1}</button
            >
        {/if}
    {/each}
</div>