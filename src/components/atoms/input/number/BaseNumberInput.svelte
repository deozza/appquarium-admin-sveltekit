<script lang="ts">
    import BaseNumberInputModel from "./BaseNumberInputModel";

    export let baseNumberInputModel: BaseNumberInputModel

    function handleInput(e) {
        baseNumberInputModel.value = e.target.value;
    }
</script>

<div>
    <input
            class="w-full py-2 px-3 border rounded-md border-black px-2"
            class:border-red-500={baseNumberInputModel.error === true}
            class:text-red-500={baseNumberInputModel.error === true}
            type="number"
            id={baseNumberInputModel.id}
            name={baseNumberInputModel.name}
            value={baseNumberInputModel.value}
            placeholder={baseNumberInputModel.placeholder}
            min={baseNumberInputModel.min}
            max={baseNumberInputModel.max}
            step={baseNumberInputModel.step}
            required={baseNumberInputModel.required === true ? 'required' : ''}
            readonly={baseNumberInputModel.readonly === true ? 'readonly' : ''}
            on:input={handleInput}
            on:change
            on:focusout
    >

    {#if baseNumberInputModel.error}
        <span class="text-red-500">{baseNumberInputModel.errorMessage}</span>
    {/if}
</div>

<style>
div  {
    flex: 2
}
</style>