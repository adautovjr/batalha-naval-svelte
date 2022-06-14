
import { user, username, session } from "$lib/stores";
import { get } from 'svelte/store'

export function getWSHost(): string {
  const userId = get(user);
  const sessionId = get(session);
  const usernameValue = get(username);

  return `ws://${window.location.hostname}:3001/?${userId ? `userId=${userId}` : ''}${sessionId ? `&sessionId=${sessionId}` : ''}${usernameValue ? `&username=${usernameValue}` : ''}`;
}