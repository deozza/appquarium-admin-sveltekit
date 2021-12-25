<script lang="ts">
    import {formElements} from "./Modeles";

    import BaseButton from "../../../atoms/button/BaseButton.svelte";
    import UseCase from "../../../../app/file/useCases/UseCase";
    import Result from "../../../../app/utils/useCasesResult/Result";
    import Species from "../../../../app/species/global/entities/Species";
    import UserUseCase from "../../../../app/user/useCases/UseCase";
    import BaseFileInput from "../../../atoms/input/file/BaseFileInput.svelte";
    import BaseLabel from "../../../atoms/input/BaseLabel.svelte";
    import BaseTextInput from "../../../atoms/input/text/BaseTextInput.svelte";

    export let species: Species = new Species([])

    async function uploadFile() {
        formElements.submitButton.setLoading(true)

        const fileUseCase: UseCase = new UseCase()
        const result: Result = await fileUseCase.uploadFile(formElements.newFileTitleInput.value, formElements.newFileSourceInput.value, '/species/' + species.uuid, formElements.newFileToUploadInput.value)

        if (result.isFailed()) {
            formElements.submitButton.setLoading(false)

            for (const error of result.errors) {
                if (error.code === 401) {
                    const userUseCase: UserUseCase = new UserUseCase()
                    userUseCase.logout()
                    return {
                        redirect: "/login",
                        status: 302
                    }
                }

                console.log(error)
            }
        }

        species.images = [...species.images, result.content]
        formElements.newFileToUploadInput.value = null
        formElements.newFileTitleInput.value = ''
        formElements.newFileSourceInput.value = ''
        formElements.submitButton.setLoading(false)
    }
</script>

<div class="min-w-full flex-r justify-start space-x-6 space-y-3">
    {#each species.images as image, index}
        <div class="flex-c">
            <img class="max-w-full h-48"  src={image.url} alt={image.alt}>
            <input type="text" value={image.alt} >

            <div class="w-full flex-r justify-around">
                <button>Modifier</button>
                <button >Supprimer</button>

            </div>
        </div>
    {/each}

    <div>
        <form on:submit|preventDefault={uploadFile}>
            <div class="flex-column">
                <ul>
                    <li class="flex-column">
                        <div class="flex-row input-row">
                            <BaseLabel baseLabelModel={formElements.newFileToUploadLabel} />
                            <BaseFileInput baseFileInputModel={formElements.newFileToUploadInput} />
                        </div>
                    </li>

                    <li class="flex-column">
                        <div class="flex-row input-row">
                            <BaseLabel baseLabelModel={formElements.newFileTitleLabel} />
                            <BaseTextInput baseTextInputModel={formElements.newFileTitleInput} />
                        </div>
                    </li>

                    <li class="flex-column">
                        <div class="flex-row input-row">
                            <BaseLabel baseLabelModel={formElements.newFileSourceLabel} />
                            <BaseTextInput baseTextInputModel={formElements.newFileSourceInput} />
                        </div>
                    </li>
                    <li class="flex-column">
                        <BaseButton baseButtonModel={formElements.submitButton}/>
                    </li>
                </ul>

            </div>
        </form>
    </div>
</div>