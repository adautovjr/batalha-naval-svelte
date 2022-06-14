<script lang="ts">
	import { sendMessage } from '../controller/ws';
	import { clients, user, username } from '$lib/stores';
	import Swal from 'sweetalert2';

	if (!$username) {
		Swal.fire({
			title: 'Please enter a username',
			input: 'text',
			inputPlaceholder: 'Enter a username',
			inputAttributes: {
				autocapitalize: 'off'
			},
			showCancelButton: false,
			confirmButtonText: 'Submit',
			showLoaderOnConfirm: true,
			allowOutsideClick: false
		}).then((result) => {
			if (result.value) {
				sendMessage({
					type: 'setUsername',
					body: {
						userId: $user,
						username: result.value
					}
				});
			}
		});
	}

	const requestSessionWithUser = (opponentId: string) => {
		if (!$user || opponentId === $user) return;
		sendMessage({
			type: 'requestSession',
			body: {
				userId: $user,
				opponentId
			}
		});
	};
</script>

<div class="clients-container">
	{#if $clients}
		{#each $clients as client}
			<div
				class="client"
				class:me={client.username && $user === client.id}
				on:click={() => {
					if (client.username) requestSessionWithUser(client.id);
				}}
			>
				{client.username || 'Loading...'}
			</div>
		{/each}
	{/if}
</div>

<style>
	.clients-container {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		grid-gap: 10px;
		width: 100%;
		height: 100%;
	}
	.client {
		border: 1px solid black;
		padding: 10px;
		width: 100px;
		height: 100px;
	}
	.client.me {
		border: 1px solid red;
	}
	.client:not(.me):hover {
		cursor: pointer;
	}
</style>
