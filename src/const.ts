export const CARD_TAG = "room-control-card";
export const EDITOR_TAG = "room-control-card-editor";
export const CARD_VERSION = "0.4.0";

export const DEFAULT_ACTIVE_STATES: Record<string, string[]> = {
  light: ["on"],
  switch: ["on"],
  fan: ["on"],
  climate: ["heat", "cool", "heat_cool", "fan_only", "auto"],
  media_player: ["playing", "paused", "on"],
  cover: ["open", "opening", "closing"],
  lock: ["unlocked"],
  binary_sensor: ["on"],
  sensor: [],
  camera: ["recording", "streaming"],
  vacuum: ["cleaning", "returning"],
  person: ["home"],
  device_tracker: ["home"],
};

export const DOMAIN_ACTIVE_COLORS: Record<string, string> = {
  light: "var(--amber-color, #ffc107)",
  switch: "var(--amber-color, #ffc107)",
  fan: "var(--teal-color, #009688)",
  climate: "var(--deep-orange-color, #ff6f22)",
  media_player: "var(--indigo-color, #3f51b5)",
  cover: "var(--blue-color, #2196f3)",
  lock: "var(--red-color, #f44336)",
  binary_sensor: "var(--blue-color, #2196f3)",
  sensor: "var(--teal-color, #009688)",
  camera: "var(--red-color, #f44336)",
  vacuum: "var(--green-color, #4caf50)",
  person: "var(--green-color, #4caf50)",
  device_tracker: "var(--green-color, #4caf50)",
};

export const THEME_COLORS: { value: string; label: string; color: string }[] = [
  { value: "", label: "Default", color: "" },
  { value: "var(--red-color)", label: "Red", color: "#f44336" },
  { value: "var(--pink-color)", label: "Pink", color: "#e91e63" },
  { value: "var(--purple-color)", label: "Purple", color: "#926bc7" },
  { value: "var(--deep-purple-color)", label: "Deep Purple", color: "#6e41ab" },
  { value: "var(--indigo-color)", label: "Indigo", color: "#3f51b5" },
  { value: "var(--blue-color)", label: "Blue", color: "#2196f3" },
  { value: "var(--light-blue-color)", label: "Light Blue", color: "#03a9f4" },
  { value: "var(--cyan-color)", label: "Cyan", color: "#00bcd4" },
  { value: "var(--teal-color)", label: "Teal", color: "#009688" },
  { value: "var(--green-color)", label: "Green", color: "#4caf50" },
  { value: "var(--light-green-color)", label: "Light Green", color: "#8bc34a" },
  { value: "var(--lime-color)", label: "Lime", color: "#cddc39" },
  { value: "var(--yellow-color)", label: "Yellow", color: "#ffeb3b" },
  { value: "var(--amber-color)", label: "Amber", color: "#ffc107" },
  { value: "var(--orange-color)", label: "Orange", color: "#ff9800" },
  { value: "var(--deep-orange-color)", label: "Deep Orange", color: "#ff6f22" },
  { value: "var(--brown-color)", label: "Brown", color: "#795548" },
  { value: "var(--grey-color)", label: "Grey", color: "#9e9e9e" },
  { value: "var(--blue-grey-color)", label: "Blue Grey", color: "#607d8b" },
];

export const DOMAIN_ICONS: Record<string, string> = {
  light: "mdi:lightbulb",
  switch: "mdi:toggle-switch",
  climate: "mdi:thermometer",
  media_player: "mdi:speaker",
  cover: "mdi:blinds-horizontal",
  lock: "mdi:lock",
  camera: "mdi:cctv",
  sensor: "mdi:eye",
  binary_sensor: "mdi:motion-sensor",
  fan: "mdi:fan",
  vacuum: "mdi:robot-vacuum",
  person: "mdi:account",
  device_tracker: "mdi:map-marker",
};
