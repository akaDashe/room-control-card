/** @vitest-environment happy-dom */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { RoomControlCard } from "../src/room-control-card";
import { DOMAIN_ICONS, DOMAIN_ACTIVE_COLORS } from "../src/const";
import type { EntityConfig, HassEntity, HomeAssistant, RoomControlCardConfig } from "../src/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

type CardInstance = InstanceType<typeof RoomControlCard> & Record<string, any>;

function makeCard(
  config: Partial<RoomControlCardConfig> = {},
  states: Record<string, HassEntity> = {},
  registryEntities: Record<string, { display_precision?: number }> = {},
): CardInstance {
  const card = Object.create(RoomControlCard.prototype) as CardInstance;
  // Lit's reactive-element tracks property changes in this Map; without it
  // every @state/@property setter throws "Cannot read properties of undefined".
  (card as any)._$changedProperties = new Map();
  (card as any).isUpdatePending = false;
  // A never-resolving promise keeps __enqueueUpdate suspended, so no render
  // cycle fires during synchronous tests.
  (card as any).__updatePromise = new Promise(() => {});
  card._config = { type: "custom:room-control-card", name: "Test Room", ...config };
  card.hass = {
    states,
    entities: registryEntities,
    callService: vi.fn().mockResolvedValue(undefined),
  } as unknown as HomeAssistant;
  card._dblClickTimer = null;
  card._holdTimer = null;
  card._held = false;
  card.dispatchEvent = vi.fn();
  return card;
}

function ent(
  entity_id: string,
  state: string,
  attributes: Record<string, any> = {},
): HassEntity {
  return { entity_id, state, attributes, last_changed: "", last_updated: "" };
}

function ec(entity: string, overrides: Partial<EntityConfig> = {}): EntityConfig {
  return { entity, ...overrides };
}

// ─── setConfig ───────────────────────────────────────────────────────────────

describe("setConfig", () => {
  it("stores the provided config", () => {
    const card = makeCard();
    const cfg = { type: "custom:room-control-card", name: "Bedroom" };
    card.setConfig(cfg);
    expect(card._config).toBe(cfg);
  });

  it("throws on null config", () => {
    const card = makeCard();
    expect(() => card.setConfig(null as any)).toThrow("Invalid configuration");
  });

  it("throws on undefined config", () => {
    const card = makeCard();
    expect(() => card.setConfig(undefined as any)).toThrow("Invalid configuration");
  });
});

// ─── getCardSize ─────────────────────────────────────────────────────────────

describe("getCardSize", () => {
  it("returns 2", () => {
    expect(makeCard().getCardSize()).toBe(2);
  });
});

// ─── getStubConfig ───────────────────────────────────────────────────────────

describe("getStubConfig", () => {
  it("picks up to 2 lights (bottom-left) and 1 climate (top-right)", () => {
    const hass = {
      states: {
        "light.a": ent("light.a", "on"),
        "light.b": ent("light.b", "on"),
        "light.c": ent("light.c", "on"),
        "climate.main": ent("climate.main", "heat"),
        "switch.fan": ent("switch.fan", "on"),
      },
    } as unknown as HomeAssistant;

    const stub = RoomControlCard.getStubConfig(hass);

    expect(stub.entities_bottom_left).toHaveLength(2);
    expect(stub.entities_top_right).toHaveLength(1);
    expect(stub.entities_bottom_left[0].entity).toMatch(/^light\./);
    expect(stub.entities_top_right[0].entity).toMatch(/^climate\./);
  });

  it("returns empty arrays when no matching entities exist", () => {
    const hass = { states: {} } as unknown as HomeAssistant;
    const stub = RoomControlCard.getStubConfig(hass);
    expect(stub.entities_bottom_left).toHaveLength(0);
    expect(stub.entities_top_right).toHaveLength(0);
  });
});

// ─── _getAllEntityIds ─────────────────────────────────────────────────────────

