<script lang="ts">
	import type { Ship, Tile, Turns, Vector2 } from '../types';
	import getImage from '../helpers/image-handler';
	import ShipComponent from './Ship.svelte';
	import { sessionState } from '$lib/stores';

	export let id: string;
	export let tileInfo: Tile;
	export let onDragStart: (event: any) => void = () => {};
	export let onDrop: (event: any) => void = () => {};
	export let onRemoveShip: (shipNumber: number) => void = () => {};
	export let onRotateShip: (shipNumber: number) => void = () => {};
	export let onClick: (position: Vector2) => void = () => {};
	export let isYourTurn: boolean = false;
	export let opponentTile: boolean = false;
	export let yourTile: boolean = false;
	export let showControls: boolean = false;
	const notypecheck = (x: any) => x;

	$: tileTurnInfo = (() => {
		if ($sessionState) {
			if ($sessionState.yourPlayerNumber == 1) {
				if (opponentTile) {
					return $sessionState.player1Turns[`${tileInfo.position.x},${tileInfo.position.y}`];
				} else {
					return $sessionState.player2Turns[`${tileInfo.position.x},${tileInfo.position.y}`];
				}
			} else {
				if (opponentTile) {
					return $sessionState.player2Turns[`${tileInfo.position.x},${tileInfo.position.y}`];
				} else {
					return $sessionState.player1Turns[`${tileInfo.position.x},${tileInfo.position.y}`];
				}
			}
		}
	})();

	const isShipFullyDestroyed = (ship: Ship): boolean => {
		if ($sessionState) {
			if (opponentTile) {
				switch (ship.orientation) {
					case 'down':
						return Boolean(
							$sessionState.yourPlayerNumber == 1
								? $sessionState.player1Turns[`${tileInfo.position.x},${tileInfo.position.y + 1}`]
								: $sessionState.player2Turns[`${tileInfo.position.x},${tileInfo.position.y + 1}`]
						);
					case 'up':
						return Boolean(
							$sessionState.yourPlayerNumber == 1
								? $sessionState.player1Turns[`${tileInfo.position.x},${tileInfo.position.y - 1}`]
								: $sessionState.player2Turns[`${tileInfo.position.x},${tileInfo.position.y - 1}`]
						);
					case 'right':
						return Boolean(
							$sessionState.yourPlayerNumber == 1
								? $sessionState.player1Turns[`${tileInfo.position.x + 1},${tileInfo.position.y}`]
								: $sessionState.player2Turns[`${tileInfo.position.x + 1},${tileInfo.position.y}`]
						);
					case 'left':
						return Boolean(
							$sessionState.yourPlayerNumber == 1
								? $sessionState.player1Turns[`${tileInfo.position.x - 1},${tileInfo.position.y}`]
								: $sessionState.player2Turns[`${tileInfo.position.x - 1},${tileInfo.position.y}`]
						);
					default:
						return false;
				}
			} else {
				switch (ship.orientation) {
					case 'down':
						return Boolean(
							$sessionState.yourPlayerNumber == 1
								? $sessionState.player2Turns[`${tileInfo.position.x},${tileInfo.position.y + 1}`]
								: $sessionState.player1Turns[`${tileInfo.position.x},${tileInfo.position.y + 1}`]
						);
					case 'up':
						return Boolean(
							$sessionState.yourPlayerNumber == 1
								? $sessionState.player2Turns[`${tileInfo.position.x},${tileInfo.position.y - 1}`]
								: $sessionState.player1Turns[`${tileInfo.position.x},${tileInfo.position.y - 1}`]
						);
					case 'right':
						return Boolean(
							$sessionState.yourPlayerNumber == 1
								? $sessionState.player2Turns[`${tileInfo.position.x + 1},${tileInfo.position.y}`]
								: $sessionState.player1Turns[`${tileInfo.position.x + 1},${tileInfo.position.y}`]
						);
					case 'left':
						return Boolean(
							$sessionState.yourPlayerNumber == 1
								? $sessionState.player2Turns[`${tileInfo.position.x - 1},${tileInfo.position.y}`]
								: $sessionState.player1Turns[`${tileInfo.position.x - 1},${tileInfo.position.y}`]
						);
					default:
						return false;
				}
			}
		}
		return false;
	};
</script>

<div
	{...notypecheck({
		attribute: 'ondragover'
	})}
	class="tile
  {opponentTile ? 'opponent' : ''}
  {yourTile ? 'yours' : ''}
  {tileInfo.type}
  {isYourTurn && !tileTurnInfo ? 'clickable' : ''}
  {tileTurnInfo ? 'guessed' : ''}
  {tileTurnInfo && tileTurnInfo.result === 'hit' ? 'hit' : ''}"
	ondragover="return false"
	on:click={() => {
		if (isYourTurn && !tileTurnInfo) {
			onClick(tileInfo.position);
		}
	}}
>
	<img {id} class="sprite" draggable="true" on:drop={onDrop} src={getImage('water')} alt="tile" />
	{#if tileInfo.type === 'ship' && tileInfo.ship && tileInfo.ship.position && !(tileTurnInfo && tileTurnInfo.result === 'hit')}
		<ShipComponent
			ship={tileInfo.ship}
			{onDragStart}
			over={true}
			{onRemoveShip}
			showRemoveButton={!opponentTile && showControls}
			showRotateButton={!opponentTile &&
				showControls &&
				tileInfo.ship.position.x != 0 &&
				tileInfo.ship.position.y != 0 &&
				tileInfo.ship.position.x != 9 &&
				tileInfo.ship.position.y != 9}
			{onRotateShip}
		/>
	{/if}
	{#if tileTurnInfo && tileTurnInfo.result === 'hit'}
		{#if tileTurnInfo.ship && isShipFullyDestroyed(tileTurnInfo.ship)}
			<ShipComponent ship={tileTurnInfo.ship} wreck over={true} />
		{:else if tileTurnInfo.ship && !isShipFullyDestroyed(tileTurnInfo.ship)}
			<img {id} class="sprite hit" draggable="true" src={getImage('hit')} alt="hit" />
		{/if}
	{/if}
</div>

<style lang="scss">
	.tile {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 50px;
		height: 50px;
		border: 1px solid black;
		position: relative;

		&.clickable {
			&:hover {
				cursor: pointer;
			}
		}
		&:not(.clickable) {
			&:hover {
				cursor: not-allowed;
			}
		}
		&.opponent,
		&.yours {
			&:not(.guessed) {
				img {
					opacity: 0.1;
				}
			}
		}
	}
	.sprite {
		width: 100%;
		height: 100%;
		position: absolute;
	}
</style>
