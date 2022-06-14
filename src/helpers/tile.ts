import type { Tile } from "src/types"

export const generateTiles = (): Tile[] => {
  const tiles: Tile[] = []

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      tiles.push({
        position: {
          x: j,
          y: i
        },
        type: 'water',
        hit: false,
        ship: null
      })
    }
  }
  return tiles
}