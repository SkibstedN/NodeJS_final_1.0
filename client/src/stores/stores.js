import { readable, writable } from "svelte/store";

export const serverURL = readable("http://localhost:5000");

export const session = writable(null);