<script lang="ts" context="module">
    import BaseHeaderModel from "../components/atoms/typography/header/BaseHeaderModel";
    import BaseParagraphModel from "../components/atoms/typography/paragraph/BaseParagraphModel";
    import BaseParagraph from "../components/atoms/typography/paragraph/BaseParagraph.svelte";
    import BaseHeader from "../components/atoms/typography/header/BaseHeader.svelte";
    import BaseButton from "../components/atoms/button/BaseButton.svelte";

    export const header: BaseHeaderModel = new BaseHeaderModel('Connexion').setDisplaySizeOrTrowError('xxxl')

    export const errorParagraph: BaseParagraphModel = new BaseParagraphModel("")
        .setColorOrTrowError('danger')

    export const pageStates: object = {
        'normal': '',
        'loginFailed': "L'email ou le mot de passe est invalide.",
        'cookieFailed': "Une erreur est survenue, veuillez réessayer plus tard"
    }

</script>

<script lang="ts">
    import {goto} from '$app/navigation';

    import BaseButtonModel from "../components/atoms/button/BaseButtonModel";
    import BaseTextInputModel from "../components/atoms/input/text/BaseTextInputModel";
    import BaseTextInput from "../components/atoms/input/text/BaseTextInput.svelte";
    import BaseLabelModel from "../components/atoms/input/BaseLabelModel";
    import BaseLabel from "../components/atoms/input/BaseLabel.svelte";

    import UserUseCase from "../app/user/useCases/UseCase";
    import Result from "../app/utils/useCasesResult/Result";


    export const emailLabel: BaseLabelModel = new BaseLabelModel('Email', 'email')
    export let email: BaseTextInputModel = new BaseTextInputModel('email')
    email.type = 'email'
    email.required = true
    email.minlength = 6
    email.errorMessage = "L'email est invalide"

    export const passwordLabel: BaseLabelModel = new BaseLabelModel('Mot de passe', 'password')
    export let password: BaseTextInputModel = new BaseTextInputModel('password')
    password.type = 'password'
    password.required = true
    password.minlength = 6
    password.errorMessage = "Le mot de passe est invalide"

    export let submitButton: BaseButtonModel = new BaseButtonModel('Se connecter')
        .setStyleOrThrowError('success')

    export let currentPageState: string = pageStates.normal

    async function login() {
        email.error = false
        password.error = false
        submitButton.setLoading(true)
        submitButton = submitButton

        const userUseCase: UserUseCase = new UserUseCase()
        const user: Result = await userUseCase.login(email.value, password.value)

        if (user.isSuccessful()) {
            return goto('/')
        }

        if (user.errors[0].code === 404) {
            email.error = true
            password.error = true
            errorParagraph.setContent(currentPageState)
        }

        if (user.errors[0].code === 400) {
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
                        <BaseLabel baseLabelModel="{emailLabel}" />
                        <BaseTextInput baseTextInputModel="{email}" />
                    </div>
                </li>
                <li class="flex-c">
                    <div class="flex-r">
                        <BaseLabel baseLabelModel="{passwordLabel}" />
                        <BaseTextInput baseTextInputModel="{password}" />
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

</style>