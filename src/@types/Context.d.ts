declare global {
  interface Window {
    myAPI: IElectronAPI;
  }
}

export interface IElectronAPI {
  getFilePath: (file: File) => string;

  mimecheck: (filepath: string) => Promise<boolean>;

  dirname: (filepath: string) => Promise<string>;

  readdir: (dirpath: string) => Promise<void | string[]>;

  moveToTrash: (filepath: string) => Promise<void>;

  openDialog: () => Promise<string | void | undefined>;

  menuNext: (listener: () => Promise<void>) => () => Electron.IpcRenderer;

  menuPrev: (listener: () => Promise<void>) => () => Electron.IpcRenderer;

  menuRemove: (listener: () => Promise<void>) => () => Electron.IpcRenderer;

  menuOpen: (
    listener: (
      _e: Electron.IpcRendererEvent,
      filepath: string,
    ) => Promise<void>,
  ) => () => Electron.IpcRenderer;

  toggleGrid: (
    listener: (
      _e: Electron.IpcRendererEvent,
      filepath: string,
    ) => Promise<void>,
  ) => () => Electron.IpcRenderer;
}
