import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { browser } from '$app/env';
import { UUID_KEY } from '../../types/storage';

let userFromStorage = ''

if (browser) {
  userFromStorage = localStorage.getItem(UUID_KEY) || ''
}

export const user: Writable<string> = writable(userFromStorage);

user.subscribe(value => {
  if (browser) {
    localStorage.setItem(UUID_KEY, value)
  }
})

