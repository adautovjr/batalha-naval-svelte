<script lang="ts">
	import Game from '../components/Game.svelte';

	export let sessionID: string;
</script>

<div>
	<Game sessionId={sessionID} />
</div>
