import { LitElement, html, nothing, PropertyValues } from "lit";
import { property, state, customElement } from "lit/decorators.js";
import { cardStyles } from "./styles";
import {
  CARD_TAG,
  EDITOR_TAG,
  CARD_VERSION,
  DEFAULT_ACTIVE_STATES,
  DOMAIN_ACTIVE_COLORS,
  DOMAIN_ICONS,
} from "./const";
import type {
  RoomControlCardConfig,
  ActionConfig,
  EntityConfig,
  HomeAssistant,
  HassEntity,
} from "./types";

import "./editor";

console.info(
  `%c ROOM-CONTROL-CARD %c v${CARD_VERSION} `,
  "color: white; background: #4a90d9; font-weight: bold; padding: 2px 6px; border-radius: 4px 0 0 4px;",
  "color: #4a90d9; background: white; font-weight: bold; padding: 2px 6px; border-radius: 0 4px 4px 0;",
);

@customElement(CARD_TAG)
export class RoomControlCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: RoomControlCardConfig;

  private _dblClickTimer: ReturnType<typeof setTimeout> | null = null;
  private _holdTimer: ReturnType<typeof setTimeout> | null = null;
  private _held = false;

  static get styles() {
    return cardStyles;
  }

  public static getConfigElement() {
    return document.createElement(EDITOR_TAG);
  }

  public static getStubConfig(hass: HomeAssistant) {
    const lights = Object.keys(hass.states)
      .filter((e) => e.startsWith("light."))
      .slice(0, 2)
      .map((entity) => ({ entity }));
    const climate = Object.keys(hass.states)
      .filter((e) => e.startsWith("climate."))
      .slice(0, 1)
      .map((entity) => ({ entity }));
    return {
      type: `custom:${CARD_TAG}`,
      name: "Room",
      entities_bottom_left: lights,
      entities_top_right: climate,
    };
  }

  public setConfig(config: RoomControlCardConfig): void {
    if (!config) throw new Error("Invalid configuration");
    this._config = config;
  }

  public getCardSize(): number {
    return 2;
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (changedProps.has("_config")) return true;
    if (changedProps.has("hass")) {
      const oldHass = changedProps.get("hass") as HomeAssistant | undefined;
      if (!oldHass) return true;
      const ids = this._getAllEntityIds();
      return ids.some((id) => oldHass.states[id] !== this.hass.states[id]);
    }
    return true;
  }

  private _getAllEntityIds(): string[] {
    const c = this._config;
    return [
      ...(c.entities_top_right || []),
      ...(c.entities_bottom_left || []),
      ...(c.entities_bottom_right || []),
    ].map((ec) => ec.entity);
  }

  // --- Entity rendering ---
  private _getDomain(entityId: string): string {
    return entityId.split(".")[0];
  }

  private _isActive(ec: EntityConfig, entity: HassEntity): boolean {
    // Attribute-based check takes priority if configured
    if (ec.active_attribute) {
      const attrVal = String(entity.attributes[ec.active_attribute] ?? "");
      if (ec.active_attribute_value) {
        return attrVal === ec.active_attribute_value;
      }
      // If no value specified, treat truthy attribute as active
      return !!entity.attributes[ec.active_attribute];
    }
    // State-based check
    if (ec.active_states && ec.active_states.length > 0) {
      return ec.active_states.includes(entity.state);
    }
    const domain = this._getDomain(entity.entity_id);
    const defaults = DEFAULT_ACTIVE_STATES[domain];
    if (defaults && defaults.length > 0) {
      return defaults.includes(entity.state);
    }
    return entity.state !== "off" && entity.state !== "unavailable" && entity.state !== "unknown";
  }

  private _getIcon(ec: EntityConfig, entity: HassEntity): string {
    if (ec.icon) return ec.icon;
    if (entity.attributes.icon) return entity.attributes.icon;
    // Use device_class to pick a better icon for sensors/binary_sensors
    const domain = this._getDomain(entity.entity_id);
    const dc = entity.attributes.device_class;
    if (dc) {
      const dcIcons: Record<string, string> = {
        temperature: "mdi:thermometer",
        humidity: "mdi:water-percent",
        pressure: "mdi:gauge",
        illuminance: "mdi:brightness-5",
        battery: "mdi:battery",
        power: "mdi:flash",
        energy: "mdi:lightning-bolt",
        voltage: "mdi:sine-wave",
        current: "mdi:current-ac",
        gas: "mdi:meter-gas",
        moisture: "mdi:water",
        motion: "mdi:motion-sensor",
        door: "mdi:door-open",
        window: "mdi:window-open",
        opening: "mdi:door",
        occupancy: "mdi:home-account",
        vibration: "mdi:vibrate",
        smoke: "mdi:smoke-detector-variant",
        carbon_monoxide: "mdi:molecule-co",
        carbon_dioxide: "mdi:molecule-co2",
        pm25: "mdi:air-filter",
      };
      if (dcIcons[dc]) return dcIcons[dc];
    }
    return DOMAIN_ICONS[domain] || "mdi:help-circle";
  }

  private _getActiveColor(ec: EntityConfig, entity: HassEntity): string {
    if (ec.active_color) return ec.active_color;
    const domain = this._getDomain(entity.entity_id);
    if (domain === "light" && entity.attributes.rgb_color) {
      const [r, g, b] = entity.attributes.rgb_color;
      // Skip near-white colors: they're invisible on light-mode card backgrounds.
      // Perceived luminance threshold of 0.85 catches pure white and warm whites.
      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      if (lum < 0.85) return `rgb(${r}, ${g}, ${b})`;
    }
    return DOMAIN_ACTIVE_COLORS[domain] || "var(--state-icon-active-color, var(--primary-color))";
  }

  private _getInactiveColor(ec: EntityConfig): string {
    return ec.inactive_color || "var(--secondary-text-color)";
  }

  private _getDisplayValue(entity: HassEntity): string {
    const unit = entity.attributes.unit_of_measurement || "";
    const state = entity.state;
    const num = parseFloat(state);
    if (!isNaN(num) && isFinite(num)) {
      // Check entity registry for display_precision
      const reg = this.hass.entities?.[entity.entity_id];
      const precision = reg?.display_precision ?? entity.attributes.display_precision;
      if (precision != null) {
        return `${num.toFixed(precision)}${unit}`;
      }
      // No precision set — show whole number
      return `${Math.round(num)}${unit}`;
    }
    if (unit) return `${state}${unit}`;
    return state;
  }

  private _renderEntityIcons(entities: EntityConfig[]) {
    return entities.map((ec) => {
      const entity = this.hass.states[ec.entity];
      if (!entity) return nothing;
      const active = this._isActive(ec, entity);
      if (ec.show_only_active && !active) return nothing;
      const icon = this._getIcon(ec, entity);
      const color = active ? this._getActiveColor(ec, entity) : this._getInactiveColor(ec);
      const valueLeft = ec.show_value && ec.value_position === "left";
      const valueRight = ec.show_value && ec.value_position !== "left";
      const hideIcon = ec.hide_icon === true;
      const showValueOnly = hideIcon && !ec.show_value;
      return html`
        <span
          class="entity-item-wrap ${valueLeft ? "value-left" : ""} ${hideIcon ? "value-only" : ""}"
        >
          ${valueLeft
            ? html`<span class="entity-value" style="color: ${color}"
                >${this._getDisplayValue(entity)}</span
              >`
            : nothing}
          ${!hideIcon
            ? html`<ha-icon
                class="entity-icon ${active ? "" : "inactive"}"
                icon=${icon}
                style="color: ${color}"
              ></ha-icon>`
            : nothing}
          ${valueRight
            ? html`<span class="entity-value" style="color: ${color}"
                >${this._getDisplayValue(entity)}</span
              >`
            : nothing}
          ${showValueOnly
            ? html`<span class="entity-value" style="color: ${color}"
                >${this._getDisplayValue(entity)}</span
              >`
            : nothing}
        </span>
      `;
    });
  }

  // --- Border radius ---
  private _getBorderRadiusStyle(): string {
    const br = this._config.border_radius;
    if (!br) return "";
    const def = "var(--ha-card-border-radius, 12px)";
    const tl = br.top_left || def;
    const tr = br.top_right || def;
    const brt = br.bottom_right || def;
    const bl = br.bottom_left || def;
    // Padding aligns content inside the curve: r * (1 - cos(45°)) ≈ r * 0.29, clamped
    const parsePx = (v?: string): number => {
      if (!v) return 0;
      const n = Number.parseFloat(v.trim());
      return Number.isNaN(n) ? 0 : n;
    };
    const rLeft = Math.max(parsePx(br.top_left), parsePx(br.bottom_left));
    const rRight = Math.max(parsePx(br.top_right), parsePx(br.bottom_right));
    let style = `border-radius: ${tl} ${tr} ${brt} ${bl};`;
    if (rLeft > 0) style += ` padding-left: ${Math.max(8, Math.round(rLeft * 0.6))}px;`;
    if (rRight > 0) style += ` padding-right: ${Math.max(8, Math.round(rRight * 0.6))}px;`;
    return style;
  }

  // --- Actions ---
  private _handleAction(actionConfig: ActionConfig | undefined): void {
    if (!actionConfig || actionConfig.action === "none") return;
    switch (actionConfig.action) {
      case "more-info": {
        const entityId =
          this._config.entities_bottom_left?.[0]?.entity ||
          this._config.entities_top_right?.[0]?.entity ||
          this._config.entities_bottom_right?.[0]?.entity;
        if (entityId) {
          this.dispatchEvent(
            new CustomEvent("hass-more-info", {
              bubbles: true,
              composed: true,
              detail: { entityId },
            }),
          );
        }
        break;
      }
      case "navigate":
        if (actionConfig.navigation_path) {
          history.pushState(null, "", actionConfig.navigation_path);
          window.dispatchEvent(new Event("location-changed", { bubbles: true, composed: true }));
        }
        break;
      case "url":
        if (actionConfig.url_path) window.open(actionConfig.url_path, "_blank");
        break;
      case "call-service":
        if (actionConfig.service) {
          const [domain, service] = actionConfig.service.split(".");
          this.hass.callService(
            domain,
            service,
            actionConfig.service_data || {},
            actionConfig.target,
          );
        }
        break;
    }
  }

  private _handleTap(): void {
    if (this._held) {
      this._held = false;
      return;
    }
    if (this._dblClickTimer) {
      clearTimeout(this._dblClickTimer);
      this._dblClickTimer = null;
      this._handleAction(this._config.double_tap_action || { action: "none" });
      return;
    }
    this._dblClickTimer = setTimeout(() => {
      this._dblClickTimer = null;
      this._handleAction(this._config.tap_action || { action: "more-info" });
    }, 250);
  }

  private _handlePointerDown(): void {
    this._held = false;
    this._holdTimer = setTimeout(() => {
      this._held = true;
      this._handleAction(this._config.hold_action || { action: "none" });
    }, 500);
  }

  private _handlePointerUp(): void {
    if (this._holdTimer) {
      clearTimeout(this._holdTimer);
      this._holdTimer = null;
    }
  }

  // --- Render ---
  protected render() {
    if (!this._config || !this.hass) return html``;

    const topRight = this._config.entities_top_right || [];
    const bottomLeft = this._config.entities_bottom_left || [];
    const bottomRight = this._config.entities_bottom_right || [];
    const hasBottom = bottomLeft.length > 0 || bottomRight.length > 0;

    const icon = this._config.icon;

    return html`
      <ha-card
        style="${this._getBorderRadiusStyle()}"
        @click=${this._handleTap}
        @pointerdown=${this._handlePointerDown}
        @pointerup=${this._handlePointerUp}
        @pointercancel=${this._handlePointerUp}
      >
        <div class="card-layout">
          ${icon
            ? html`<div class="room-icon-wrap">
                <ha-icon class="room-icon" icon=${icon}></ha-icon>
              </div>`
            : nothing}
          <div class="card-content">
            <div class="top-row">
              ${!icon
                ? html`<span class="room-name">${this._config.name || "Room"}</span>`
                : nothing}
              ${topRight.length
                ? html`<div class="top-right-icons">${this._renderEntityIcons(topRight)}</div>`
                : nothing}
            </div>
            ${hasBottom
              ? html`
                  <div class="bottom-row">
                    <div class="bottom-left-icons">${this._renderEntityIcons(bottomLeft)}</div>
                    <div class="bottom-right-icons">${this._renderEntityIcons(bottomRight)}</div>
                  </div>
                `
              : nothing}
          </div>
        </div>
      </ha-card>
    `;
  }
}

// Register for card picker
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: CARD_TAG,
  name: "Room Control Card",
  description: "Compact room tile with entity status icons and tap actions",
  preview: true,
});
