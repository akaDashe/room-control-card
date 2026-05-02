/** @vitest-environment happy-dom */

import { describe, it, expect, vi } from "vitest";
import { RoomControlCardEditor } from "../src/editor";
import type { RoomControlCardConfig } from "../src/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

type EditorInstance = InstanceType<typeof RoomControlCardEditor> & Record<string, any>;

const BASE_CONFIG: RoomControlCardConfig = {
  type: "custom:room-control-card",
  name: "Test Room",
  entities_top_right: [{ entity: "light.ceiling" }, { entity: "switch.fan" }],
  entities_bottom_left: [{ entity: "climate.thermostat" }],
  entities_bottom_right: [],
};

function makeEditor(config: RoomControlCardConfig = BASE_CONFIG): EditorInstance {
  const editor = Object.create(RoomControlCardEditor.prototype) as EditorInstance;
  // Initialize Lit's internal reactive-property Map so @state/@property setters
  // don't throw "Cannot read properties of undefined (reading 'has')".
  (editor as any)._$changedProperties = new Map();
  (editor as any).isUpdatePending = false;
  (editor as any).__updatePromise = new Promise(() => {}); // blocks render cycle
  editor._config = structuredClone(config);
  editor._expandedEntity = "";
  editor._ready = false;
  editor.dispatchEvent = vi.fn();
  editor.hass = { states: {}, entities: {} };
  return editor;
}

// ─── setConfig ───────────────────────────────────────────────────────────────

describe("setConfig", () => {
  it("stores the config on the instance", () => {
    const editor = makeEditor();
    const cfg: RoomControlCardConfig = { type: "custom:room-control-card", name: "New Room" };
    editor.setConfig(cfg);
    expect(editor._config).toBe(cfg);
  });
});

// ─── _fire ───────────────────────────────────────────────────────────────────

describe("_fire", () => {
  it("dispatches a bubbling composed config-changed event with the current config", () => {
    const editor = makeEditor();
    editor._fire();

    expect(editor.dispatchEvent).toHaveBeenCalledOnce();
    const event = editor.dispatchEvent.mock.calls[0][0] as CustomEvent;
    expect(event.type).toBe("config-changed");
    expect(event.bubbles).toBe(true);
    expect(event.composed).toBe(true);
    expect(event.detail.config).toEqual(editor._config);
  });
});

// ─── _set ────────────────────────────────────────────────────────────────────

describe("_set", () => {
  it("updates the key immutably and fires config-changed", () => {
    const editor = makeEditor();
    const before = editor._config;
    editor._set("name", "Updated Room");
    expect(editor._config).not.toBe(before);
    expect(editor._config.name).toBe("Updated Room");
    expect(editor.dispatchEvent).toHaveBeenCalledOnce();
  });

  it("preserves all other keys", () => {
    const editor = makeEditor();
    editor._set("name", "Changed");
    expect(editor._config.entities_top_right).toEqual(BASE_CONFIG.entities_top_right);
  });
});

// ─── _updateEntity ───────────────────────────────────────────────────────────

describe("_updateEntity", () => {
  it("merges the update into the entity at the given index", () => {
    const editor = makeEditor();
    editor._updateEntity("entities_top_right", 0, { icon: "mdi:lightbulb" });
    expect(editor._config.entities_top_right![0].icon).toBe("mdi:lightbulb");
    expect(editor._config.entities_top_right![0].entity).toBe("light.ceiling");
  });

  it("does not mutate other entities in the section", () => {
    const editor = makeEditor();
    editor._updateEntity("entities_top_right", 0, { active_color: "red" });
    expect(editor._config.entities_top_right![1].active_color).toBeUndefined();
  });

  it("fires config-changed after the update", () => {
    const editor = makeEditor();
    editor._updateEntity("entities_top_right", 1, { active_color: "blue" });
    expect(editor.dispatchEvent).toHaveBeenCalledOnce();
  });
});

// ─── _removeEntity ───────────────────────────────────────────────────────────

describe("_removeEntity", () => {
  it("removes the entity at the specified index", () => {
    const editor = makeEditor();
    editor._removeEntity("entities_top_right", 0);
    expect(editor._config.entities_top_right).toHaveLength(1);
    expect(editor._config.entities_top_right![0].entity).toBe("switch.fan");
  });

  it("resets _expandedEntity", () => {
    const editor = makeEditor();
    editor._expandedEntity = "entities_top_right-0";
    editor._removeEntity("entities_top_right", 0);
    expect(editor._expandedEntity).toBe("");
  });

  it("handles removing the last entity in a section", () => {
    const editor = makeEditor();
    editor._removeEntity("entities_bottom_left", 0);
    expect(editor._config.entities_bottom_left).toHaveLength(0);
  });

  it("fires config-changed after removal", () => {
    const editor = makeEditor();
    editor._removeEntity("entities_top_right", 0);
    expect(editor.dispatchEvent).toHaveBeenCalledOnce();
  });
});

