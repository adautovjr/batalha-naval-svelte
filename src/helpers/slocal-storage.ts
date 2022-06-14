// import localStorage from "reactive-localstorage";
import { UUID_KEY, SESSION_KEY } from "../types/storage";

export function saveIDtoLocalStorage(id: string): void {
  localStorage.setItem(UUID_KEY, id);
}

export function saveSessionIDtoLocalStorage(id: string): void {
  localStorage.setItem(SESSION_KEY, id);
}

export function getIDfromLocalStorage(): string | false {
  return localStorage.getItem(UUID_KEY) || false;
}

export function getSessionIDfromLocalStorage(): string | false {
  return localStorage.getItem(SESSION_KEY) || false;
}