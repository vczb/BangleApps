const btnEvents = ["Click", "Print Screen", "None"];
const dragEvents = ["None", "Mouse move"];
const touchEvents = ["None", "Click", "Space press", "Ctrl+D"];
const swipeEvents = ["None", "Volume"];

const DEFAULT_SETTINGS = {
  btnEvent: "Click",
  dragEvent: "None",
  touchEvent: "None",
  swipeEvent: "Volume",
};

let settings = Object.assign({}, DEFAULT_SETTINGS);

const SETTINGS_FILE = "pcconsettings.json";

function saveSettings() {
  require("Storage").write(SETTINGS_FILE, settings);
}

function loadSettings() {
  const loadedSettings = require("Storage").readJSON(SETTINGS_FILE, true);
  if (loadedSettings) {
    settings = Object.assign({}, DEFAULT_SETTINGS, loadedSettings);
  }
}

function handleSettingChange(setting, value, eventArray) {
  settings[setting] = eventArray[value];
  saveSettings();
}

loadSettings();

const PcConMenu = {
  "": { title: "PcConn Menu" },
  App: function () {
    draw();
  },
  Btn: {
    value: btnEvents.indexOf(settings.btnEvent),
    min: 0,
    max: btnEvents.length - 1,
    format: (v) => btnEvents[v],
    onchange: (v) => handleSettingChange("btnEvent", v, btnEvents),
  },
  Drag: {
    value: dragEvents.indexOf(settings.dragEvent),
    min: 0,
    max: dragEvents.length - 1,
    format: (v) => dragEvents[v],
    onchange: (v) => handleSettingChange("dragEvent", v, dragEvents),
  },
  Touch: {
    value: touchEvents.indexOf(settings.touchEvent),
    min: 0,
    max: touchEvents.length - 1,
    format: (v) => touchEvents[v],
    onchange: (v) => handleSettingChange("touchEvent", v, touchEvents),
  },
  Swipe: {
    value: swipeEvents.indexOf(settings.swipeEvent),
    min: 0,
    max: swipeEvents.length - 1,
    format: (v) => swipeEvents[v],
    onchange: (v) => handleSettingChange("swipeEvent", v, swipeEvents),
  },
  Exit: function () {
    load();
  },
};

E.showMenu(PcConMenu);

function draw() {
  g.clear();
  g.drawString(":)", g.getWidth() / 2, g.getHeight() / 2);
  Bangle.setLCDPower(1);

  Bangle.setUI({
    mode: "custom",
    back: function () {
      E.showMenu(PcConMenu);
    },
    remove: function () {},
    redraw: function () {},
    touch: handleTouch,
    swipe: handleSwipe,
    drag: handleDrag,
    btn: handleBtn,
    clock: 0,
  });
}

function sendBluetoothEvent(data) {
  try {
    Bluetooth.print(JSON.stringify(data));
  } catch (error) {
    console.error("Bluetooth error:", error);
  }
}

function handleTouch(n, e) {
  if (settings.touchEvent === "None") return;

  const eventMap = {
    "Space press": { key: "space", event: "keypress" },
    "Ctrl+d": { key: "Ctrl+d", event: "keypress" },
  };

  const eventData = eventMap[settings.touchEvent];
  if (eventData) sendBluetoothEvent(eventData);
}

function handleSwipe(dir) {
  if (settings.swipeEvent === "None") return;

  if (settings.swipeEvent === "Volume") {
    const key = dir === 1 ? "XF86AudioRaiseVolume" : "XF86AudioLowerVolume";
    sendBluetoothEvent({ key, event: "keypress" });
  }
}

function handleDrag(e) {
  if (settings.dragEvent === "None") return;

  sendBluetoothEvent(Object.assign({}, e, { event: "mouse_move" }));
}

function handleBtn() {
  if (settings.btnEvent === "None") return;

  const eventMap = {
    "Print Screen": { key: "Print", event: "keypress" },
    Click: { event: "click" },
  };

  const eventData = eventMap[settings.btnEvent];
  if (eventData) sendBluetoothEvent(eventData);
}
