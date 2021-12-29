<script lang="ts">
    import BaseHeaderModel from "../../../../components/atoms/typography/header/BaseHeaderModel";
    import BaseHeader from "../../../../components/atoms/typography/header/BaseHeader.svelte";
    import BaseButtonModel from "../../../../components/atoms/button/BaseButtonModel";
    import BaseButton from "../../../../components/atoms/button/BaseButton.svelte";
    import UserUseCase from "../../../../app/user/useCases/UseCase";

    const header: BaseHeaderModel = new BaseHeaderModel("Cette espèce n'existe pas.")
    const linkButton: BaseButtonModel = new BaseButtonModel("Retourner au dashboard")
    linkButton.setTypeOrThrowError('button')
        .setStyleOrThrowError('primary')

    let href: string = '/admin/species/invertebrate'

    const userUseCase: UserUseCase = new UserUseCase()
    if(userUseCase.getToken().isFailed()){
        href = "/login"
    }

</script>

<div class="flex-c h-screen">
    <span class="text-red-500 font-bold">404</span>
    <BaseHeader baseHeaderModel={header} />
    <a {href} class="pt-6">
        <BaseButton baseButtonModel={linkButton} />
    </a>
</div>