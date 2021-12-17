const c = [
	() => import("../../../src/routes/__layout.svelte"),
	() => import("../components/error.svelte"),
	() => import("../../../src/routes/admin/__layout.reset.svelte"),
	() => import("../../../src/routes/admin/index.svelte"),
	() => import("../../../src/routes/admin/species/index.svelte"),
	() => import("../../../src/routes/admin/species/invertebrate/index.svelte"),
	() => import("../../../src/routes/admin/species/invertebrate/[uuid].svelte"),
	() => import("../../../src/routes/admin/species/plant/index.svelte"),
	() => import("../../../src/routes/admin/species/plant/[uuid].svelte"),
	() => import("../../../src/routes/admin/species/fish/index.svelte"),
	() => import("../../../src/routes/admin/species/fish/[uuid].svelte"),
	() => import("../../../src/routes/login.svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/admin/index.svelte
	[/^\/admin\/?$/, [c[2], c[3]], []],

	// src/routes/admin/species/index.svelte
	[/^\/admin\/species\/?$/, [c[2], c[4]], []],

	// src/routes/admin/species/invertebrate/index.svelte
	[/^\/admin\/species\/invertebrate\/?$/, [c[2], c[5]], []],

	// src/routes/admin/species/invertebrate/[uuid].svelte
	[/^\/admin\/species\/invertebrate\/([^/]+?)\/?$/, [c[2], c[6]], [], (m) => ({ uuid: d(m[1])})],

	// src/routes/admin/species/plant/index.svelte
	[/^\/admin\/species\/plant\/?$/, [c[2], c[7]], []],

	// src/routes/admin/species/plant/[uuid].svelte
	[/^\/admin\/species\/plant\/([^/]+?)\/?$/, [c[2], c[8]], [], (m) => ({ uuid: d(m[1])})],

	// src/routes/admin/species/fish/index.svelte
	[/^\/admin\/species\/fish\/?$/, [c[2], c[9]], []],

	// src/routes/admin/species/fish/[uuid].svelte
	[/^\/admin\/species\/fish\/([^/]+?)\/?$/, [c[2], c[10]], [], (m) => ({ uuid: d(m[1])})],

	// src/routes/login.svelte
	[/^\/login\/?$/, [c[0], c[11]], [c[1]]]
];

// we import the root layout/error components eagerly, so that
// connectivity errors after initialisation don't nuke the app
export const fallback = [c[0](), c[1]()];