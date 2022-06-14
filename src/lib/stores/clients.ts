import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Client } from 'src/types';

export const clients: Writable<Client[]> = writable([]);

