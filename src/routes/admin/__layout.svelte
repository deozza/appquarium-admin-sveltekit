<script context="module" lang="ts">

    import UserUseCase from "../../app/user/useCases/UseCase";
    import Result from "../../app/utils/useCasesResult/Result";

    export async function load({}){
        const userUserCase: UserUseCase = new UserUseCase()

        const user: Result = userUserCase.getToken()

        if(user.isFailed()){
            return {
                redirect: '/login',
                status: 302
            }
        }
    }
</script>

<script lang="ts">

    import "../../app.css";

</script>

<main class="bg-gray-200 min-w-max min-h-screen ">
    <slot></slot>
</main>
