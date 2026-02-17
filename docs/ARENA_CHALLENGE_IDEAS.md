# Arena Challenge Ideas – Light Your City and Beyond

Same quiz engine (correct = gain advantage, wrong = lose it; first to 100% wins). Each idea is a **visual theme** + **win metaphor** that reuses the existing arena engine and registry.

---

## 1. **Save Your Sinking Boat** (recommended next)

- **Pitch:** Two boats; correct answers raise your boat, wrong answers let water in. First team to reach “safe height” (100%) wins.
- **Visual:** Two boats (left/right). Each has a “safety meter” or water level: 0 = sinking, 100 = saved. Same `advantage` 0–100 per team.
- **Win:** First team to 100% “saved” (same as Light Your City).
- **Feel:** High stakes, easy to read: “we’re sinking!” vs “we’re safe.”
- **Implementation:** New arena module + config; new renderer (boats + water/meter). Reuse `first_to` 100, same scoring.

---

## 2. **Flight Altitude**

- **Pitch:** Two planes (or hot-air balloons); correct answers = climb, wrong = descend. First to reach cruising altitude (100%) wins.
- **Visual:** Two aircraft, altitude 0–100 each. Clouds, horizon, maybe a “target altitude” line.
- **Win:** First to 100% altitude (same as Light Your City).
- **Feel:** “We’re climbing!” vs “We’re losing altitude.”
- **Implementation:** New arena module; renderer with planes + altitude bars or vertical position. Same engine.

---

## 3. **Tug of War**

- **Pitch:** One rope between two teams. Correct answers pull the rope your way, wrong answers give ground. First to pull the rope past their line wins.
- **Visual:** Single rope; position derived from `left.advantage - right.advantage` (e.g. -100 to +100). Center = 0; left wins when rope crosses left line, right when it crosses right line.
- **Win:** Same engine: first team to reach 100 advantage wins. Rope is just a different way to show the same two advantages (or their difference).
- **Feel:** Classic, instantly understandable; great for two teams on one screen.
- **Implementation:** New arena module; `getVisualState` returns e.g. `ropePosition: left.advantage - right.advantage`; renderer draws one rope that moves left/right. Same `checkWin` (first to 100).

---

## 4. **Other ideas (same engine)**

| Idea              | Visual metaphor              | Win condition   | Notes                          |
|-------------------|-----------------------------|-----------------|--------------------------------|
| **Rocket race**   | Two rockets, fuel 0–100%    | First to 100%   | Correct = fuel up, wrong = burn |
| **Bridge build** | Two sides building toward center | First to 100% | Each segment = advantage step   |
| **Treasure dive** | Two subs, depth 0–100%      | First to 100%   | “Reach the treasure”            |
| **Mountain climb**| Two climbers, height 0–100% | First to 100%   | Correct = climb, wrong = slip    |
| **Lighthouse**    | Two lighthouses, light 0–100%| First to 100%   | Thematic sibling to Light Your City |

---

## Recommendation

1. **Tug of War** – Easiest to explain, one rope, reuses engine with a single derived value (`ropePosition`). Best next step if you want a second mode fast.
2. **Save Your Sinking Boat** – Strong emotional hook (“save the boat”), still same engine; needs a bit more art (boats + water).
3. **Flight Altitude** – Clear and fun; good if you want a “sky” theme and vertical motion.

All three (and the table) keep the same scoring, win condition, and engine; only the **arena module** (`getVisualState` + `checkWin`) and the **renderer** (UI/visuals) change.

---

## Implemented polish (Rocket Race 3D)

- **Confetti on win** – When a team hits 100%, confetti fires from that side (ArenaScreen; applies to Light Your City, Rocket Race, and any future arena).
- **Leader glow (Rocket Race)** – The rocket ahead gets a stronger emissive glow so “who’s winning” is clear at a glance.
- **Reduce motion** – `usePrefersReducedMotion`; when set: fixed camera, snappier rockets, fewer sparkles/no star motion, minimal confetti.

## Future polish ideas

- **Sound** – Optional thrust/boost SFX on correct answer; win fanfare (with mute).
- **Trail** – Motion trail behind each rocket (e.g. drei Trail if deps allow).
- **Clouds** – Sparse cloud planes in the sky for depth (drei Cloud).
