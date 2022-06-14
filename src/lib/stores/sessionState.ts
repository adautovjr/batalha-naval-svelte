import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { browser } from '$app/env';
import { SESSION_STATE_KEY } from '../../types/storage';
import type { SessionState } from '../../types';

let sessionFromStorage = null

if (browser) {
  sessionFromStorage = (JSON.parse(localStorage.getItem(SESSION_STATE_KEY) || '{}') as SessionState) || null
}

export const sessionState: Writable<SessionState | null> = writable(sessionFromStorage);

sessionState.subscribe(value => {
  if (browser) {
    localStorage.setItem(SESSION_STATE_KEY, JSON.stringify(value))
  }
})