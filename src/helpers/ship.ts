import type { Orientation, Ship, Vector2 } from "src/types"

export const generateShips = (): Ship[] => {
  const ships: Ship[] = []

  for (let i = 0; i < 6; i++) {
    ships.push({
      id: i,
      position: null,
      orientation: 'down',
    })
  }
  return ships
}

export const getNewShip = (shipNumber: number): Ship => {
  return {
    id: shipNumber,
    position: null,
    orientation: 'down',
  } as Ship
}

export const getVector2FromTileNumber = (tileNumber: number): Vector2 => {
  const x = tileNumber % 10;
  const y = Math.floor(tileNumber / 10);
  return { x, y };
};

export const getTileNumberFromVector2 = (vector2: Vector2): number => {
  return vector2.y * 10 + vector2.x;
};

export const getNextOrientation = (orientation: Orientation): Orientation => {
  switch (orientation) {
    case 'left':
      return 'up';
    case 'up':
      return 'right';
    case 'right':
      return 'down';
    case 'down':
      return 'left';
    default:
      return 'left';
  }
}