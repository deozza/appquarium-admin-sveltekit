import { browser } from "$app/env";

export async function initFirebase() {
    const firebaseConfig: object = {
        apiKey: import.meta.env['VITE_FIREBASE_API_KEY'],
        authDomain: import.meta.env['VITE_FIREBASE_AUTH_DOMAIN'],
        projectId: import.meta.env['VITE_FIREBASE_PROJECT_ID'],
        storageBucket: import.meta.env['VITE_FIREBASE_STORAGE_BUCKET'],
        messagingSenderId: import.meta.env['VITE_FIREBASE_MESSAGING_SENDER_ID'],
        appId: import.meta.env['VITE_FIREBASE_APP_ID'],
        measurementId: import.meta.env['VITE_FIREBASE_MEASUREMENT_ID'],
    }

    if (browser) {
        // You need to use firebase/app for the client side
        const fb: any = (await import("firebase/app")).default;
        await import("firebase/auth");
        await import("firebase/firestore");
        await import("firebase/storage");
        fb.initializeApp(firebaseConfig);
        return;
    }

    const fb: any = await import("firebase");
    if (fb.apps.length == 0) {
        fb.initializeApp(firebaseConfig);
        return;
    }
}