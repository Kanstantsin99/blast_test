# Blast Puzzle Game Prototype

This is a prototype for a puzzle game in the "Blast" genre, developed as part of a technical test task. The project demonstrates basic gameplay mechanics and is built using **TypeScript** and **Cocos Creator 2.4.15**.

---

## 🎮 Gameplay Description

- The game generates a board of size **N x M** filled with colored tiles.
- When the player clicks on a tile, all **adjacent tiles of the same color** are destroyed.
- Tiles above fall down to fill the gaps, and new tiles are generated from the top.
- The goal is to **score X points in Y moves**.
- The game ends with a loss if:
  - The player runs out of moves without reaching the score.
  - No more valid tile groups are available for destruction after 3 shuffles.

---

## ✅ Core Features

- 🔥 Tile matching and destruction
- ⬇️ Gravity logic: Tiles fall down and new ones spawn
- 🎯 Score tracking and move count
- 🏆 Win and loss conditions with simple progression

---

## ⚙️ Tech Stack

- **TypeScript**
- **Cocos Creator 2.4.x**
