<script context="module" lang="ts">
	import UserUseCase from '../app/user/useCases/UseCase';
	import type Result from '../app/utils/useCasesResult/Result';
	import { browser } from '$app/env';

	export async function load({}) {
		const userUserCase: UserUseCase = new UserUseCase();
		const token: Result = userUserCase.getToken();

		if (browser && token.isSuccessful()) {
			return {
				redirect: '/admin',
				status: 302
			};
		}

		return {};
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';

	import {
		errorParagraph,
		formElements,
		header,
		pageStates
	} from '../components/pages/login/Modeles';

	import BaseHeader from '../components/atoms/typography/header/BaseHeader.svelte';
	import BaseParagraph from '../components/atoms/typography/paragraph/BaseParagraph.svelte';
	import BaseButton from '../components/atoms/button/BaseButton.svelte';
	import BaseTextInput from '../components/atoms/input/text/BaseTextInput.svelte';
	import BaseLabel from '../components/atoms/input/BaseLabel.svelte';

	export let currentPageState: string = pageStates['normal'];

	async function login() {
		formElements['emailInput'].error = false;
		formElements['passwordInput'].error = false;
		formElements['loginButton'].setLoading(true);
		formElements['loginButton'] = formElements['loginButton'];

		const userUseCase: UserUseCase = new UserUseCase();
		const user: Result = await userUseCase.login(
			formElements['emailInput'].value,
			formElements['passwordInput'].value
		);

		if (user.isSuccessful()) {
			formElements['loginButton'].setLoading(false);
			return goto('/admin');
		}

		if (user.errors[0].code === 404 || user.errors[0].code === 403) {
			formElements['emailInput'].error = true;
			formElements['passwordInput'].error = true;
			errorParagraph.setContent(currentPageState);
		}

		if (user.errors[0].code === 400) {
			currentPageState = pageStates['cookieFailed'];
			errorParagraph.setContent(currentPageState);
		}

		formElements['loginButton'].setLoading(false);
		formElements['loginButton'] = formElements['loginButton'];
	}
</script>

<div class="flex-c h-screen">
	<section
		class="min-w-[50%] min-h-[33%] flex-c space-y-6 p-6 bg-white border-2 rounded-md border-black"
	>
		<BaseHeader baseHeaderModel={header} />
		<form class="min-w-full" on:submit|preventDefault={login}>
			<ul class="space-y-6">
				<li class="flex-c">
					<div class="flex-r">
						<BaseLabel baseLabelModel={formElements['emailLabel']} />
						<BaseTextInput baseTextInputModel={formElements['emailInput']} />
					</div>
				</li>
				<li class="flex-c">
					<div class="flex-r">
						<BaseLabel baseLabelModel={formElements['passwordLabel']} />
						<BaseTextInput baseTextInputModel={formElements['passwordInput']} />
					</div>
				</li>
				<li class="flex-c space-y-2">
					<BaseButton baseButtonModel={formElements['loginButton']} />
					{#if currentPageState !== pageStates['normal']}
						<BaseParagraph baseParagraphModel={errorParagraph} />
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
