<script lang="ts">
    import {formElements} from "./Modeles";

    import BaseButton from "../../../atoms/button/BaseButton.svelte";
    import SpeciesUseCase from "../../../../app/species/global/useCases/UseCase";
    import Result from "../../../../app/utils/useCasesResult/Result";
    import Species from "../../../../app/species/global/entities/Species";
    import UserUseCase from "../../../../app/user/useCases/UseCase";
    import BaseFileInput from "../../../atoms/input/file/BaseFileInput.svelte";
    import BaseLabel from "../../../atoms/input/BaseLabel.svelte";
    import BaseTextInput from "../../../atoms/input/text/BaseTextInput.svelte";
    import Image from "../../../../app/file/entities/Image";
    import User from "../../../../app/user/entities/User";
    import UseCase from "../../../../app/file/useCases/UseCase";

    export let species: Species = new Species([])

    export let thumbnailHasBeenUpdated: boolean = false

    async function uploadFile() {
        formElements.submitButton.setLoading(true)
        const userUseCase: UserUseCase = new UserUseCase()

        const jwt: string = userUseCase.getToken().content
        const user: User = new User(jwt)
        user.extractUserInfoFromJwt()

        const image: Image = new Image([])
        image.title = formElements.newFileTitleInput.value
        image.source = formElements.newFileSourceInput.value
        image.file = formElements.newFileToUploadInput.value
        image.user = user.uid
        image.associated_to = species.uuid

        const speciesUseCase: SpeciesUseCase = new SpeciesUseCase()
        const result: Result = await speciesUseCase.addFile(jwt, species, image)

        if (result.isFailed()) {
            formElements.submitButton.setLoading(false)

            for (const error of result.errors) {
                if (error.code === 401) {
                    userUseCase.logout()
                    return {
                        redirect: "/login",
                        status: 302
                    }
                }

                console.log(error)
            }
            return
        }

        species.images = [...species.images, result.content]
        formElements.newFileToUploadInput.value = null
        formElements.newFileTitleInput.value = ''
        formElements.newFileSourceInput.value = ''
        formElements.submitButton.setLoading(false)
    }

    async function deleteFile(image: Image) {
        const userUseCase: UserUseCase = new UserUseCase()

        const jwt: string = userUseCase.getToken().content

        const fileUseCase: UseCase = new UseCase()
        const result: Result = await fileUseCase.deleteFile(jwt, image)

        if (result.isFailed()) {
            for (const error of result.errors) {
                if (error.code === 401) {
                    userUseCase.logout()
                    return {
                        redirect: "/login",
                        status: 302
                    }
                }

                console.log(error)
            }
            return
        }

        species.images = species.images.filter((speciesImage: Image) => speciesImage.url !== image.url)
    }

    async function editFileMetadata(image: Image) {
        const userUseCase: UserUseCase = new UserUseCase()
        const jwt: string = userUseCase.getToken().content

        const fileUseCase: UseCase = new UseCase()
        const result: Result = await fileUseCase.editFileMetadata(jwt, image, thumbnailHasBeenUpdated)

        if (result.isFailed()) {
            for (const error of result.errors) {
                if (error.code === 401) {
                    userUseCase.logout()
                    return {
                        redirect: "/login",
                        status: 302
                    }
                }

                console.log(error)
            }
            return
        }

    }
</script>

<div class="min-w-full flex-r justify-start space-x-6 space-y-3">
    {#each species.images as image, index}
        <div class="flex-c">
            <ul>
                <li class="flex-c">
                    <div class="flex-r">
                        <img class="max-w-full h-48" src={image.url} alt={image.title}>
                    </div>
                </li>
                <li class="flex-c">
                    <div class="flex-r">
                        <BaseLabel baseLabelModel={formElements.updateFileTitleLabel}/>
                        <input type="text" bind:value={image.title} id="updateFileTitleLabel">
                    </div>
                </li>

                <li class="flex-c">
                    <div class="flex-r">
                        <BaseLabel baseLabelModel={formElements.updateFileThumbnailLabel}/>
                        <input type="checkbox" bind:checked={image.thumbnail} on:change={thumbnailHasBeenUpdated = true} id="updateFileThumbnailLabel">
                    </div>
                </li>
                <li class="flex-c">
                    <div class="w-full flex-r justify-around">
                        <BaseButton baseButtonModel={formElements.updateButton} on:click={editFileMetadata(image)}/>
                        <BaseButton baseButtonModel={formElements.deleteButton} on:click={deleteFile(image)}/>

                    </div>
                </li>
            </ul>
        </div>
    {/each}

    <div>
        <form on:submit|preventDefault={uploadFile}>
            <div class="flex-c">
                <ul>
                    <li class="flex-c">
                        <div class="flex-r">
                            <BaseLabel baseLabelModel={formElements.newFileToUploadLabel}/>
                            <BaseFileInput baseFileInputModel={formElements.newFileToUploadInput}/>
                        </div>
                    </li>

                    <li class="flex-c">
                        <div class="flex-r">
                            <BaseLabel baseLabelModel={formElements.newFileTitleLabel}/>
                            <BaseTextInput baseTextInputModel={formElements.newFileTitleInput}/>
                        </div>
                    </li>

                    <li class="flex-c">
                        <div class="flex-r">
                            <BaseLabel baseLabelModel={formElements.newFileSourceLabel}/>
                            <BaseTextInput baseTextInputModel={formElements.newFileSourceInput}/>
                        </div>
                    </li>
                    <li class="flex-c">
                        <BaseButton baseButtonModel={formElements.submitButton}/>
                    </li>
                </ul>

            </div>
        </form>
    </div>
</div>