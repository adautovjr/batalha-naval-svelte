import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { browser } from '$app/env';
import { USERNAME_KEY } from '../../types/storage';

let usernameFromStorage = ''

if (browser) {
  usernameFromStorage = localStorage.getItem(USERNAME_KEY) || ''
}

export const username: Writable<string> = writable(usernameFromStorage);

username.subscribe(value => {
  if (browser) {
    localStorage.setItem(USERNAME_KEY, value)
  }
})

