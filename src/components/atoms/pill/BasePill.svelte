<script lang="ts">
    import type BasePillModel from "./BasePillModel";

    export let basePillModel: BasePillModel
</script>

<span class="pill pill-{basePillModel.style}">
    {basePillModel.content}
</span>