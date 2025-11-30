# Imposter Game - Project Documentation

## 1. Project Overview
**Imposter** is a real-time, multiplayer social deduction game inspired by "Among Us". Players are assigned roles (Citizen or Imposter) and must work to identify the Imposter before they eliminate everyone. The game is built with a mobile-first design philosophy, ensuring a seamless experience across devices.

## 2. Key Features
*   **Real-time Multiplayer**: Seamless interaction between players using Firebase Realtime Database.
*   **Bot Integration**: Play solo or fill empty slots with intelligent bots that participate in discussions and voting.
*   **Mobile-First Design**: Optimized UI/UX for mobile devices with responsive layouts and touch-friendly controls.
*   **Dynamic Game Flow**: Automated state transitions from Lobby -> Role Reveal -> Discussion -> Voting -> Results.
*   **Room Code System**: Easy-to-share 4-letter codes for private game lobbies.

## 3. How to Play

### Step 1: Home Screen
Start by entering your player name. You can either create a new game or join an existing one using a Room Code.
![Home Screen](C:/Users/gsjadid/.gemini/antigravity/brain/72a7ad03-f391-470e-8745-d0d6d55834b8/doc_home_screen_1764512575296.png)

### Step 2: Lobby Creation
As a host, you'll be taken to the lobby. Share the **Room Code** (displayed at the top) with friends so they can join.
![Empty Lobby](C:/Users/gsjadid/.gemini/antigravity/brain/72a7ad03-f391-470e-8745-d0d6d55834b8/doc_lobby_empty_1764512623659.png)

### Step 3: Gathering Players
Wait for players to join. If you don't have enough human players, you can add bots to fill the lobby.
![Lobby with Players](C:/Users/gsjadid/.gemini/antigravity/brain/72a7ad03-f391-470e-8745-d0d6d55834b8/doc_lobby_full_1764512667471.png)

### Step 4: Role Reveal
Once the game starts, your role will be secretly revealed.
*   **Citizen**: Find the Imposter!
*   **Imposter**: Blend in and survive!
![Role Reveal](C:/Users/gsjadid/.gemini/antigravity/brain/72a7ad03-f391-470e-8745-d0d6d55834b8/doc_role_reveal_1764512695112.png)

### Step 5: Discussion Phase
Discuss with other players. Use the chat (if available) or voice chat (external) to share suspicions.
![Discussion Phase](C:/Users/gsjadid/.gemini/antigravity/brain/72a7ad03-f391-470e-8745-d0d6d55834b8/doc_discussion_1764512742808.png)

### Step 6: Voting Phase
Cast your vote for who you think the Imposter is. The player with the most votes will be eliminated.
![Voting Phase](C:/Users/gsjadid/.gemini/antigravity/brain/72a7ad03-f391-470e-8745-d0d6d55834b8/doc_voting_1764512749870.png)

### Step 7: Game Results
The game ends when the Imposter is caught (Citizens Win) or when the Imposter outnumbers the Citizens (Imposter Wins).
![Results Screen](C:/Users/gsjadid/.gemini/antigravity/brain/72a7ad03-f391-470e-8745-d0d6d55834b8/doc_results_final_1764512790421.png)

## 4. Technical Stack
*   **Frontend**: React (Vite)
*   **Styling**: Vanilla CSS (Mobile-first, Responsive)
*   **Backend/Database**: Firebase Realtime Database
*   **State Management**: React Context API
*   **Testing/Automation**: Custom Bot Scripts (Node.js)

## 5. Future Roadmap
*   **In-game Chat**: Integrated text chat for discussions.
*   **Multiple Imposters**: Support for larger lobbies with 2+ Imposters.
*   **Character Customization**: Avatars and skins.
