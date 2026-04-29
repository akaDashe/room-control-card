import { LitElement, html, css, nothing } from "lit";
import { property, state, customElement } from "lit/decorators.js";
import { EDITOR_TAG, DEFAULT_ACTIVE_STATES, THEME_COLORS } from "./const";
import type { RoomControlCardConfig, HomeAssistant, EntityConfig, ActionConfig } from "./types";

const ACTION_TYPES = [
  { value: "more-info", label: "More info" },
  { value: "navigate", label: "Navigate" },
  { value: "call-service", label: "Call service" },
  { value: "url", label: "Open URL" },
  { value: "none", label: "None" },
];

// Ensure HA lazy-loaded form components are available
const _loadPromise = (async () => {
  const needed = ["ha-entity-picker", "ha-icon-picker", "ha-switch", "ha-textfield"];
  if (needed.every((t) => customElements.get(t))) return;
  try {
    const helpers = await (window as any).loadCardHelpers?.();
    if (!helpers) return;
    const card = await helpers.createCardElement({
      type: "entities",
      entities: ["sun.sun"],
    });
    // Trigger the element to load its sub-components
    if (card) await card.constructor?.getConfigElement?.();
  } catch (_) {
    // Silently fail — components may already be loaded
  }
})();

@customElement(EDITOR_TAG)
export class RoomControlCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: RoomControlCardConfig;
  @state() private _expandedEntity: string = "";
  @state() private _ready = false;

  async connectedCallback() {
    super.connectedCallback();
    await _loadPromise;
    this._ready = true;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .card-config {
        padding: 0;
      }

      /* Sections using HA expansion panel style */
      .section {
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 8px;
        margin-bottom: 8px;
        overflow: visible;
      }
      .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        cursor: pointer;
        background: var(--card-background-color);
        user-select: none;
      }
      .section-header:hover {
        background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.04);
      }
      .section-title {
        font-size: 0.95rem;
        font-weight: 500;
        color: var(--primary-text-color);
      }
      .section-subtitle {
        font-size: 0.8rem;
        color: var(--secondary-text-color);
        margin-top: 2px;
      }
      .section-chevron {
        --mdc-icon-size: 24px;
        color: var(--secondary-text-color);
        transition: transform 0.2s ease;
      }
      .section-chevron.open {
        transform: rotate(180deg);
      }
      .section-content {
        padding: 0 16px 16px;
        overflow: visible;
      }

      /* Entity items */
      .entity-item {
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 8px;
        margin-bottom: 6px;
      }
      .entity-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
      }
      .entity-icon {
        --mdc-icon-size: 20px;
        color: var(--secondary-text-color);
      }
      .entity-label {
        flex: 1;
        font-size: 0.85rem;
        color: var(--primary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .entity-actions {
        display: flex;
        gap: 0;
        align-items: center;
      }
      .icon-btn {
        cursor: pointer;
        --mdc-icon-size: 20px;
        color: var(--secondary-text-color);
        padding: 4px;
        border-radius: 50%;
        transition: background 0.15s ease;
      }
      .icon-btn:hover {
        background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.08);
      }
      .icon-btn.remove:hover {
        color: var(--error-color, #f44336);
      }

      /* Entity options */
      .entity-options {
        padding: 8px 12px 12px;
        border-top: 1px solid var(--divider-color, #e0e0e0);
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .option-row {
        display: flex;
        gap: 8px;
        align-items: flex-end;
      }
      .option-row > * {
        flex: 1;
      }
      .form-label {
        font-size: 0.8rem;
        font-weight: 500;
        color: var(--secondary-text-color);
        margin-bottom: 4px;
      }
      .switch-option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 4px 0;
      }
      .switch-option span {
        font-size: 0.85rem;
        color: var(--primary-text-color);
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-top: 4px;
      }
      .chip {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 2px 8px;
        border-radius: 12px;
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
        color: var(--primary-color);
        font-size: 0.75rem;
        cursor: default;
      }
      .chip ha-icon {
        --mdc-icon-size: 14px;
        cursor: pointer;
      }
      .active-state-input {
        display: flex;
        gap: 4px;
        align-items: center;
      }
      .active-state-input input {
        flex: 1;
        background: transparent;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 4px;
        padding: 6px 8px;
        color: var(--primary-text-color);
        font-size: 0.85rem;
      }
      .active-state-input button {
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
        border: none;
        border-radius: 4px;
        padding: 6px 10px;
        font-size: 0.8rem;
        cursor: pointer;
      }

      /* Add entity picker */
      .add-entity {
        margin-top: 8px;
      }

      /* Border radius grid */
      .radius-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      /* Action editor */
      .action-select {
        width: 100%;
        background: var(--input-fill-color, var(--card-background-color, #fff));
        border: 1px solid var(--input-ink-color, var(--divider-color, #e0e0e0));
        border-radius: 4px;
        padding: 10px 12px;
        color: var(--primary-text-color);
        font-size: 0.85rem;
        outline: none;
      }

      ha-textfield,
      ha-icon-picker,
      ha-entity-picker {
        display: block;
        width: 100%;
      }

      /* Color dropdown */
      .color-select-wrap {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      .color-select-label {
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--secondary-text-color);
        margin-bottom: 4px;
      }
      .color-select {
        width: 100%;
        background: var(--input-fill-color, var(--card-background-color, #fff));
        border: 1px solid var(--input-ink-color, var(--divider-color, #e0e0e0));
        border-radius: 4px;
        padding: 10px 12px;
        color: var(--primary-text-color);
        font-size: 0.85rem;
        outline: none;
        appearance: auto;
      }
      .color-swatch {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 6px;
        vertical-align: middle;
      }
    `;
  }

  public setConfig(config: RoomControlCardConfig): void {
    this._config = config;
  }

  private _fire(): void {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _set(key: string, value: any): void {
    this._config = { ...this._config, [key]: value };
    this._fire();
  }

  // --- Entity list helpers ---
  private _updateEntity(section: string, index: number, update: Partial<EntityConfig>): void {
    const entities = [...((this._config as any)[section] || [])];
    entities[index] = { ...entities[index], ...update };
    this._set(section, entities);
  }

  private _removeEntity(section: string, index: number): void {
    const entities = ((this._config as any)[section] || []).filter(
      (_: EntityConfig, i: number) => i !== index,
    );
    this._set(section, entities);
    this._expandedEntity = "";
  }

  private _moveEntity(section: string, index: number, direction: -1 | 1): void {
    const entities = [...((this._config as any)[section] || [])];
    const target = index + direction;
    if (target < 0 || target >= entities.length) return;
    [entities[index], entities[target]] = [entities[target], entities[index]];
    this._set(section, entities);
    this._expandedEntity = `${section}-${target}`;
  }

  private _addEntity(section: string, entityId: string): void {
    const entities = [...((this._config as any)[section] || []), { entity: entityId }];
    this._set(section, entities);
  }

  private _addActiveState(section: string, index: number, state: string): void {
    const ec: EntityConfig = ((this._config as any)[section] || [])[index];
    if (!ec) return;
    const current = ec.active_states || [];
    if (!current.includes(state)) {
      this._updateEntity(section, index, {
        active_states: [...current, state],
      });
    }
  }

  private _removeActiveState(section: string, index: number, state: string): void {
    const ec: EntityConfig = ((this._config as any)[section] || [])[index];
    if (!ec) return;
    const updated = (ec.active_states || []).filter((s: string) => s !== state);
    this._updateEntity(section, index, {
      active_states: updated.length ? updated : undefined,
    });
  }

  // --- Renderers ---
  private _renderEntitySection(section: string, title: string, subtitle: string) {
    const entities: EntityConfig[] = (this._config as any)[section] || [];
    return html`
      <div class="section">
        <div class="section-header">
          <div>
            <div class="section-title">${title}</div>
            <div class="section-subtitle">${subtitle}</div>
          </div>
        </div>
        <div class="section-content">
          ${entities.map((ec, index) => {
            const entity = this.hass.states[ec.entity];
            const name = entity?.attributes?.friendly_name || ec.entity;
            const icon = ec.icon || entity?.attributes?.icon || "mdi:help-circle";
            const key = `${section}-${index}`;
            const isExpanded = this._expandedEntity === key;
            const domain = ec.entity.split(".")[0];
            const defaultStates = DEFAULT_ACTIVE_STATES[domain] || [];

            return html`
              <div class="entity-item">
                <div class="entity-header">
                  <ha-icon class="entity-icon" icon=${icon}></ha-icon>
                  <span class="entity-label">${name}</span>
                  <div class="entity-actions">
                    ${index > 0
                      ? html`<ha-icon
                          class="icon-btn"
                          icon="mdi:arrow-up"
                          @click=${(e: Event) => {
                            e.stopPropagation();
                            this._moveEntity(section, index, -1);
                          }}
                        ></ha-icon>`
                      : nothing}
                    ${index < entities.length - 1
                      ? html`<ha-icon
                          class="icon-btn"
                          icon="mdi:arrow-down"
                          @click=${(e: Event) => {
                            e.stopPropagation();
                            this._moveEntity(section, index, 1);
                          }}
                        ></ha-icon>`
                      : nothing}
                    <ha-icon
                      class="icon-btn"
                      icon="mdi:pencil"
                      @click=${(e: Event) => {
                        e.stopPropagation();
                        this._expandedEntity = isExpanded ? "" : key;
                      }}
                    ></ha-icon>
                    <ha-icon
                      class="icon-btn remove"
                      icon="mdi:close"
                      @click=${(e: Event) => {
                        e.stopPropagation();
                        this._removeEntity(section, index);
                      }}
                    ></ha-icon>
                  </div>
                </div>
                ${isExpanded
                  ? html`
                      <div class="entity-options">
                        <ha-entity-picker
                          .hass=${this.hass}
                          .value=${ec.entity}
                          .label=${"Entity"}
                          allow-custom-entity
                          @value-changed=${(e: CustomEvent) => {
                            e.stopPropagation();
                            this._updateEntity(section, index, {
                              entity: e.detail.value,
                            });
                          }}
                        ></ha-entity-picker>

                        <ha-icon-picker
                          .hass=${this.hass}
                          .label=${"Icon override"}
                          .value=${ec.icon || ""}
                          @value-changed=${(e: CustomEvent) => {
                            e.stopPropagation();
                            this._updateEntity(section, index, {
                              icon: e.detail.value || undefined,
                            });
                          }}
                        ></ha-icon-picker>

                        <div class="option-row">
                          <div class="color-select-wrap">
                            <span class="color-select-label">Active color</span>
                            <select
                              class="color-select"
                              @change=${(e: Event) =>
                                this._updateEntity(section, index, {
                                  active_color: (e.target as HTMLSelectElement).value || undefined,
                                })}
                            >
                              ${THEME_COLORS.map(
                                (c) => html`
                                  <option
                                    value=${c.value}
                                    ?selected=${(ec.active_color || "") === c.value}
                                  >
                                    ${c.label}
                                  </option>
                                `,
                              )}
                            </select>
                          </div>
                          <div class="color-select-wrap">
                            <span class="color-select-label">Inactive color</span>
                            <select
                              class="color-select"
                              @change=${(e: Event) =>
                                this._updateEntity(section, index, {
                                  inactive_color:
                                    (e.target as HTMLSelectElement).value || undefined,
                                })}
                            >
                              ${THEME_COLORS.map(
                                (c) => html`
                                  <option
                                    value=${c.value}
                                    ?selected=${(ec.inactive_color || "") === c.value}
                                  >
                                    ${c.label}
                                  </option>
                                `,
                              )}
                            </select>
                          </div>
                        </div>

                        <div>
                          <div class="form-label">
                            Active states
                            ${!ec.active_states?.length
                              ? html`<span style="opacity:0.6">
                                  (default: ${defaultStates.join(", ") || "any non-off"})</span
                                >`
                              : nothing}
                          </div>
                          <div class="chips">
                            ${(ec.active_states || []).map(
                              (s: string) => html`
                                <span class="chip">
                                  ${s}
                                  <ha-icon
                                    icon="mdi:close"
                                    @click=${() => this._removeActiveState(section, index, s)}
                                  ></ha-icon>
                                </span>
                              `,
                            )}
                          </div>
                          <div class="active-state-input">
                            <input
                              type="text"
                              placeholder="e.g. on, playing, &gt;20"
                              @keydown=${(e: KeyboardEvent) => {
                                if (e.key === "Enter") {
                                  const input = e.target as HTMLInputElement;
                                  const val = input.value.trim();
                                  if (val) {
                                    this._addActiveState(section, index, val);
                                    input.value = "";
                                  }
                                }
                              }}
                            />
                            <button
                              @click=${(e: Event) => {
                                const input = (e.target as HTMLElement)
                                  .previousElementSibling as HTMLInputElement;
                                const val = input.value.trim();
                                if (val) {
                                  this._addActiveState(section, index, val);
                                  input.value = "";
                                }
                              }}
                            >
                              Add
                            </button>
                          </div>
                        </div>

                        <div class="form-label">Active attribute (optional)</div>
                        <div class="option-row">
                          <ha-textfield
                            .label=${"Attribute name"}
                            .value=${ec.active_attribute || ""}
                            placeholder="e.g. hvac_action"
                            @input=${(e: any) =>
                              this._updateEntity(section, index, {
                                active_attribute: e.target.value || undefined,
                              })}
                          ></ha-textfield>
                          <ha-textfield
                            .label=${"Attribute value"}
                            .value=${ec.active_attribute_value || ""}
                            placeholder="e.g. heating"
                            @input=${(e: any) =>
                              this._updateEntity(section, index, {
                                active_attribute_value: e.target.value || undefined,
                              })}
                          ></ha-textfield>
                        </div>

                        <div class="switch-option">
                          <span>Show only when active</span>
                          <ha-switch
                            .checked=${ec.show_only_active === true}
                            @change=${(e: any) =>
                              this._updateEntity(section, index, {
                                show_only_active: e.target.checked || undefined,
                              })}
                          ></ha-switch>
                        </div>

                        <div class="switch-option">
                          <span>Show value</span>
                          <ha-switch
                            .checked=${ec.show_value === true}
                            @change=${(e: any) =>
                              this._updateEntity(section, index, {
                                show_value: e.target.checked || undefined,
                                value_position: e.target.checked
                                  ? ec.value_position || "right"
                                  : undefined,
                              })}
                          ></ha-switch>
                        </div>

                        ${ec.show_value
                          ? html`
                              <div class="switch-option">
                                <span>Value left of icon</span>
                                <ha-switch
                                  .checked=${ec.value_position === "left"}
                                  @change=${(e: any) =>
                                    this._updateEntity(section, index, {
                                      value_position: e.target.checked ? "left" : undefined,
                                    })}
                                ></ha-switch>
                              </div>
                            `
                          : nothing}

                        <div class="switch-option">
                          <span>Hide icon (value only)</span>
                          <ha-switch
                            .checked=${ec.hide_icon === true}
                            @change=${(e: any) =>
                              this._updateEntity(section, index, {
                                hide_icon: e.target.checked || undefined,
                              })}
                          ></ha-switch>
                        </div>
                      </div>
                    `
                  : nothing}
              </div>
            `;
          })}
          <div class="add-entity">
            <ha-entity-picker
              .hass=${this.hass}
              .label=${"Add entity"}
              .value=${""}
              allow-custom-entity
              @value-changed=${(e: CustomEvent) => {
                e.stopPropagation();
                const val = e.detail.value;
                if (!val) return;
                this._addEntity(section, val);
                const picker = e.target as any;
                // Reset the combo-box inside ha-entity-picker
                requestAnimationFrame(() => {
                  picker.value = "";
                  if (picker.comboBox) picker.comboBox.selectedItem = undefined;
                  picker.requestUpdate?.();
                });
              }}
            ></ha-entity-picker>
          </div>
        </div>
      </div>
    `;
  }

  private _renderBorderRadius() {
    const br = this._config.border_radius || {};
    return html`
      <div class="section">
        <div class="section-header">
          <div>
            <div class="section-title">Border Radius</div>
            <div class="section-subtitle">Set each corner independently</div>
          </div>
        </div>
        <div class="section-content">
          <div class="radius-grid">
            <ha-textfield
              .label=${"Top left"}
              .value=${br.top_left || ""}
              @input=${(e: any) =>
                this._set("border_radius", {
                  ...br,
                  top_left: e.target.value || undefined,
                })}
            ></ha-textfield>
            <ha-textfield
              .label=${"Top right"}
              .value=${br.top_right || ""}
              @input=${(e: any) =>
                this._set("border_radius", {
                  ...br,
                  top_right: e.target.value || undefined,
                })}
            ></ha-textfield>
            <ha-textfield
              .label=${"Bottom left"}
              .value=${br.bottom_left || ""}
              @input=${(e: any) =>
                this._set("border_radius", {
                  ...br,
                  bottom_left: e.target.value || undefined,
                })}
            ></ha-textfield>
            <ha-textfield
              .label=${"Bottom right"}
              .value=${br.bottom_right || ""}
              @input=${(e: any) =>
                this._set("border_radius", {
                  ...br,
                  bottom_right: e.target.value || undefined,
                })}
            ></ha-textfield>
          </div>
        </div>
      </div>
    `;
  }

  private _renderActionEditor(key: string, label: string) {
    const action: ActionConfig = (this._config as any)[key] || {
      action: key === "tap_action" ? "more-info" : "none",
    };

    return html`
      <div style="margin-bottom: 8px">
        <div class="form-label">${label}</div>
        <select
          class="action-select"
          @change=${(e: Event) => this._set(key, { action: (e.target as HTMLSelectElement).value })}
        >
          ${ACTION_TYPES.map(
            (t) =>
              html`<option value=${t.value} ?selected=${t.value === action.action}>
                ${t.label}
              </option>`,
          )}
        </select>
        ${action.action === "navigate"
          ? html`<ha-textfield
              .label=${"Navigation path"}
              .value=${action.navigation_path || ""}
              style="margin-top:4px"
              @input=${(e: any) => this._set(key, { ...action, navigation_path: e.target.value })}
            ></ha-textfield>`
          : nothing}
        ${action.action === "url"
          ? html`<ha-textfield
              .label=${"URL"}
              .value=${action.url_path || ""}
              style="margin-top:4px"
              @input=${(e: any) => this._set(key, { ...action, url_path: e.target.value })}
            ></ha-textfield>`
          : nothing}
        ${action.action === "call-service"
          ? html`<ha-textfield
              .label=${"Service (e.g. light.toggle)"}
              .value=${action.service || ""}
              style="margin-top:4px"
              @input=${(e: any) => this._set(key, { ...action, service: e.target.value })}
            ></ha-textfield>`
          : nothing}
      </div>
    `;
  }

  protected render() {
    if (!this.hass || !this._config || !this._ready) return html``;

    return html`
      <div class="card-config">
        <ha-textfield
          .label=${"Room Name"}
          .value=${this._config.name || ""}
          style="margin-bottom: 12px"
          @input=${(e: any) => this._set("name", e.target.value)}
        ></ha-textfield>

        <ha-icon-picker
          .hass=${this.hass}
          .label=${"Room Icon (optional)"}
          .value=${this._config.icon || ""}
          style="margin-bottom: 12px"
          @value-changed=${(e: CustomEvent) => {
            e.stopPropagation();
            this._set("icon", e.detail.value || undefined);
          }}
        ></ha-icon-picker>

        ${this._renderEntitySection(
          "entities_top_right",
          "Top Right",
          "Icons aligned right on the title row",
        )}
        ${this._renderEntitySection(
          "entities_bottom_left",
          "Bottom Left",
          "Icons on the bottom row, left side",
        )}
        ${this._renderEntitySection(
          "entities_bottom_right",
          "Bottom Right",
          "Icons on the bottom row, right side",
        )}
        ${this._renderBorderRadius()}

        <div class="section">
          <div class="section-header">
            <div>
              <div class="section-title">Actions</div>
              <div class="section-subtitle">Tap, double tap, and hold</div>
            </div>
          </div>
          <div class="section-content">
            ${this._renderActionEditor("tap_action", "Tap action")}
            ${this._renderActionEditor("double_tap_action", "Double tap action")}
            ${this._renderActionEditor("hold_action", "Hold action")}
          </div>
        </div>
      </div>
    `;
  }
}
