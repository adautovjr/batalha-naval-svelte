<script lang="ts">
	import { generateTiles } from '../helpers/tile';
	import {
		generateShips,
		getNewShip,
		getNextOrientation,
		getTileNumberFromVector2,
		getVector2FromTileNumber
	} from '../helpers/ship';
	import Tile from './Tile.svelte';
	import ShipComponent from './Ship.svelte';
	import type { GameState, Guesses, SessionState, Ship, Turns, Vector2 } from 'src/types';
	import { sendMessage } from '../controller/ws';
	import { user, sessionState } from '$lib/stores';
	import { getRandomInt, getRandomOrientation } from '../helpers/random';
	import { escape } from 'svelte/internal';

	const userId = $user;

	let tiles = generateTiles();
	let opponentTiles = generateTiles();
	let ships = generateShips();
	let pickedUpShip: Ship | null = null;
	export let sessionId: string;
	$: isYourTurn = Boolean(
		$sessionState && $sessionState.gameState === `player${$sessionState.yourPlayerNumber}`
	);

	$: {
		if ($sessionState && $sessionState.yourBoard && $sessionState.yourBoard.length) {
			tiles = $sessionState.yourBoard;
			ships = [];
		}
	}

	// TODO - Fix bug on random ship placement where ships are placed on top of each other
	const setRandomBoard = () => {
		for (let i = 0; i < 6; i++) {
			removeShipFromBoard(i);
			const shipFromList = ships.find((ship) => ship.id === i);
			if (shipFromList) {
				ships = ships.filter((ship) => ship.id !== i);
			}
			let wasShipAdded = false;
			while (!wasShipAdded) {
				wasShipAdded = setShipOnBoard(getRandomInt(100) + 1, {
					id: i,
					orientation: getRandomOrientation(),
					position: null
				});
			}
		}
	};

	const setShipOnBoard = (tileNumber: number, ship: Ship): boolean => {
		if (
			tiles[tileNumber]?.type != 'water' ||
			(ship?.orientation == 'down' &&
				!tiles[tileNumber + 10] &&
				tiles[tileNumber + 10]?.type != 'water') ||
			(ship?.orientation == 'up' &&
				!tiles[tileNumber - 10] &&
				tiles[tileNumber - 10]?.type != 'water') ||
			(ship?.orientation == 'right' && tileNumber % 10 == 9) ||
			(ship?.orientation == 'left' && tileNumber % 10 == 0)
		) {
			return false;
		}
		const newShip = {
			...ship,
			position: getVector2FromTileNumber(tileNumber)
		};
		tiles = tiles.map((tile: any, i) => {
			if (i == tileNumber) {
				tile.type = 'ship';
				tile.ship = newShip;
			}
			if (i - 10 == tileNumber && ship.orientation == 'down') {
				tile.type = 'shipPart';
				tile.ship = newShip;
			}
			if (i + 10 == tileNumber && ship.orientation == 'up') {
				tile.type = 'shipPart';
				tile.ship = newShip;
			}
			if (i + 1 == tileNumber && ship.orientation == 'left') {
				tile.type = 'shipPart';
				tile.ship = newShip;
			}
			if (i - 1 == tileNumber && ship.orientation == 'right') {
				tile.type = 'shipPart';
				tile.ship = newShip;
			}
			return tile;
		});
		return true;
	};

	const rotateShipOnList = (shipNumber: number) => {
		ships = ships.map((s) => {
			if (s.id === shipNumber) {
				return {
					...s,
					orientation: getNextOrientation(s.orientation)
				};
			}
			return s;
		});
	};

	const rotateShipOnBoard = (shipNumber: number) => {
		const ship = tiles.find((tile) => tile.ship?.id === shipNumber)?.ship;
		if (
			ship &&
			ship.position &&
			ship.position.x != 0 &&
			ship.position.y != 0 &&
			ship.position.x != 9 &&
			ship.position.y != 9
		) {
			removeShipFromBoard(shipNumber);
			setShipOnBoard(getTileNumberFromVector2(ship.position), {
				...ship,
				orientation: getNextOrientation(ship.orientation)
			});
		}
	};

	const removeShipFromBoard = (shipNumber: number) => {
		tiles = tiles.map((tile: any, i) => {
			if (tile.ship?.id == shipNumber) {
				tile.type = 'water';
				tile.ship = null;
			}
			return tile;
		});
		ships = ships.filter((ship: any) => ship.id != shipNumber);
	};

	const onRemoveShip = (shipNumber: number) => {
		const newShip = getNewShip(shipNumber);
		removeShipFromBoard(shipNumber);
		ships = [...ships, newShip];
	};

	const onShipDragStart = (event: any) => {
		const ship = JSON.parse(event.target.getAttribute('data-ship') as string) as Ship;
		pickedUpShip = ship;
		event.dataTransfer.setData('ship', JSON.stringify(ship));
		// TODO - Fix wrong dragImage on first drag
		let img = event.target.cloneNode(true) as any;
		img.src = `/src/lib/assets/images/${ship.orientation}/ship${ship.id + 1}.png`;
		event.dataTransfer.setDragImage(img, 40, 80);
	};

	const onTileDrop = (event: any) => {
		const tileNumber = parseInt(event.target.getAttribute('id'));

		if (
			tiles[tileNumber]?.type !== 'water' ||
			(pickedUpShip?.orientation === 'down' &&
				!tiles[tileNumber + 10] &&
				tiles[tileNumber + 10]?.type !== 'water') ||
			(pickedUpShip?.orientation === 'up' &&
				!tiles[tileNumber - 10] &&
				tiles[tileNumber - 10]?.type !== 'water') ||
			(pickedUpShip?.orientation === 'right' && tileNumber % 10 == 9) ||
			(pickedUpShip?.orientation === 'left' && tileNumber % 10 == 0) ||
			!event.dataTransfer.getData('ship')
		) {
			return;
		}
		const shipFromList = ships.find((ship) => ship.id === pickedUpShip?.id);
		if (shipFromList) {
			ships = ships.filter((ship) => ship.id !== pickedUpShip?.id);
		} else if (pickedUpShip) {
			removeShipFromBoard(pickedUpShip.id);
		}
		pickedUpShip = null;
		setShipOnBoard(
			parseInt(event.target.getAttribute('id')),
			JSON.parse(event.dataTransfer.getData('ship')) as Ship
		);
	};

	const setPlayerBoard = () => {
		sendMessage({
			type: 'setPlayerBoard',
			body: {
				userId,
				sessionId,
				tiles
			}
		});
	};

	const takeShot = (position: Vector2) => {
		if ($sessionState) $sessionState.gameState = 'waitingForServer';
		sendMessage({
			type: 'takeShot',
			body: {
				userId,
				sessionId,
				position
			}
		});
	};
