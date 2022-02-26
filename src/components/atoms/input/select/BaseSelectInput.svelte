<script lang="ts">
	import type BaseSelectInputModel from '../select/BaseSelectInputModel';
	import type BaseOptionModel from './BaseOptionModel';

	export let baseSelectInputModel: BaseSelectInputModel;
	export let options: Array<BaseOptionModel>;
</script>

<div>
	<select
		class="w-full py-2 px-3 border rounded-md border-black px-2 text-black"
		class:border-red-500={baseSelectInputModel.error === true}
		class:text-red-500={baseSelectInputModel.error === true}
		id={baseSelectInputModel.id}
		name={baseSelectInputModel.name}
		bind:value={baseSelectInputModel.value}
		on:change
		on:focusout
		readonly={baseSelectInputModel.readonly}
		required={baseSelectInputModel.required}
	>
		<option value="" />
		{#each options as option}
			<option value={option.value}>
				{option.name}
			</option>
		{/each}
	</select>

	{#if baseSelectInputModel.error}
		<span class="text-red-500">{baseSelectInputModel.errorMessage}</span>
	{/if}
</div>

<style>
	div {
		flex: 2;
	}
</style>
