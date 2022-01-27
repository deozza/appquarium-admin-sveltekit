<script context="module" lang="ts">

    import UserUseCase from "../../app/user/useCases/UseCase";
    import Result from "../../app/utils/useCasesResult/Result";
    import {browser} from "$app/env";

    export async function load({}) {
        const userUserCase: UserUseCase = new UserUseCase()
        const token: Result = userUserCase.getToken()

        if (browser && token.isFailed()) {
            return {
                redirect: '/',
                status: 302
            }
        }

        return {}
    }

</script>

<script lang="ts">

    import "../../app.css";

    import {goto} from '$app/navigation';

    import BaseButtonModel from "../../components/atoms/button/BaseButtonModel";
    import BaseButton from "../../components/atoms/button/BaseButton.svelte";

    const logoutButton: BaseButtonModel = new BaseButtonModel('Déconnexion')
        .setStyleOrThrowError('danger')
        .setTypeOrThrowError('button')

    function logout() {
        const userUseCase: UserUseCase = new UserUseCase()
        const isLoggedOut: Result = userUseCase.logout()

        if (isLoggedOut.isFailed()) {
            console.log('problem')
            return
        }

        return goto('/')

    }

</script>
<main class="relative min-h-screen bg-gray-200 flex">
    <nav class="z-10 static w-1/5 bg-white border-r-2 border-black ">
        <div class="flex-c items-start p-10 space-y-6 text-2xl">
            <a href="/">Accueil</a>
            <button>Espèces</button>
            <div class="flex-c items-start text-xl space-y-3 pl-3">
                <a href="/admin/species">Voir toutes</a>
                <a href="/admin/species/fish">Poissons</a>
                <a href="/admin/species/plant">Plantes</a>
                <a href="/admin/species/invertebrate">Invertébrés</a>
            </div>
            <BaseButton baseButtonModel={logoutButton} on:click={logout}/>
        </div>
    </nav>
    <div class="p-10 w-full">
        <slot></slot>
    </div>
</main>
