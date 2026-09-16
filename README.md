# Classic+ — WoW Forever guild sign-up & schedule

A shared sign-up sheet and event schedule for our friend group ahead of
**World of Warcraft Forever** (Blizzard's Classic+).

## Key dates
- **Sept 17, 2026** — Beta opens on Battle.net (included with an active WoW sub)
- **Nov 4, 2026** — Launch (level cap 60)
- **March 2027** — First content update

## What's new in Forever (for planning)
- 3 new zones: Mount Hyjal, Zephras Isle, the Riverglades; 3 revamped zones
- 9 new dungeons, 3 new raids, 1 new battleground, 1,000+ new quests
- New race: Skyborne Elves (unlocked early via the $29.99 Skyborne Heroic Pack)

## Files
- `index.html` — the app (published as a Claude artifact with a shared live database)
- `README.md` — this file

## Data model (Google Sheet tabs)
- `roster` — one row per player: name, character, faction, race, cls, roles (ranked), time, days, notes, professions (up to 2), level, keyHash (never sent to clients; `claimed` boolean is)
- `events` — one row per event: title, date, time, kind, notes, rsvps {rosterId: yes|maybe|no}, createdBy (roster id)
- `plan`   — key/value; `settings` holds { start, pace, picks }

## Features
- **Roster**: sign up, then pick yourself under "RSVP as" to edit (✎) or remove (✕) your own entry. Only your own row shows those buttons.
- **Level tracker**: your row has a level box; the roster header shows the group's level range and median, and the Leveling Plan highlights the bracket the group is actually in (falls back to dates until someone sets a level).
- **Professions**: up to two per character; the roster shows coverage and which crafting professions nobody has.
- **Group builder**: every dungeon/raid event shows Tank/Healer/DPS slots filled from the ranked roles of everyone who's "in" (5-man 1/1/3, 10-man 2/2/6, 20-man 2/5/13, 40-man 4/10/26) and what's still missing.
- **Calendar**: List/Calendar toggle on the schedule. Click a day to filter to it; click an empty day to start an event on that date.
- **Ownership keys**: no accounts. Each roster entry stores a SHA-256 hash of a secret key that only the creating browser holds (localStorage `forever.keys`). RSVP, edit, level, delete, and event deletion all send the key and Code.gs refuses without it. "show key" reveals your key so you can enter it on another device via "not you? → pick your existing entry". Entries made before keys existed show as *unclaimed* and the first browser to claim one owns it.
- **Delete protection**: events remember their creator; only that person (with their key) can delete them. Events made before this rule stay deletable by anyone.

## Leveling Plan tab
Level brackets from 1 to 60 with target dates computed from a shared start date and pace
(Casual / Steady / Sweaty). Each bracket lists every dungeon whose level range overlaps it by
3+ levels, so overlapping options (e.g. Deadmines vs Wailing Caverns vs Lordaeron Ruins at 15-22)
show side by side. Picks are shared; "Add to schedule" creates RSVP-able events.

Stored in `plan/settings`: { start, pace, picks: { bracketId: [dungeon names] } }

### New Forever dungeons/raids (as announced at BlizzCon 2026)
| Name | Level | Source |
|---|---|---|
| Hall of Thanes (under Ironforge) | 13-18 | stated |
| Lordaeron Ruins | 15-20 | stated |
| City of Dalaran | 20-35 | stated |
| Explorer's League Dig (Wetlands) | ~22-30 | estimate |
| Drowned Troll Ruin (off Stranglethorn) | ~32-42 | estimate |
| Krol'dok Stronghold (Riverglades, ogres) | 40-55 | stated |
| Alcaz Island Prison | ~50-58 | estimate |
| Shaper's Terrace | ~55-60 | estimate |
| Blackmaw Hold (furbolg city) | ~57-60 | estimate |
| Barrow Deeps (raid) | 60, 10-player | stated |
| Hyjal Summit (raid) | 60, 20-player | stated |

Update the `DUNGEONS` array in index.html when Blizzard publishes real ranges.
