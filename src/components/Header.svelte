<script lang="ts">
	import { username } from '$lib/stores';
</script>

<div class="header">
	<div class="container">
		<div class="logo">
			<img src="https://i.imgur.com/XqQXQZb.png" alt="logo" />
		</div>
		{#if $username}
			<div class="username-container">
				{$username}
			</div>
		{/if}
	</div>
</div>
