<script lang="ts">
	import type BaseParagraphModel from './BaseParagraphModel';

	export let baseParagraphModel: BaseParagraphModel;
</script>

<p class="{baseParagraphModel.getDisplaySize()} {baseParagraphModel.getColor()}">
	{baseParagraphModel.getContent()}
</p>
