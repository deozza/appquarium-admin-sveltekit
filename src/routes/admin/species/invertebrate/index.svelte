<script context="module" lang="ts">
    import Result from "../../../../app/utils/useCasesResult/Result";
    import UserUseCase from "../../../../app/user/useCases/UseCase";
    import InvertebrateUseCase from "../../../../app/species/invertebrate/useCases/UseCase";

    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load() {
        const userUseCase: UserUseCase = new UserUseCase()

        const jwt: Result = userUseCase.getToken()

        const invertebrateUseCase: InvertebrateUseCase = new InvertebrateUseCase()

        const listOfInvertebrates: Result = await invertebrateUseCase.getListOfInvertebrates(jwt.content)

        if (listOfInvertebrates.isFailed()) {
            for (const error of listOfInvertebrates.errors) {
                if (error.code === 401) {
                    userUseCase.logout()
                    return {
                        redirect: '/login',
                        status: 302
                    }
                }
            }

            return {
                props: {
                    listOfInvertebrates: []
                }
            }
        }
        return {
            props: {
                listOfInvertebrates: listOfInvertebrates.content
            }
        }
    }
</script>

<script lang="ts">
    import {header, addInvertebrateButton} from "../../../../components/pages/admin/invertebrate/index/Modeles";

    import BaseHeader from "../../../../components/atoms/typography/header/BaseHeader.svelte";
    import Species from "../../../../app/species/global/entities/Species";
    import BaseButton from "../../../../components/atoms/button/BaseButton.svelte";

    export let listOfInvertebrates: Array<Species> = []

</script>


<div class="flex-c" id="content">
    <BaseHeader baseHeaderModel={header}/>

    <template slot="body">
        <table class="table-auto">
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Nom scientifique</th>
                <th scope="col">Etat</th>
                <th scope="col">Créé le</th>
                <th scope="col">Modifié le</th>
            </tr>
            </thead>
            <tbody>
            {#each listOfInvertebrates as invertebrate, i}
                <tr>
                    <td>{i + 1}</td>
                    <td>
                        <a class="font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-300"
                           href={invertebrate.computeLinkToSpecies()}
                           sveltekit:prefetch>{invertebrate.computeName()}</a>
                    </td>
                    <td>{invertebrate.getPublicationStateContent()}</td>
                    <td>{invertebrate.created_at.getDate() + '/' + invertebrate.created_at.getMonth() + '/' + invertebrate.created_at.getFullYear() + ' ' + invertebrate.created_at.getHours() + ':' + invertebrate.created_at.getMinutes()}</td>
                    <td>{invertebrate.updated_at.getDate() + '/' + invertebrate.updated_at.getMonth() + '/' + invertebrate.updated_at.getFullYear() + ' ' + invertebrate.updated_at.getHours() + ':' + invertebrate.updated_at.getMinutes()}</td>
                </tr>
            {/each}
            </tbody>
        </table>
    </template>


    <a href="/admin/species/invertebrate/add">
        <BaseButton baseButtonModel={addInvertebrateButton}/>
    </a>
</div>

<style>
</style>