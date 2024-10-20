import fs from "node:fs";
import path from "node:path";

import {
  BrowserWindow,
  type IpcMainInvokeEvent,
  Menu,
  app,
  dialog,
  ipcMain,
  nativeTheme,
  shell,
} from "electron";

import Store from "electron-store";
import mime from "mime-types";

import { createMenu } from "./createMenu";

let openfile: string | null = null;

const initWidth = 800;
const initHeight = 528;
const isDev = process.env.NODE_ENV === "development";

const store = new Store<StoreType>({
  configFileMode: 0o666,
  defaults: {
    x: undefined,
    y: undefined,
    width: initWidth,
    height: initHeight,
  },
});

const getResourceDirectory = () => {
  return isDev
    ? path.join(process.cwd(), "dist")
    : path.join(process.resourcesPath, "app.asar.unpacked", "dist");
};

const checkmime = (filepath: string) => {
  const regexp = new RegExp(/bmp|ico|gif|jpeg|png|svg|webp/);
  const mimetype = mime.lookup(filepath);

  return (mimetype && regexp.test(mimetype)) || false;
};

const createWindow = () => {
  const dotfiles = ".";

  const mainWindow = new BrowserWindow({
    show: false,
    frame: false,
    titleBarStyle: "hidden",
    x: store.get("x"),
    y: store.get("y"),
    minWidth: initWidth,
    minHeight: initHeight,
    width: store.get("width"),
    height: store.get("height"),
    icon: path.resolve(getResourceDirectory(), "logo.png"),
    webPreferences: {
      safeDialogs: true,
      devTools: isDev,
      preload: path.resolve(__dirname, "preload.js"),
    },
  });

  nativeTheme.themeSource = "light";

  const menu = createMenu(mainWindow);
  Menu.setApplicationMenu(menu);

  ipcMain.handle("mime-check", (_e: IpcMainInvokeEvent, filepath: string) => {
    return checkmime(filepath);
  });

  ipcMain.handle("dirname", (_e: IpcMainInvokeEvent, filepath: string) => {
    return path.dirname(filepath);
  });

  ipcMain.handle("readdir", async (_e: IpcMainInvokeEvent, dir: string) => {
    return fs.promises
      .readdir(dir, { withFileTypes: true })
      .then((dirents) =>
        dirents
          .filter((dirent) => dirent.isFile())
          .filter(({ name }) => !name.startsWith(dotfiles))
          .map(({ name }) => path.resolve(dir, name))
          .filter((item) => checkmime(item))
          .sort(),
      )
      .catch((err) => console.log(err));
  });

  ipcMain.handle("open-dialog", async () => {
    return dialog
      .showOpenDialog(mainWindow, {
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
        if (path.basename(result.filePaths[0]).startsWith(dotfiles)) return;

        return result.filePaths[0];
      })
      .catch((err) => console.log(err));
  });

  ipcMain.handle(
    "move-to-trash",
    async (_e: IpcMainInvokeEvent, filepath: string) => {
      await shell.trashItem(filepath);
    },
  );

  mainWindow.webContents.once("did-finish-load", () => {
    if (openfile) {
      if (path.basename(openfile).startsWith(dotfiles)) {
        openfile = null;
        return;
      }

      mainWindow.webContents.send("menu-open", openfile);
      openfile = null;
    }
  });

  app.on("open-file", (e, filepath) => {
    e.preventDefault();

    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();

    if (path.basename(filepath).startsWith(dotfiles)) return;

    mainWindow.webContents.send("menu-open", filepath);
  });

  mainWindow.loadFile("dist/index.html");
  mainWindow.once("ready-to-show", () => {
    if (isDev) mainWindow.webContents.openDevTools({ mode: "detach" });
    mainWindow.show();
  });

  mainWindow.once("close", () => {
    const { x, y, width, height } = mainWindow.getBounds();
    store.set({ x, y, width, height });
  });
};

app.once("will-finish-launching", () => {
  app.once("open-file", (e, filepath) => {
    e.preventDefault();
    openfile = filepath;
  });
});

app.whenReady().then(() => createWindow());

app.once("window-all-closed", () => app.exit());
