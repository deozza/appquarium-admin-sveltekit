<script lang="ts">
	import type BaseButtonModel from './BaseButtonModel';

	export let baseButtonModel: BaseButtonModel;
	$: isDisabled = baseButtonModel.isDisabled;
</script>

<button
	class="btn btn-{baseButtonModel.style}"
	class:btn-outlined={baseButtonModel.isOutlined === true}
	class:disabled:opacity-50={baseButtonModel.isDisabled === true}
	class:pointer-events-none={baseButtonModel.isDisabled === true}
	disabled={isDisabled}
	on:click
	type={baseButtonModel.type}
>
	{baseButtonModel.content}
</button>
