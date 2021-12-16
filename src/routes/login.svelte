<script lang="ts" context="module">
    import BaseHeaderModel from "../components/atoms/typography/header/BaseHeaderModel";
    import BaseParagraphModel from "../components/atoms/typography/paragraph/BaseParagraphModel";
    import BaseParagraph from "../components/atoms/typography/paragraph/BaseParagraph.svelte";
    import BaseHeader from "../components/atoms/typography/header/BaseHeader.svelte";

    export const header: BaseHeaderModel = new BaseHeaderModel('Connexion').setDisplaySizeOrTrowError('xxxl')

    export const errorParagraph: BaseParagraphModel = new BaseParagraphModel("")
        .setColorOrTrowError('danger')
</script>

<script lang="ts">
    import {goto} from '$app/navigation';

    import BaseButton from "../components/atoms/button/BaseButton.svelte";
    import BaseButtonModel from "../components/atoms/button/BaseButtonModel";

    import UserUseCase from "../app/user/useCases/UseCase";
    import Result from "../app/utils/useCasesResult/Result";

    export let email: string = ''
    export let password: string = ''

    export let submitButton: BaseButtonModel = new BaseButtonModel('Se connecter')
        .setStyleOrThrowError('success')

    export const pageStates: object = {
        'normal': '',
        'loginFailed': "L'email ou le mot de passe est invalide.",
        'cookieFailed': "Une erreur est survenue, veuillez réessayer plus tard"
    }

    export let currentPageState: string = pageStates.normal

    async function login() {
        currentPageState = pageStates.normal
        submitButton.setLoading(true)
        submitButton = submitButton

        const userUseCase: UserUseCase = new UserUseCase()
        const user: Result = await userUseCase.login(email, password)

        if(user.isSuccessful()){
            return goto('/')
        }

        if(user.errors[0].code === 404){
            currentPageState = pageStates.loginFailed
            errorParagraph.setContent(currentPageState)
        }

        if(user.errors[0].code === 400){
            currentPageState = pageStates.cookieFailed
            errorParagraph.setContent(currentPageState)
        }

        submitButton.setLoading(false)
        submitButton = submitButton
    }

</script>

<div class="flex-c h-screen">
    <section class="min-w-[50%] min-h-[33%] flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black">
        <BaseHeader baseHeaderModel="{header}" />
        <form class="min-w-full" on:submit|preventDefault={login}>
            <ul class="space-y-6">
                <li class="flex-c">
                    <div class="flex-r">
                        <label class="flex-1 py-2 px-3" for="email">Email</label>
                        <input class="border rounded-md border-black px-2" type="email" id="email" name="email" bind:value={email} required>
                    </div>
                </li>
                <li class="flex-c">
                    <div class="flex-r">
                        <label class="flex-1 py-2 px-3" for="password">Mot de passe</label>
                        <input class="border rounded-md border-black px-2" type="password" id="password" name="password" bind:value={password} required>
                    </div>
                </li>
                <li class="flex-c space-y-2">
                    <BaseButton baseButtonModel="{submitButton}" />
                    {#if currentPageState !== pageStates.normal }
                        <BaseParagraph baseParagraphModel="{errorParagraph}" />
                    {/if}
                </li>
            </ul>
        </form>
    </section>
</div>

<style>

    li > div {
        padding: 0.5em;
        align-items: normal;
        width: 98%;
    }

    li > div > input {
        flex: 2;
    }

</style>