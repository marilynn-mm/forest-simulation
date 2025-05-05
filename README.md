# 🌳 Intertwined: A Forest Simulation

**Format**: Interactive Graph-Based Simulation  
**Built With**: p5.js / JavaScript  
**Math Focus**: Graph Theory, Number Theory (Primes, GCD, Modular Arithmetic)

## 🎨 Artist Statement

🌱 In nature, no tree stands alone 🌱 

**Intertwining Roots** is an interactive forest simulation that visualizes how the destruction of one part of an ecosystem can ripple outward—destabilizing and potentially collapsing the whole.

Rooted in **graph theory** and **number theory**, this project lets you shape a living network of trees. Every action—whether planting, connecting, or cutting—reshapes the forest's health. Inspired by the underground mycorrhizal networks that connect real-world trees through fungal threads, this simulation transforms ecological relationships into visual and mathematical language.

---

## 🕹 Gameplay Mechanics

### 🎯 Core Concept
The forest is visualized as an **undirected graph**:
- **Nodes = Trees**
- **Edges = Ecological relationships**

### 🧑‍🌾 Player Actions
- **Plot a Tree (Left Click):** Adds a new tree with a random value (0–99). May auto-connect based on selected math mode.
- **Foster Connection (Click + Drag):** Manually create edges between trees.
- **Cut Down a Tree (Hover + Press `C`):** Removes a tree and impacts surrounding health.

---

## 🧮 Math Modes

Choose a mode before starting the simulation using keys `2`, `3`, or `4`:

### 🔹 Prime (Default)
- **Rule**: Prime trees auto-connect to other prime trees.
- **Metaphor**: Resilient, foundational species.

### 🔹 Coprime (Press `2`)
- **Rule**: New tree connects to all coprime-valued trees (`gcd(a, b) = 1`).
- **Metaphor**: Diverse species cooperating for stability.

### 🔹 Mod 5 (Press `3`)
- **Rule**: Trees connect if they share the same value mod 5.
- **Metaphor**: Latent similarity forming natural clusters.

### 🔹 Perfect Square (Press `4`)
- **Rule**: Trees connect only to other perfect squares (e.g., 1, 4, 9, 16...).
- **Metaphor**: Rare, slow-growing but deeply rooted relationships.

---

## 🌱 Tree Health System

Tree color reflects its **degree (number of connections)**:

| Color     | Connections | Meaning                      |
|-----------|-------------|------------------------------|
| 🟩 Green  | 3+          | Thriving, highly resilient   |
| 🟨 Yellow | 2           | Stable but fragile           |
| 🟥 Red    | 1           | Vulnerable                   |
| ⬛ Black  | 0           | Isolated — dies after 2 turns |

**Background Color** reflects the *overall health* of the forest:
- **Desert Yellow**: Sparse connections = Dry, vulnerable
- **Lush Green**: Dense connections = Thriving, resilient

---

## 📊 Trackers

- **Logs Created**: Increments every time a tree is cut.  
- **Moves Taken**: Increments on every action (plot, connect, cut).

These make visible the consequences of your choices and encourage reflection.

---

## 🚀 How to Run the Simulation

1. **Download the Repository**  
   [GitHub: marilynn-mm/tree-ecosystem-simulation](https://github.com/marilynn-mm/tree-ecosystem-simulation)

2. **Open Terminal**

3. **Navigate to the project folder**  
   ```bash
   cd path/to/tree-ecosystem-simulation

### 🚀 Run Locally

**Enter the following command to run a local server:**

```bash
python3 -m http.server

Then open the simulation in your browser:
👉 http://localhost:8000
(Alternatively, try 👉 http://[::]:8000/ if prompted.)
