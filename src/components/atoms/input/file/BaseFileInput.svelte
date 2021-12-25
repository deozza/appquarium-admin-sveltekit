<script lang="ts">
    import BaseFileInputModel from "./BaseFileInputModel";

    export let baseFileInputModel: BaseFileInputModel
    function handleInput(e) {
        baseFileInputModel.value = e.target.files[0];
    }
</script>

<div>
    <input
            class="w-full py-2 px-3"
            class:border-red-500={baseFileInputModel.error === true}
            class:text-red-500={baseFileInputModel.error === true}
            type="file"
            id={baseFileInputModel.id}
            name={baseFileInputModel.name}
            required={baseFileInputModel.required === true ? 'required' : ''}
            readonly={baseFileInputModel.readonly === true ? 'readonly' : ''}
            accept={baseFileInputModel.accept.join(',')}
            on:change={handleInput}
    >

    {#if baseFileInputModel.error}
        <span class="text-red-500">{baseFileInputModel.errorMessage}</span>
    {/if}
</div>

<style>
div  {
    flex: 2
}
</style>