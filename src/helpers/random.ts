import type { Orientation } from "../types";

export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
}

export const getRandomOrientation = (): Orientation => {
  const orientations = ['left', 'right', 'up', 'down']
  return orientations[getRandomInt(orientations.length)] as Orientation
}