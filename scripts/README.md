# Bot Manager Script

This script allows you to add automated bots to a game room for testing purposes.

## Usage

Because the project uses Vite and `import.meta.env` for configuration, you must run this script using `vite-node`.

Run the following command from the **project root directory**:

```bash
npx vite-node scripts/bot_manager.js <ROOM_ID> [BOT_COUNT]
```

### Arguments

- `<ROOM_ID>`: The 4-letter room code (e.g., `ABCD`).
- `[BOT_COUNT]`: (Optional) Number of bots to add. Defaults to 1.

### Example

Add 3 bots to room `ABCD`:

```bash
npx vite-node scripts/bot_manager.js ABCD 3
```

## Troubleshooting

If you see permission errors, ensure your IP is allowed in Firebase or that the game is in a state where players can join (Lobby phase).