describe("_getAllEntityIds", () => {
  it("collects IDs from all three sections in order", () => {
    const card = makeCard({
      entities_top_right: [ec("light.a")],
      entities_bottom_left: [ec("light.b"), ec("climate.c")],
      entities_bottom_right: [ec("switch.d")],
    });
    expect(card._getAllEntityIds()).toEqual(["light.a", "light.b", "climate.c", "switch.d"]);
  });

  it("returns empty array when no entities configured", () => {
    expect(makeCard()._getAllEntityIds()).toEqual([]);
  });

  it("handles missing sections gracefully", () => {
    const card = makeCard({ entities_bottom_left: [ec("light.x")] });
    expect(card._getAllEntityIds()).toEqual(["light.x"]);
  });
});

// ─── _isActive ───────────────────────────────────────────────────────────────

describe("_isActive", () => {
  describe("attribute-based checks", () => {
    it("returns true when attribute matches expected value", () => {
      const card = makeCard();
      const e = ent("climate.main", "heat", { hvac_action: "heating" });
      expect(
        card._isActive(ec("climate.main", { active_attribute: "hvac_action", active_attribute_value: "heating" }), e),
      ).toBe(true);
    });

    it("returns false when attribute does not match expected value", () => {
      const card = makeCard();
      const e = ent("climate.main", "heat", { hvac_action: "idle" });
      expect(
        card._isActive(ec("climate.main", { active_attribute: "hvac_action", active_attribute_value: "heating" }), e),
      ).toBe(false);
    });

    it("returns true for truthy attribute when no expected value set", () => {
      const card = makeCard();
      const e = ent("binary_sensor.motion", "on", { occupancy: true });
      expect(card._isActive(ec("binary_sensor.motion", { active_attribute: "occupancy" }), e)).toBe(true);
    });

    it("returns false for falsy attribute when no expected value set", () => {
      const card = makeCard();
      const e = ent("binary_sensor.motion", "on", { occupancy: false });
      expect(card._isActive(ec("binary_sensor.motion", { active_attribute: "occupancy" }), e)).toBe(false);
    });

    it("attribute check takes priority over state-based checks", () => {
      const card = makeCard();
      // state is "on" (would be active by default for light), but attribute is false
      const e = ent("light.test", "on", { my_attr: false });
      expect(card._isActive(ec("light.test", { active_attribute: "my_attr" }), e)).toBe(false);
    });
  });

  describe("custom active_states", () => {
    it("returns true when entity state is in active_states list", () => {
      const card = makeCard();
      const e = ent("media_player.tv", "playing", {});
      expect(card._isActive(ec("media_player.tv", { active_states: ["playing", "paused"] }), e)).toBe(true);
    });

    it("returns false when entity state is not in active_states list", () => {
      const card = makeCard();
      const e = ent("media_player.tv", "standby", {});
      expect(card._isActive(ec("media_player.tv", { active_states: ["playing", "paused"] }), e)).toBe(false);
    });

    it("custom active_states override domain defaults", () => {
      const card = makeCard();
      // light "off" would normally be inactive, but we explicitly list it
      const e = ent("light.test", "off", {});
      expect(card._isActive(ec("light.test", { active_states: ["off"] }), e)).toBe(true);
    });
  });

  describe("domain defaults", () => {
    it("light 'on' → active", () => {
      const card = makeCard();
      expect(card._isActive(ec("light.x"), ent("light.x", "on"))).toBe(true);
    });

    it("light 'off' → inactive", () => {
      const card = makeCard();
      expect(card._isActive(ec("light.x"), ent("light.x", "off"))).toBe(false);
    });

    it("switch 'on' → active, 'off' → inactive", () => {
      const card = makeCard();
      expect(card._isActive(ec("switch.x"), ent("switch.x", "on"))).toBe(true);
      expect(card._isActive(ec("switch.x"), ent("switch.x", "off"))).toBe(false);
    });

    it("lock 'unlocked' → active", () => {
      const card = makeCard();
      expect(card._isActive(ec("lock.x"), ent("lock.x", "unlocked"))).toBe(true);
    });

    it("climate heat/cool/auto → active", () => {
      const card = makeCard();
      expect(card._isActive(ec("climate.x"), ent("climate.x", "heat"))).toBe(true);
      expect(card._isActive(ec("climate.x"), ent("climate.x", "cool"))).toBe(true);
      expect(card._isActive(ec("climate.x"), ent("climate.x", "auto"))).toBe(true);
    });
  });

  describe("fallback for unknown domains", () => {
    it("any non-reserved state → active", () => {
      const card = makeCard();
      expect(card._isActive(ec("custom.thing"), ent("custom.thing", "active"))).toBe(true);
      expect(card._isActive(ec("custom.thing"), ent("custom.thing", "running"))).toBe(true);
    });

    it("'off' → inactive", () => {
      const card = makeCard();
      expect(card._isActive(ec("custom.thing"), ent("custom.thing", "off"))).toBe(false);
    });

    it("'unavailable' → inactive", () => {
      const card = makeCard();
      expect(card._isActive(ec("custom.thing"), ent("custom.thing", "unavailable"))).toBe(false);
    });

    it("'unknown' → inactive", () => {
      const card = makeCard();
      expect(card._isActive(ec("custom.thing"), ent("custom.thing", "unknown"))).toBe(false);
    });
  });
});

