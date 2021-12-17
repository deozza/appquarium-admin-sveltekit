<script lang="ts">
    import BaseTextInputModel from "./BaseTextInputModel";
    export let baseTextInputModel: BaseTextInputModel

    function handleInput(e) {
        baseTextInputModel.value = e.target.value;
    }
</script>

<div>
    <input
            class="w-full py-2 px-3 border rounded-md border-black px-2"
            class:border-red-500={baseTextInputModel.error === true}
            class:text-red-500={baseTextInputModel.error === true}
            type={baseTextInputModel.type}
            id={baseTextInputModel.id}
            name={baseTextInputModel.name}
            value={baseTextInputModel.value}
            placeholder={baseTextInputModel.placeholder}
            minlength={baseTextInputModel.minlength}
            maxlength={baseTextInputModel.maxlength}
            required={baseTextInputModel.required === true ? 'required' : ''}
            readonly={baseTextInputModel.readonly === true ? 'readonly' : ''}
            on:input={handleInput}
    >

    {#if baseTextInputModel.error}
        <span class="text-red-500">{baseTextInputModel.errorMessage}</span>
    {/if}
</div>

<style>
div  {
    flex: 2
}
</style>