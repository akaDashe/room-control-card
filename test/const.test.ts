import { describe, it, expect } from "vitest";
import {
  CARD_TAG,
  EDITOR_TAG,
  CARD_VERSION,
  DEFAULT_ACTIVE_STATES,
  DOMAIN_ACTIVE_COLORS,
  DOMAIN_ICONS,
  THEME_COLORS,
} from "../src/const";

describe("constants", () => {
  it("has the expected card tag", () => {
    expect(CARD_TAG).toBe("room-control-card");
  });

  it("has the expected editor tag", () => {
    expect(EDITOR_TAG).toBe("room-control-card-editor");
  });

  it("has a semver-shaped version", () => {
    expect(CARD_VERSION).toMatch(/^\d+\.\d+\.\d+(-[\w.]+)?$/);
  });
});

describe("DEFAULT_ACTIVE_STATES", () => {
  it("treats 'on' as active for light, switch, fan", () => {
    expect(DEFAULT_ACTIVE_STATES.light).toContain("on");
    expect(DEFAULT_ACTIVE_STATES.switch).toContain("on");
    expect(DEFAULT_ACTIVE_STATES.fan).toContain("on");
  });

  it("treats 'unlocked' as active for lock", () => {
    expect(DEFAULT_ACTIVE_STATES.lock).toContain("unlocked");
  });

  it("includes climate hvac modes", () => {
    expect(DEFAULT_ACTIVE_STATES.climate).toEqual(
      expect.arrayContaining(["heat", "cool", "auto"]),
    );
  });
});

describe("DOMAIN_ICONS", () => {
  it("provides mdi icons for the documented domains", () => {
    const expected = [
      "light",
      "switch",
      "climate",
      "media_player",
      "cover",
      "lock",
      "camera",
      "sensor",
      "binary_sensor",
      "fan",
      "vacuum",
      "person",
      "device_tracker",
    ];
    for (const domain of expected) {
      expect(DOMAIN_ICONS[domain]).toBeDefined();
      expect(DOMAIN_ICONS[domain]).toMatch(/^mdi:/);
    }
  });
});

describe("DOMAIN_ACTIVE_COLORS", () => {
  it("uses HA theme color CSS variables", () => {
    for (const color of Object.values(DOMAIN_ACTIVE_COLORS)) {
      expect(color).toMatch(/var\(--[\w-]+-color/);
    }
  });
});

describe("THEME_COLORS", () => {
  it("starts with a Default option that has an empty value", () => {
    expect(THEME_COLORS[0]).toMatchObject({ value: "", label: "Default" });
  });

  it("every entry has value, label, and color fields", () => {
    for (const opt of THEME_COLORS) {
      expect(opt).toHaveProperty("value");
      expect(opt).toHaveProperty("label");
      expect(opt).toHaveProperty("color");
    }
  });
});
