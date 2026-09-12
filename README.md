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

## Data model (artifact db)
- `roster/<id>`  — one document per player: name, character, class, race, faction, role, days, notes
- `events/<id>`  — one document per event: title, date, time, kind, notes, rsvps {rosterId: yes|maybe|no}

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
