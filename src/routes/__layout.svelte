<script context="module" lang="ts">
    import { initFirebase } from "../app/adapters/firebase/initFirebase";

    export async function load({ page, fetch, session, context }) {
        await initFirebase();
        return {
            props: {},
        };
    }
</script>

<script lang="ts">

    import "../app.css";

</script>

<slot></slot>