// ─── _getIcon ────────────────────────────────────────────────────────────────

describe("_getIcon", () => {
  it("returns ec.icon when explicitly set", () => {
    const card = makeCard();
    const e = ent("light.test", "on");
    expect(card._getIcon(ec("light.test", { icon: "mdi:lightbulb-on" }), e)).toBe("mdi:lightbulb-on");
  });

  it("ec.icon takes priority over entity attribute icon", () => {
    const card = makeCard();
    const e = ent("light.test", "on", { icon: "mdi:lamp" });
    expect(card._getIcon(ec("light.test", { icon: "mdi:lightbulb" }), e)).toBe("mdi:lightbulb");
  });

  it("falls back to entity attribute icon", () => {
    const card = makeCard();
    const e = ent("light.test", "on", { icon: "mdi:lamp" });
    expect(card._getIcon(ec("light.test"), e)).toBe("mdi:lamp");
  });

  it("uses device_class icon for temperature sensor", () => {
    const card = makeCard();
    const e = ent("sensor.temp", "21", { device_class: "temperature" });
    expect(card._getIcon(ec("sensor.temp"), e)).toBe("mdi:thermometer");
  });

  it("uses device_class icon for motion binary sensor", () => {
    const card = makeCard();
    const e = ent("binary_sensor.motion", "on", { device_class: "motion" });
    expect(card._getIcon(ec("binary_sensor.motion"), e)).toBe("mdi:motion-sensor");
  });

  it("uses domain icon when no device_class", () => {
    const card = makeCard();
    const e = ent("light.test", "on");
    expect(card._getIcon(ec("light.test"), e)).toBe(DOMAIN_ICONS["light"]);
  });

  it("returns mdi:help-circle for unknown domain and no overrides", () => {
    const card = makeCard();
    const e = ent("custom.thing", "on");
    expect(card._getIcon(ec("custom.thing"), e)).toBe("mdi:help-circle");
  });

  it("entity attribute icon takes priority over device_class icon", () => {
    const card = makeCard();
    const e = ent("sensor.temp", "21", { icon: "mdi:custom", device_class: "temperature" });
    expect(card._getIcon(ec("sensor.temp"), e)).toBe("mdi:custom");
  });
});

// ─── _getActiveColor ─────────────────────────────────────────────────────────

describe("_getActiveColor", () => {
  it("returns ec.active_color when set", () => {
    const card = makeCard();
    const e = ent("light.test", "on");
    expect(card._getActiveColor(ec("light.test", { active_color: "red" }), e)).toBe("red");
  });

  it("uses rgb_color from light attributes", () => {
    const card = makeCard();
    const e = ent("light.test", "on", { rgb_color: [255, 200, 100] });
    expect(card._getActiveColor(ec("light.test"), e)).toBe("rgb(255, 200, 100)");
  });

  it("falls back to domain color for light without rgb_color", () => {
    const card = makeCard();
    const e = ent("light.test", "on");
    expect(card._getActiveColor(ec("light.test"), e)).toBe(DOMAIN_ACTIVE_COLORS["light"]);
  });

  it("uses domain color for non-light domains", () => {
    const card = makeCard();
    const e = ent("climate.main", "heat");
    expect(card._getActiveColor(ec("climate.main"), e)).toBe(DOMAIN_ACTIVE_COLORS["climate"]);
  });

  it("returns generic active color for unknown domain", () => {
    const card = makeCard();
    const e = ent("custom.thing", "on");
    expect(card._getActiveColor(ec("custom.thing"), e)).toBe(
      "var(--state-icon-active-color, var(--primary-color))",
    );
  });

  it("ec.active_color takes priority over rgb_color", () => {
    const card = makeCard();
    const e = ent("light.test", "on", { rgb_color: [255, 0, 0] });
    expect(card._getActiveColor(ec("light.test", { active_color: "blue" }), e)).toBe("blue");
  });
});

// ─── _getInactiveColor ───────────────────────────────────────────────────────

describe("_getInactiveColor", () => {
  it("returns ec.inactive_color when set", () => {
    const card = makeCard();
    expect(card._getInactiveColor(ec("light.test", { inactive_color: "gray" }))).toBe("gray");
  });

  it("returns HA secondary text CSS variable by default", () => {
    const card = makeCard();
    expect(card._getInactiveColor(ec("light.test"))).toBe("var(--secondary-text-color)");
  });
});

// ─── _getDisplayValue ────────────────────────────────────────────────────────

describe("_getDisplayValue", () => {
  it("applies entity registry display_precision", () => {
    const card = makeCard({}, {}, { "sensor.temp": { display_precision: 1 } });
    const e = ent("sensor.temp", "21.567", { unit_of_measurement: "°C" });
    expect(card._getDisplayValue(e)).toBe("21.6°C");
  });

  it("entity registry precision takes priority over attribute precision", () => {
    const card = makeCard({}, {}, { "sensor.temp": { display_precision: 0 } });
    const e = ent("sensor.temp", "21.567", { unit_of_measurement: "°C", display_precision: 3 });
    expect(card._getDisplayValue(e)).toBe("22°C");
  });

  it("falls back to attribute display_precision when registry has no entry", () => {
    const card = makeCard();
    const e = ent("sensor.temp", "21.567", { unit_of_measurement: "°C", display_precision: 2 });
    expect(card._getDisplayValue(e)).toBe("21.57°C");
  });

  it("rounds to whole number when no precision is configured", () => {
    const card = makeCard();
    const e = ent("sensor.temp", "21.7", { unit_of_measurement: "°C" });
    expect(card._getDisplayValue(e)).toBe("22°C");
  });

  it("appends unit to non-numeric state", () => {
    const card = makeCard();
    const e = ent("media_player.tv", "playing", { unit_of_measurement: "%" });
    expect(card._getDisplayValue(e)).toBe("playing%");
  });

  it("returns raw state when non-numeric and no unit", () => {
    const card = makeCard();
    const e = ent("media_player.tv", "playing");
    expect(card._getDisplayValue(e)).toBe("playing");
  });
});

// ─── _getBorderRadiusStyle ───────────────────────────────────────────────────

