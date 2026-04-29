# Room Control Card by akaDashe

[![HACS][hacs-badge]][hacs-url]
[![Build][build-badge]][build-url]
[![License][license-badge]](LICENSE)

> **Pre-1.0** — This card is in active development. Configuration may change before the 1.0.0 release.

A compact room-control card for [Home Assistant](https://www.home-assistant.io/). Each card represents a room: a name and icon as the header, plus three configurable entity slots (top-right, bottom-left, bottom-right) for the lights, climate, media, and other entities you actually look at.

## Features

- Room header with configurable tap, double-tap, and hold actions
- Three entity slots — **top-right**, **bottom-left**, **bottom-right** — each holding any number of entities
- Active/inactive icon colors per entity, with sensible domain defaults (light, switch, fan, climate, media_player, cover, lock, binary_sensor, camera, vacuum, person, device_tracker)
- Show-only-when-active filter so a slot collapses entities that aren't doing anything
- Active-attribute matching for cases where state alone isn't enough (e.g. `attribute=brightness`)
- Optional inline value rendering (right or left of the icon) with HA's `display_precision`
- Per-corner border radius
- Full visual editor with HA-themed color picker

## Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant instance
2. Go to **Frontend** > **+ Explore & Download Repositories**
3. Search for **Room Control Card by akaDashe**
4. Click **Download**
5. Restart Home Assistant

### Manual

1. Download `room-control-card.js` from the [latest release](../../releases/latest)
2. Copy it to `config/www/room-control-card/`
3. Add the resource in **Settings > Dashboards > Resources**:
   - URL: `/local/room-control-card/room-control-card.js`
   - Type: JavaScript Module

## Usage

### Visual Editor

Add the card via the dashboard editor and configure it through the visual UI — name, icon, the three entity slots, and tap/hold actions are all editable there.

### YAML

```yaml
type: custom:room-control-card
name: Living Room
icon: mdi:sofa
entities_top_right:
  - entity: climate.living_room
entities_bottom_left:
  - entity: light.living_room_main
  - entity: light.living_room_lamp
entities_bottom_right:
  - entity: media_player.living_room_speaker
  - entity: switch.living_room_fan
tap_action:
  action: navigate
  navigation_path: /lovelace/living-room
```

### Per-entity configuration

```yaml
entities_bottom_left:
  - entity: light.kitchen
    icon: mdi:ceiling-light
    active_color: var(--amber-color)
    inactive_color: var(--disabled-text-color)
    show_value: true
    value_position: right
  - entity: binary_sensor.kitchen_motion
    show_only_active: true       # only renders when motion is detected
    active_attribute: occupancy  # alternatively match an attribute, not state
```

## Development

```bash
npm install
npm run build         # one-shot build → dist/room-control-card.js
npm run watch         # rollup watch
npm run dev           # rollup watch + auto-deploy to /Volumes/config/www/...
npm run push          # one-shot deploy + bump the Lovelace resource ?hacstag
npm test              # vitest run
npm run test:coverage # vitest with v8 coverage
npm run lint          # eslint
npm run format        # prettier
```

`npm run push` requires `HA_URL` and `HA_TOKEN` in `../.env` (one level above the repo). It updates the Lovelace resource's `?hacstag=<ms>` query string via WebSocket so every connected browser refetches the new bundle without a manual hard-refresh.

## License

[MIT](LICENSE)

[hacs-badge]: https://img.shields.io/badge/HACS-Custom-orange.svg
[hacs-url]: https://hacs.xyz
[build-badge]: https://github.com/akaDashe/room-control-card/actions/workflows/pre-merge.yml/badge.svg
[build-url]: https://github.com/akaDashe/room-control-card/actions/workflows/pre-merge.yml
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg
