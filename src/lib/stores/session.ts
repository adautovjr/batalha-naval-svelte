import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { browser } from '$app/env';
import { SESSION_KEY } from '../../types/storage';

let sessionFromStorage = ''

if (browser) {
  sessionFromStorage = localStorage.getItem(SESSION_KEY) || ''
}

export const session: Writable<string> = writable(sessionFromStorage);

session.subscribe(value => {
  if (browser) {
    localStorage.setItem(SESSION_KEY, value)
  }
})