describe("_getBorderRadiusStyle", () => {
  it("returns empty string when border_radius is not configured", () => {
    expect(makeCard()._getBorderRadiusStyle()).toBe("");
  });

  it("includes all four corner values in border-radius", () => {
    const card = makeCard({
      border_radius: { top_left: "4px", top_right: "8px", bottom_right: "12px", bottom_left: "16px" },
    });
    const style = card._getBorderRadiusStyle();
    expect(style).toContain("border-radius: 4px 8px 12px 16px");
  });

  it("uses HA default var for omitted corners", () => {
    const card = makeCard({ border_radius: { top_left: "20px" } });
    const style = card._getBorderRadiusStyle();
    expect(style).toContain("var(--ha-card-border-radius, 12px)");
  });

  it("computes padding-left from the larger of the two left corners", () => {
    const card = makeCard({
      border_radius: { top_left: "20px", bottom_left: "10px" },
    });
    // max(20, 10) = 20; max(8, round(20 * 0.6)) = max(8, 12) = 12
    expect(card._getBorderRadiusStyle()).toContain("padding-left: 12px");
  });

  it("computes padding-right from the right corners", () => {
    const card = makeCard({ border_radius: { top_right: "30px" } });
    // max(30, 0) = 30; max(8, round(30 * 0.6)) = max(8, 18) = 18
    const style = card._getBorderRadiusStyle();
    expect(style).toContain("padding-right: 18px");
    expect(style).not.toContain("padding-left");
  });

  it("enforces 8px minimum padding for small radii", () => {
    const card = makeCard({ border_radius: { top_left: "5px" } });
    // max(8, round(5 * 0.6)) = max(8, 3) = 8
    expect(card._getBorderRadiusStyle()).toContain("padding-left: 8px");
  });

  it("skips padding for non-parseable corner values (CSS vars)", () => {
    const card = makeCard({ border_radius: { top_left: "var(--my-radius)" } });
    const style = card._getBorderRadiusStyle();
    expect(style).not.toContain("padding-left");
  });
});

// ─── _handleAction ───────────────────────────────────────────────────────────

