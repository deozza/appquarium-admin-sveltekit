<script lang="ts" context="module">
    import BaseHeaderModel from "../components/atoms/typography/header/BaseHeaderModel";

    export const header: BaseHeaderModel = new BaseHeaderModel('Connexion').setDisplaySizeOrTrowError('xxxl')
</script>

<script lang="ts">
    import UserUseCase from "../app/user/useCases/UseCase";
    import Result from "../app/utils/useCasesResult/Result";
    import BaseHeader from "../components/atoms/typography/header/BaseHeader.svelte";

    export let email: string = ''
    export let password: string = ''

    async function login() {
        const userUseCase: UserUseCase = new UserUseCase()
        const user: Result = await userUseCase.login(email, password)

        if (user.isFailed()) {

        }
    }

</script>

<div class="flex items-center justify-center h-screen">
    <section class="min-w-[50%] min-h-[33%] flex flex-col justify-center items-center space-y-6 p-6 bg-white border-2 rounded-md border-black">
        <BaseHeader baseHeaderModel="{header}" />
        <form class="min-w-full" on:submit|preventDefault={login}>
            <ul class="space-y-6">
                <li class="flex flex-col justify-center  align-items-center">
                    <div class="flex flex-row justify-center justify-items-center align-items-center">
                        <label class="flex-1 py-2 px-3" for="email">Email</label>
                        <input class="border rounded-md border-black px-2" type="email" id="email" name="email" bind:value={email}>
                    </div>
                </li>
                <li class="flex flex-col justify-center  align-items-center">
                    <div class="flex flex-row justify-center justify-items-center align-items-center">
                        <label class="flex-1 py-2 px-3" for="password">Mot de passe</label>
                        <input class="border rounded-md border-black px-2" type="password" id="password" name="password" bind:value={password}>
                    </div>
                </li>

                <li class="flex flex-col justify-center align-items-center ">
                    <div class="flex flex-row justify-center justify-items-center align-items-center">
                        <button class="bg-green-500 text-white p-2 border rounded-md transition-colors duration-300 hover:bg-white hover:text-green-500 hover:border-green-500" type="submit">Se connecter</button>
                    </div>
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