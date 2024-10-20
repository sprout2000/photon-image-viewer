import { type IpcRendererEvent, contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("myAPI", {
  mimecheck: (filepath: string): Promise<boolean> =>
    ipcRenderer.invoke("mime-check", filepath),

  dirname: (filepath: string): Promise<string> =>
    ipcRenderer.invoke("dirname", filepath),

  readdir: (dirpath: string): Promise<void | string[]> =>
    ipcRenderer.invoke("readdir", dirpath),

  moveToTrash: (filepath: string): Promise<void> =>
    ipcRenderer.invoke("move-to-trash", filepath),

  openDialog: (): Promise<string | void | undefined> =>
    ipcRenderer.invoke("open-dialog"),

  menuNext: (listener: () => Promise<void>) => {
    ipcRenderer.on("menu-next", listener);
    return () => ipcRenderer.removeAllListeners("menu-next");
  },

  menuPrev: (listener: () => Promise<void>) => {
    ipcRenderer.on("menu-prev", listener);
    return () => ipcRenderer.removeAllListeners("menu-prev");
  },

  menuRemove: (listener: () => Promise<void>) => {
    ipcRenderer.on("menu-remove", listener);
    return () => ipcRenderer.removeAllListeners("menu-remove");
  },

  menuOpen: (
    listener: (_e: IpcRendererEvent, filepath: string) => Promise<void>,
  ) => {
    ipcRenderer.on("menu-open", listener);
    return () => ipcRenderer.removeAllListeners("menu-open");
  },

  toggleGrid: (
    listener: (_e: IpcRendererEvent, filepath: string) => Promise<void>,
  ) => {
    ipcRenderer.on("toggle-grid", listener);
    return () => ipcRenderer.removeAllListeners("toggle-grid");
  },
});