describe("_handleAction", () => {
  let card: CardInstance;

  beforeEach(() => {
    card = makeCard({
      entities_bottom_left: [ec("light.living")],
      entities_top_right: [ec("climate.main")],
    });
    vi.spyOn(window, "open").mockReturnValue(null);
    vi.spyOn(history, "pushState").mockReturnValue(undefined);
    vi.spyOn(window, "dispatchEvent");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("no-ops when action config is undefined", () => {
    card._handleAction(undefined);
    expect(card.dispatchEvent).not.toHaveBeenCalled();
  });

  it("no-ops for action=none", () => {
    card._handleAction({ action: "none" });
    expect(card.dispatchEvent).not.toHaveBeenCalled();
    expect(window.open).not.toHaveBeenCalled();
  });

  describe("more-info", () => {
    it("dispatches hass-more-info event with the first bottom-left entity", () => {
      card._handleAction({ action: "more-info" });
      expect(card.dispatchEvent).toHaveBeenCalledOnce();
      const event = card.dispatchEvent.mock.calls[0][0] as CustomEvent;
      expect(event.type).toBe("hass-more-info");
      expect(event.bubbles).toBe(true);
      expect(event.composed).toBe(true);
      expect(event.detail.entityId).toBe("light.living");
    });

    it("falls through to top-right entity when bottom-left is empty", () => {
      card = makeCard({ entities_top_right: [ec("climate.main")] });
      card._handleAction({ action: "more-info" });
      const event = card.dispatchEvent.mock.calls[0][0] as CustomEvent;
      expect(event.detail.entityId).toBe("climate.main");
    });

    it("does not dispatch when no entities are configured", () => {
      card = makeCard({});
      card._handleAction({ action: "more-info" });
      expect(card.dispatchEvent).not.toHaveBeenCalled();
    });
  });

  describe("navigate", () => {
    it("calls history.pushState and dispatches location-changed on window", () => {
      card._handleAction({ action: "navigate", navigation_path: "/lovelace/home" });
      expect(history.pushState).toHaveBeenCalledWith(null, "", "/lovelace/home");
      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({ type: "location-changed" }),
      );
    });

    it("no-ops when navigation_path is absent", () => {
      card._handleAction({ action: "navigate" });
      expect(history.pushState).not.toHaveBeenCalled();
    });
  });

  describe("url", () => {
    it("opens the url_path in a new tab", () => {
      card._handleAction({ action: "url", url_path: "https://example.com" });
      expect(window.open).toHaveBeenCalledWith("https://example.com", "_blank");
    });

    it("no-ops when url_path is absent", () => {
      card._handleAction({ action: "url" });
      expect(window.open).not.toHaveBeenCalled();
    });
  });

  describe("call-service", () => {
    it("splits domain.service and calls hass.callService", () => {
      card._handleAction({ action: "call-service", service: "light.toggle" });
      expect(card.hass.callService).toHaveBeenCalledWith("light", "toggle", {}, undefined);
    });

    it("passes service_data and target through", () => {
      card._handleAction({
        action: "call-service",
        service: "light.turn_on",
        service_data: { brightness: 128 },
        target: { entity_id: "light.living" },
      });
      expect(card.hass.callService).toHaveBeenCalledWith(
        "light",
        "turn_on",
        { brightness: 128 },
        { entity_id: "light.living" },
      );
    });

    it("no-ops when service is absent", () => {
      card._handleAction({ action: "call-service" });
      expect(card.hass.callService).not.toHaveBeenCalled();
    });
  });
});

// ─── Tap / hold timing ───────────────────────────────────────────────────────

describe("tap and hold timing", () => {
  let card: CardInstance;

  beforeEach(() => {
    vi.useFakeTimers();
    card = makeCard({ entities_bottom_left: [ec("light.test")] });
    card._handleAction = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("single tap fires tap_action after 250 ms", () => {
    card._config.tap_action = { action: "more-info" };
    card._handleTap();
    expect(card._handleAction).not.toHaveBeenCalled();
    vi.advanceTimersByTime(250);
    expect(card._handleAction).toHaveBeenCalledWith({ action: "more-info" });
  });

  it("tap defaults to more-info when tap_action is not configured", () => {
    card._handleTap();
    vi.advanceTimersByTime(250);
    expect(card._handleAction).toHaveBeenCalledWith({ action: "more-info" });
  });

  it("double tap fires double_tap_action immediately and cancels the pending single tap", () => {
    card._config.double_tap_action = { action: "navigate", navigation_path: "/foo" };
    card._handleTap();
    card._handleTap();
    expect(card._handleAction).toHaveBeenCalledWith({
      action: "navigate",
      navigation_path: "/foo",
    });
    vi.advanceTimersByTime(300);
    expect(card._handleAction).toHaveBeenCalledTimes(1);
  });

  it("double tap defaults to none when double_tap_action is not configured", () => {
    card._handleTap();
    card._handleTap();
    expect(card._handleAction).toHaveBeenCalledWith({ action: "none" });
  });

  it("hold fires hold_action after 500 ms and sets _held flag", () => {
    card._config.hold_action = { action: "more-info" };
    card._handlePointerDown();
    expect(card._handleAction).not.toHaveBeenCalled();
    vi.advanceTimersByTime(500);
    expect(card._handleAction).toHaveBeenCalledWith({ action: "more-info" });
    expect(card._held).toBe(true);
  });

  it("hold defaults to none when hold_action is not configured", () => {
    card._handlePointerDown();
    vi.advanceTimersByTime(500);
    expect(card._handleAction).toHaveBeenCalledWith({ action: "none" });
  });

  it("tap immediately after hold is swallowed and resets _held", () => {
    card._handlePointerDown();
    vi.advanceTimersByTime(500);
    card._handleTap();
    expect(card._handleAction).toHaveBeenCalledTimes(1); // hold only
    expect(card._held).toBe(false);
  });

  it("pointer up cancels the hold timer before it fires", () => {
    card._handlePointerDown();
    card._handlePointerUp();
    vi.advanceTimersByTime(600);
    expect(card._handleAction).not.toHaveBeenCalled();
    expect(card._held).toBe(false);
  });
});
