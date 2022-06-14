<script lang="ts">
	import type { Ship } from 'src/types';
	import getImage from '../helpers/image-handler';

	export let ship: Ship;
	export let over: boolean = false;
	export let onDragStart: (event: any) => void = () => {};
	export let onRemoveShip: (shipNumber: number) => void = () => {};
	export let onRotateShip: (shipNumber: number) => void = () => {};
	export let showRotateButton: boolean = false;
	export let showRemoveButton: boolean = false;
	export let isDragging: boolean = false;
	export let wreck: boolean = false;
</script>

<div class="ship {over ? 'over' : ''} {isDragging ? 'isDragging' : ''} {ship.orientation}">
	<img
		data-ship={JSON.stringify(ship)}
		class="sprite"
		draggable="true"
		on:dragstart={onDragStart}
		src={getImage(`ship${ship.id + 1}${wreck ? 'Wreck' : ''}`)}
		alt="tile"
	/>
	{#if showRotateButton}
		<button class="ship-control-button-rotate" on:click={() => onRotateShip(ship.id)}>R</button>
	{/if}
	{#if showRemoveButton}
		<button class="ship-control-button-remove" on:click={() => onRemoveShip(ship.id)}>X</button>
	{/if}
</div>

<style lang="scss">
	.ship {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 60px;
		height: 100px;
		position: relative;
	}
	.ship:not(.over) .sprite {
		width: 100%;
		height: 100%;
	}
	.ship.over {
		position: absolute;
		top: 0;
		z-index: 99;
	}
	[class^='ship-control-button-'] {
		display: none;
		position: absolute;
		top: 0px;
		appearance: none;
		border: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background-color: gray;
		color: white;
	}
	.ship-control-button-remove {
		right: -10px;
	}
	.ship-control-button-rotate {
		left: -10px;
	}
	[class^='ship-control-button-']:hover {
		cursor: pointer;
	}
	.ship:hover [class^='ship-control-button-'] {
		display: block;
	}
	.ship.left .sprite {
		transform: rotateZ(90deg);
	}
	.ship.up .sprite {
		transform: rotateZ(180deg);
	}
	.ship.right .sprite {
		transform: rotateZ(-90deg);
	}
	.ship.left.over {
		top: -26px;
		right: 20px;
	}
	.ship.up.over {
		top: auto;
		bottom: 0px;
	}
	.ship.right.over {
		top: -26px;
		left: 20px;
	}
</style>
