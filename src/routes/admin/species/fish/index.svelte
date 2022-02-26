<script lang="ts">
	import { header, addFishButton } from '../../../../components/pages/admin/fish/index/Modeles';
	import BaseHeader from '../../../../components/atoms/typography/header/BaseHeader.svelte';
	import BaseButton from '../../../../components/atoms/button/BaseButton.svelte';

	import type Species from '../../../../app/species/global/entities/Species';

	import UserUseCase from '../../../../app/user/useCases/UseCase';
	import FishUseCase from '../../../../app/species/fish/useCases/UseCase';
	import type Result from '../../../../app/utils/useCasesResult/Result';

	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let listOfFishes: Array<Species> = [];
	const userUseCase: UserUseCase = new UserUseCase();
	const jwt: Result = userUseCase.getToken();

	let totalOfSpecies: number = 0;
	let totalPages: number = 1;
	let itemsPerPage: number = 10;
	let currentPage: number = 1;

	let loadingFishes: boolean = true;

	onMount(async () => {
		totalOfSpecies = await loadTotalOfFishes();

		totalPages = computePagination(totalOfSpecies, itemsPerPage);
		currentPage =
			$page.url.searchParams.get('page') !== null
				? parseInt($page.url.searchParams.get('page'))
				: 1;
		currentPage--;

		listOfFishes = await loadFishes(null, itemsPerPage, currentPage);
		loadingFishes = false;
	});

	async function loadFishes(
		filters,
		limit: number = itemsPerPage,
		currentPageNumber = currentPage
	): Promise<Array<Species>> {
		const fishUseCase: FishUseCase = new FishUseCase();

		const listOfFishesResult: Result = await fishUseCase.getListOfFishes(
			jwt.content,
			[],
			limit,
			currentPageNumber * limit
		);

		if (listOfFishesResult.isFailed()) {
			for (const error of listOfFishesResult.errors) {
				if (error.code === 401) {
					userUseCase.logout();
					return goto('/');
				}
			}

			return listOfFishesResult.content;
		}

		return listOfFishesResult.content;
	}

	async function loadTotalOfFishes(): Promise<number> {
		const userUseCase: UserUseCase = new UserUseCase();
		const jwt: Result = userUseCase.getToken();

		const fishUseCase: FishUseCase = new FishUseCase();
		const totalOfFishesFromHasura: Result = await fishUseCase.getTotalOfFishes(jwt.content, []);

		if (totalOfFishesFromHasura.isFailed()) {
			for (const error of totalOfFishesFromHasura.errors) {
				if (error.code === 401) {
					userUseCase.logout();
					return goto('/');
				}
			}

			return totalOfFishesFromHasura.content;
		}

		return totalOfFishesFromHasura.content;
	}

	function computePagination(totalSpecies: number, itemPerPages: number): number {
		return Math.ceil(totalSpecies / itemPerPages);
	}

	async function loadFishesWithFilters(
		nbOfItemsPerPage: number = itemsPerPage,
		newPage: number = 1
	) {
		loadingFishes = true;
		currentPage = newPage - 1;
		listOfFishes = await loadFishes(null, nbOfItemsPerPage, currentPage);
		$page.url.searchParams.set('page', currentPage + '');
		window.history.replaceState({}, '', $page.url.pathname + $page.url.search);

		loadingFishes = false;
	}
</script>

<div class="flex-c" id="content">
	<BaseHeader baseHeaderModel={header} />
	{#if loadingFishes}
		<p>chargement</p>
	{:else}
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
				{#each listOfFishes as fish, i}
					<tr>
						<td>{i + 1}</td>
						<td>
							<a
								class="font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-300"
								href={fish.computeLinkToSpecies()}
								sveltekit:prefetch>{fish.computeName()}</a
							>
						</td>
						<td>{fish.getPublicationStateContent()}</td>
						<td
							>{fish.created_at.getDate() +
								'/' +
								fish.created_at.getMonth() +
								'/' +
								fish.created_at.getFullYear() +
								' ' +
								fish.created_at.getHours() +
								':' +
								fish.created_at.getMinutes()}</td
						>
						<td
							>{fish.updated_at.getDate() +
								'/' +
								fish.updated_at.getMonth() +
								'/' +
								fish.updated_at.getFullYear() +
								' ' +
								fish.updated_at.getHours() +
								':' +
								fish.updated_at.getMinutes()}</td
						>
					</tr>
				{/each}
			</tbody>
		</table>

		<div class="flex-r space-x-3 my-6">
			{#each Array(totalPages) as _, i}
				{#if i === currentPage}
					<button disabled class="font-bold text-blue-500">{i + 1}</button>
				{:else}
					<button on:click={() => loadFishesWithFilters(itemsPerPage, i + 1)} class="text-blue-500"
						>{i + 1}</button
					>
				{/if}
			{/each}
		</div>
	{/if}
	<a href="/admin/species/fish/add">
		<BaseButton baseButtonModel={addFishButton} />
	</a>
</div>

<style>
</style>