</script>

{#if $sessionState}
	<div class="game">
		{#if $sessionState.gameState == 'start'}
			<div class="board">
				<div class="board-highlight">
					{#each tiles as tileInfo, i}
						<Tile
							id={`${i}`}
							{tileInfo}
							onDrop={onTileDrop}
							{onRemoveShip}
							onRotateShip={rotateShipOnBoard}
							onDragStart={onShipDragStart}
							showControls={true}
						/>
					{/each}
				</div>
				{#if ships.length === 0}
					<div class="confirmLayout">
						<button on:click={setPlayerBoard}>confirm</button>
					</div>
				{/if}
			</div>
			<div class="ships">
				<div class="confirmLayout">
					<button on:click={setRandomBoard}>Random</button>
				</div>
				{#each ships as ship}
					<ShipComponent
						{ship}
						onDragStart={onShipDragStart}
						{onRemoveShip}
						onRotateShip={rotateShipOnList}
					/>
				{/each}
			</div>
		{/if}

		{#if $sessionState.gameState == 'player1' || $sessionState.gameState == 'player2' || $sessionState.gameState == 'waitingForServer'}
			<div class="boards-container">
				<div class="board">
					<div class="board-title">
						<h2>Your board</h2>
					</div>
					<div class="board-highlight">
						{#each tiles as tileInfo, i}
							<Tile id={`${i}`} {tileInfo} yourTile />
						{/each}
					</div>
				</div>
				<div class="blank-space" />
				<div class="board">
					<div class="board-title">
						<h2>Opponent's board</h2>
					</div>
					<div class="board-highlight {isYourTurn ? 'your-turn' : ''}">
						{#each opponentTiles as tileInfo, i}
							<Tile id={`${i}`} {tileInfo} {isYourTurn} onClick={takeShot} opponentTile />
						{/each}
					</div>
				</div>
			</div>
		{/if}
		{#if $sessionState.gameState == 'player1Wins' || $sessionState.gameState == 'player2Wins'}
			<div class="win-screen">
				{#if $sessionState.gameState == `player${$sessionState.yourPlayerNumber}Wins`}
					You Win! 🥳
				{:else}
					You Lose! 😭
				{/if}
			</div>
		{/if}
	</div>
{/if}

<style lang="scss">
	.game {
		display: flex;
		align-items: center;
		width: 100%;
		height: 100%;
	}
	.board {
		position: relative;
		margin-top: 30px;
		.board-highlight {
			display: grid;
			grid-template-columns: repeat(10, 1fr);
			border: 8px solid transparent;
			transition: border 0.4s;
			&.your-turn {
				border-color: #abe2f6;
			}
		}
	}
	.ships {
		position: relative;
		margin-left: 50px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.confirmLayout,
	.board-title {
		display: flex;
		justify-content: flex-end;
		padding: 20px 0;
	}
	.board-title {
		justify-content: center;
	}
	.confirmLayout button {
		background-color: #00a8ff;
		color: #fff;
		border: none;
		padding: 10px 20px;
		border-radius: 5px;
		cursor: pointer;
		font-size: 16px;
		font-weight: bold;
	}
	.boards-container {
		display: flex;
		justify-content: space-between;
	}
	.blank-space {
		width: 100px;
	}
</style>
