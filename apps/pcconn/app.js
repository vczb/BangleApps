var btnActionList = [
  "Click",
  // "Space press", // TODO
  // "Mic On/Off", // TODO
  // "Cam On/Off", // TODO
  "None",
];

var dragActionList = ["None", "Mouse move"];

var btnAction = "Click";
var dragAction = "None";

var PcConMenu = {
  "": {
    title: "PcConn Menu",
  },
  App: function () {
    draw();
  },
  Btn: {
    value: 0,
    min: 0,
    max: btnActionList.length - 1,
    format: (v) => btnActionList[v],
    onchange: (v) => {
      btnAction = btnActionList[v];
    },
  },
  Drag: {
    value: 0,
    min: 0,
    max: dragActionList.length - 1,
    format: (v) => dragActionList[v],
    onchange: (v) => {
      dragAction = dragActionList[v];
    },
  },
  Touch: {},
  Swipe: {},
  Exit: function () {
    load();
  },
};

E.showMenu(PcConMenu);

function draw() {
  g.clear();

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
    touch: function (n, e) {},
    swipe: function (dir) {},
    drag: function (e) {
      if (dragAction === "None") return;

      const data = Object.assign(e, { event: "drag" });
      Bluetooth.print(JSON.stringify(data));
    },
    btn: function () {
      if (btnAction === "None") return;

      const data = Object.assign({}, { event: "btn1" });
      Bluetooth.print(JSON.stringify(data));
    },
    clock: 0,
  });
}
