<script lang="ts">
	import type BaseHeaderModel from './BaseHeaderModel';
	import Theme from '../../../utils/Theme';

	export let baseHeaderModel: BaseHeaderModel;
</script>

{#if baseHeaderModel.getSize() === Theme.HEADER_SIZES()['h1']}
	<h1
		class="{baseHeaderModel.getDisplaySize()} {baseHeaderModel.getColor()} {baseHeaderModel.additionalClasses} font-bold my-6"
	>
		{baseHeaderModel.getContent()}
		<slot />
	</h1>
{:else if baseHeaderModel.getSize() === Theme.HEADER_SIZES()['h2']}
	<h2
		class="{baseHeaderModel.getDisplaySize()} {baseHeaderModel.getColor()} {baseHeaderModel.additionalClasses} font-bold my-5"
	>
		{baseHeaderModel.getContent()}
		<slot />
	</h2>
{:else if baseHeaderModel.getSize() === Theme.HEADER_SIZES()['h3']}
	<h3
		class="{baseHeaderModel.getDisplaySize()} {baseHeaderModel.getColor()} {baseHeaderModel.additionalClasses} font-bold my-4"
	>
		{baseHeaderModel.getContent()}
		<slot />
	</h3>
{:else if baseHeaderModel.getSize() === Theme.HEADER_SIZES()['h4']}
	<h4
		class="{baseHeaderModel.getDisplaySize()} {baseHeaderModel.getColor()} {baseHeaderModel.additionalClasses} font-bold my-3"
	>
		{baseHeaderModel.getContent()}
		<slot />
	</h4>
{:else if baseHeaderModel.getSize() === Theme.HEADER_SIZES()['h6']}
	<h5
		class="{baseHeaderModel.getDisplaySize()} {baseHeaderModel.getColor()} {baseHeaderModel.additionalClasses} font-bold my-2"
	>
		{baseHeaderModel.getContent()}
		<slot />
	</h5>
{:else}
	<h6
		class="{baseHeaderModel.getDisplaySize()} {baseHeaderModel.getColor()} {baseHeaderModel.additionalClasses} font-bold my-1"
	>
		{baseHeaderModel.getContent()}
		<slot />
	</h6>
{/if}
