<script lang="ts" context="module">
    import Result from "../../../../app/utils/useCasesResult/Result";
    import UserUseCase from "../../../../app/user/useCases/UseCase";
    import SpeciesUseCase from "../../../../app/species/global/useCases/UseCase";

    /**
     * @type {import('@sveltejs/kit').Load}
     */
    export async function load({page}){
        const userUseCase: UserUseCase = new UserUseCase()

        const jwt: Result = userUseCase.getToken()

        const speciesUseCase: SpeciesUseCase = new SpeciesUseCase()

        const species: Result = await speciesUseCase.getSpecies(jwt.content, page.params.uuid)

        if(species.isFailed()){
            return {
                redirect: '/admin/species',
                status: 302
            }
        }

        return {
            props: {
                species: species.content
            }
        }
    }
</script>

<script lang="ts">
    import Species from "../../../../app/species/global/entities/Species";
    import BaseHeaderModel from "../../../../components/atoms/typography/header/BaseHeaderModel";
    import BaseHeader from "../../../../components/atoms/typography/header/BaseHeader.svelte";

    export let species: Species = new Species([])
    export let header: BaseHeaderModel = new BaseHeaderModel(species.computeName())
        .setDisplaySizeOrTrowError('xxxl')
        .setSizeOrTrowError('h1')
</script>

<div class="flex-c">
    <section>
        <BaseHeader baseHeaderModel={header} />
    </section>
</div>