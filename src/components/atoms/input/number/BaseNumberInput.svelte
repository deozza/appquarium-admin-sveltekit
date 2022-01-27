<script lang='ts'>
    import BaseNumberInputModel from "./BaseNumberInputModel";

    export let baseNumberInputModel: BaseNumberInputModel

</script>

<div>
    <input
      className='w-full py-2 px-3 border rounded-md border-black px-2'
      class:border-red-500={baseNumberInputModel.error === true}
      class:text-red-500={baseNumberInputModel.error === true}
      id={baseNumberInputModel.id}
      max={baseNumberInputModel.max}
      min={baseNumberInputModel.min}
      name={baseNumberInputModel.name}
      on:change
      on:focusout
      placeholder={baseNumberInputModel.placeholder}
      readOnly={baseNumberInputModel.readonly === true ? 'readonly' : ''}
      required={baseNumberInputModel.required === true ? 'required' : ''}
      step={baseNumberInputModel.step}
      type='number'
      bind:value={baseNumberInputModel.value}
    >

    {#if baseNumberInputModel.error}
        <span className='text-red-500'>{baseNumberInputModel.errorMessage}</span>
    {/if}
</div>

<style>
    div {
        flex: 2
    }
</style>