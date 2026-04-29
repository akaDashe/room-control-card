export interface ActionConfig {
  action: "more-info" | "navigate" | "call-service" | "url" | "none";
  navigation_path?: string;
  url_path?: string;
  service?: string;
  service_data?: Record<string, unknown>;
  target?: { entity_id: string | string[] };
}

export interface EntityConfig {
  entity: string;
  icon?: string;
  active_color?: string;
  inactive_color?: string;
  active_states?: string[];
  active_attribute?: string;
  active_attribute_value?: string;
  show_only_active?: boolean;
  show_value?: boolean;
  hide_icon?: boolean;
  value_position?: "right" | "left";
}

export interface BorderRadius {
  top_left?: string;
  top_right?: string;
  bottom_left?: string;
  bottom_right?: string;
}

export interface RoomControlCardConfig {
  type: string;
  name: string;
  icon?: string;
  entities_top_right?: EntityConfig[];
  entities_bottom_left?: EntityConfig[];
  entities_bottom_right?: EntityConfig[];
  tap_action?: ActionConfig;
  double_tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  border_radius?: BorderRadius;
}

export interface EntityRegistryEntry {
  display_precision?: number;
  [key: string]: any;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  entities: Record<string, EntityRegistryEntry>;
  callService: (
    domain: string,
    service: string,
    data?: Record<string, unknown>,
    target?: { entity_id: string | string[] },
  ) => Promise<void>;
  language: string;
  themes: unknown;
  config: HassConfig;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
}

export interface HassConfig {
  unit_system: { temperature: string };
}