// ─── _moveEntity ─────────────────────────────────────────────────────────────

describe("_moveEntity", () => {
  it("swaps entity downward (direction +1)", () => {
    const editor = makeEditor();
    editor._moveEntity("entities_top_right", 0, 1);
    expect(editor._config.entities_top_right![0].entity).toBe("switch.fan");
    expect(editor._config.entities_top_right![1].entity).toBe("light.ceiling");
  });

  it("swaps entity upward (direction -1)", () => {
    const editor = makeEditor();
    editor._moveEntity("entities_top_right", 1, -1);
    expect(editor._config.entities_top_right![0].entity).toBe("switch.fan");
    expect(editor._config.entities_top_right![1].entity).toBe("light.ceiling");
  });

  it("updates _expandedEntity to follow the moved entity", () => {
    const editor = makeEditor();
    editor._moveEntity("entities_top_right", 0, 1);
    expect(editor._expandedEntity).toBe("entities_top_right-1");
  });

  it("no-ops when moving before the start of the list", () => {
    const editor = makeEditor();
    editor._moveEntity("entities_top_right", 0, -1);
    expect(editor._config.entities_top_right![0].entity).toBe("light.ceiling");
    expect(editor.dispatchEvent).not.toHaveBeenCalled();
  });

  it("no-ops when moving past the end of the list", () => {
    const editor = makeEditor();
    editor._moveEntity("entities_top_right", 1, 1);
    expect(editor._config.entities_top_right![1].entity).toBe("switch.fan");
    expect(editor.dispatchEvent).not.toHaveBeenCalled();
  });
});

// ─── _addEntity ──────────────────────────────────────────────────────────────

describe("_addEntity", () => {
  it("appends a new entity config with just entity_id", () => {
    const editor = makeEditor();
    const before = editor._config.entities_top_right!.length;
    editor._addEntity("entities_top_right", "sensor.humidity");
    expect(editor._config.entities_top_right).toHaveLength(before + 1);
    expect(editor._config.entities_top_right!.at(-1)).toEqual({ entity: "sensor.humidity" });
  });

  it("adds to an empty section", () => {
    const editor = makeEditor();
    editor._addEntity("entities_bottom_right", "light.new");
    expect(editor._config.entities_bottom_right).toHaveLength(1);
    expect(editor._config.entities_bottom_right![0].entity).toBe("light.new");
  });

  it("fires config-changed after adding", () => {
    const editor = makeEditor();
    editor._addEntity("entities_top_right", "light.new");
    expect(editor.dispatchEvent).toHaveBeenCalledOnce();
  });
});

// ─── _addActiveState ─────────────────────────────────────────────────────────

describe("_addActiveState", () => {
  it("adds a state to the entity's active_states array", () => {
    const editor = makeEditor();
    editor._addActiveState("entities_top_right", 0, "custom_state");
    expect(editor._config.entities_top_right![0].active_states).toContain("custom_state");
  });

  it("does not add duplicate states", () => {
    const editor = makeEditor();
    editor._addActiveState("entities_top_right", 0, "on");
    editor._addActiveState("entities_top_right", 0, "on");
    const states = editor._config.entities_top_right![0].active_states!;
    expect(states.filter((s) => s === "on")).toHaveLength(1);
  });

  it("creates active_states array when it did not exist", () => {
    const editor = makeEditor();
    editor._addActiveState("entities_top_right", 0, "playing");
    expect(Array.isArray(editor._config.entities_top_right![0].active_states)).toBe(true);
  });

  it("no-ops when entity index is out of range", () => {
    const editor = makeEditor();
    editor._addActiveState("entities_top_right", 99, "on");
    expect(editor.dispatchEvent).not.toHaveBeenCalled();
  });
});

// ─── _removeActiveState ──────────────────────────────────────────────────────

describe("_removeActiveState", () => {
  it("removes the specified state from active_states", () => {
    const editor = makeEditor();
    editor._config.entities_top_right![0].active_states = ["on", "playing"];
    editor._removeActiveState("entities_top_right", 0, "on");
    expect(editor._config.entities_top_right![0].active_states).toEqual(["playing"]);
  });

  it("sets active_states to undefined when the last state is removed", () => {
    const editor = makeEditor();
    editor._config.entities_top_right![0].active_states = ["on"];
    editor._removeActiveState("entities_top_right", 0, "on");
    expect(editor._config.entities_top_right![0].active_states).toBeUndefined();
  });

  it("fires config-changed after removing", () => {
    const editor = makeEditor();
    editor._config.entities_top_right![0].active_states = ["on"];
    editor._removeActiveState("entities_top_right", 0, "on");
    expect(editor.dispatchEvent).toHaveBeenCalledOnce();
  });

  it("no-ops when entity index is out of range", () => {
    const editor = makeEditor();
    editor._removeActiveState("entities_top_right", 99, "on");
    expect(editor.dispatchEvent).not.toHaveBeenCalled();
  });
});
