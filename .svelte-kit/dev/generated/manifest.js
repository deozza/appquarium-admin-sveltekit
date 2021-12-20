const c = [
	() => import("../../../src/routes/__layout.svelte"),
	() => import("../components/error.svelte"),
	() => import("../../../src/routes/admin/__layout.reset.svelte"),
	() => import("../../../src/routes/admin/index.svelte"),
	() => import("../../../src/routes/admin/species/index.svelte"),
	() => import("../../../src/routes/admin/species/invertebrates/index.svelte"),
	() => import("../../../src/routes/admin/species/invertebrates/[uuid].svelte"),
	() => import("../../../src/routes/admin/species/fishes/index.svelte"),
	() => import("../../../src/routes/admin/species/fishes/add.svelte"),
	() => import("../../../src/routes/admin/species/fishes/[uuid].svelte"),
	() => import("../../../src/routes/admin/species/plants/index.svelte"),
	() => import("../../../src/routes/admin/species/plants/[uuid].svelte"),
	() => import("../../../src/routes/login.svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/admin/index.svelte
	[/^\/admin\/?$/, [c[2], c[3]], []],

	// src/routes/admin/species/index.svelte
	[/^\/admin\/species\/?$/, [c[2], c[4]], []],

	// src/routes/admin/species/invertebrates/index.svelte
	[/^\/admin\/species\/invertebrates\/?$/, [c[2], c[5]], []],

	// src/routes/admin/species/invertebrates/[uuid].svelte
	[/^\/admin\/species\/invertebrates\/([^/]+?)\/?$/, [c[2], c[6]], [], (m) => ({ uuid: d(m[1])})],

	// src/routes/admin/species/fishes/index.svelte
	[/^\/admin\/species\/fishes\/?$/, [c[2], c[7]], []],

	// src/routes/admin/species/fishes/add.svelte
	[/^\/admin\/species\/fishes\/add\/?$/, [c[2], c[8]], []],

	// src/routes/admin/species/fishes/[uuid].svelte
	[/^\/admin\/species\/fishes\/([^/]+?)\/?$/, [c[2], c[9]], [], (m) => ({ uuid: d(m[1])})],

	// src/routes/admin/species/plants/index.svelte
	[/^\/admin\/species\/plants\/?$/, [c[2], c[10]], []],

	// src/routes/admin/species/plants/[uuid].svelte
	[/^\/admin\/species\/plants\/([^/]+?)\/?$/, [c[2], c[11]], [], (m) => ({ uuid: d(m[1])})],

	// src/routes/login.svelte
	[/^\/login\/?$/, [c[0], c[12]], [c[1]]]
];

// we import the root layout/error components eagerly, so that
// connectivity errors after initialisation don't nuke the app
export const fallback = [c[0](), c[1]()];