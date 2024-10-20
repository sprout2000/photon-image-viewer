import path from "node:path";

import {
  type BrowserWindow,
  Menu,
  type MenuItemConstructorOptions,
  dialog,
} from "electron";

export const createMenu = (win: BrowserWindow) => {
  const template: MenuItemConstructorOptions[] = [
    {
      label: "Photon Image Viewer",
      submenu: [
        {
          role: "quit",
        },
      ],
    },
    {
      label: "File",
      submenu: [
        {
          label: "Open...",
          accelerator: "Cmd+O",
          click: () => {
            dialog
              .showOpenDialog(win, {
                properties: ["openFile"],
                title: "Select an image",
                filters: [
                  {
                    name: "Image files",
                    extensions: [
                      "bmp",
                      "gif",
                      "ico",
                      "jpg",
                      "jpeg",
                      "png",
                      "svg",
                      "webp",
                    ],
                  },
                ],
              })
              .then((result) => {
                if (result.canceled) return;

                if (path.basename(result.filePaths[0]).startsWith(".")) {
                  return;
                }

                win.webContents.send("menu-open", result.filePaths[0]);
              })
              .catch((err) => console.log(err));
          },
        },
        { type: "separator" },
        {
          label: "Move to Trash",
          accelerator: "Delete",
          click: () => win.webContents.send("menu-remove"),
        },
        { type: "separator" },
        {
          label: "Close",
          accelerator: "Cmd+W",
          role: "close",
        },
      ],
    },
    {
      label: "View",
      submenu: [
        {
          label: "Next Image",
          accelerator: "J",
          click: () => win.webContents.send("menu-next"),
        },
        {
          label: "Next Image (invisible)",
          accelerator: "Ctrl+N",
          click: () => win.webContents.send("menu-next"),
          visible: false,
        },
        {
          label: "Next Image (invisible)",
          accelerator: "Cmd+Right",
          click: () => win.webContents.send("menu-next"),
          visible: false,
        },
        {
          label: "Prev Image",
          accelerator: "K",
          click: () => win.webContents.send("menu-prev"),
        },
        {
          label: "Prev Image (invisible)",
          accelerator: "Ctrl+P",
          click: () => win.webContents.send("menu-prev"),
          visible: false,
        },
        {
          label: "Prev Image (invisible)",
          accelerator: "Cmd+Left",
          click: () => win.webContents.send("menu-prev"),
          visible: false,
        },
        { type: "separator" },
        {
          label: "Toggle Grid View",
          accelerator: "H",
          click: () => win.webContents.send("toggle-grid"),
        },
        {
          label: "Toggle Grid View (invisible)",
          accelerator: "Ctrl+G",
          click: () => win.webContents.send("toggle-grid"),
          visible: false,
        },
      ],
    },
    {
      label: "Window",
      submenu: [
        {
          label: "Minimize",
          role: "minimize",
          accelerator: "Cmd+M",
        },
        {
          label: "Zoom",
          click: () => {
            win.isMaximized() ? win.unmaximize() : win.maximize();
          },
        },
        { type: "separator" },
        {
          label: "Bring All to Front",
          role: "front",
        },
      ],
    },
  ];

  return Menu.buildFromTemplate(template);
};
