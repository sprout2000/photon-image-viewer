import { useCallback, useEffect, useState } from "react";

import { Grid } from "./Grid";
import { Header } from "./Header";
import { View } from "./View";

import "./App.scss";
import type { IpcRendererEvent } from "electron";

const { myAPI } = window;

export const App = () => {
  const [url, setUrl] = useState("");
  const [grid, setGrid] = useState(false);
  const [imgList, setImgList] = useState<string[]>([]);

  const preventDefault = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    if (grid) {
      return false;
    }

    preventDefault(e);

    if (e.dataTransfer) {
      const file = e.dataTransfer.files[0];

      if (file.name.startsWith(".")) return;

      const mime = await myAPI.mimecheck(file.path);
      if (mime) setUrl(file.path);
    }
  };

  const handleNext = useCallback(async () => {
    if (!url) return;
    if (grid) setGrid(false);

    const dir = await myAPI.dirname(url);
    if (!dir) {
      window.location.reload();
      return;
    }

    const list = await myAPI.readdir(dir);
    if (!list || list.length === 0) {
      window.location.reload();
      return;
    }

    if (list.length === 1) return;

    const index = list.indexOf(url);
    if (index === list.length - 1 || index === -1) {
      setUrl(list[0]);
    } else {
      setUrl(list[index + 1]);
    }
  }, [url, grid]);

  const handlePrev = useCallback(async () => {
    if (!url) return;
    if (grid) setGrid(false);

    const dir = await myAPI.dirname(url);
    if (!dir) {
      window.location.reload();
      return;
    }

    const list = await myAPI.readdir(dir);
    if (!list || list.length === 0) {
      window.location.reload();
      return;
    }

    if (list.length === 1) return;

    const index = list.indexOf(url);
    if (index === 0) {
      setUrl(list[list.length - 1]);
    } else if (index === -1) {
      setUrl(list[0]);
    } else {
      setUrl(list[index - 1]);
    }
  }, [url, grid]);

  const handleRemove = useCallback(async () => {
    if (!url) return;

    const dir = await myAPI.dirname(url);
    if (!dir) {
      window.location.reload();
      return;
    }

    const list = await myAPI.readdir(dir);
    if (!list || list.length === 0 || !list.includes(url)) {
      window.location.reload();
      return;
    }

    const index = list.indexOf(url);

    await myAPI.moveToTrash(url);
    const newList = await myAPI.readdir(dir);

    if (!newList || newList.length === 0) {
      window.location.reload();
      return;
    }

    setImgList(newList);

    if (index > newList.length - 1) {
      setUrl(newList[0]);
    } else {
      setUrl(newList[index]);
    }
  }, [url]);

  const handleClickOpen = useCallback(async () => {
    const filepath = await myAPI.openDialog();
    if (!filepath) return;

    const mime = await myAPI.mimecheck(filepath);
    if (mime) {
      setUrl(filepath);
      setGrid(false);
    }
  }, []);

  const handleMenuOpen = useCallback(
    async (_e: IpcRendererEvent, filepath: string) => {
      if (!filepath) return;
      if (grid) setGrid(false);

      const mime = await myAPI.mimecheck(filepath);
      if (mime) setUrl(filepath);
    },
    [grid],
  );

  const handleToggleGrid = useCallback(async () => {
    if (!url) return;

    const dir = await myAPI.dirname(url);
    if (!dir) {
      window.location.reload();
      return;
    }

    const list = await myAPI.readdir(dir);
    if (!list || list.length === 0 || !list.includes(url)) {
      window.location.reload();
      return;
    }

    if (!grid) {
      setImgList(list);
      setGrid(true);
    } else {
      setGrid(false);
    }
  }, [grid, url]);

  const handleClickThumb = async (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    item: string,
  ) => {
    e.stopPropagation();

    const dir = await myAPI.dirname(item);
    if (!dir) {
      window.location.reload();
      return;
    }

    const list = await myAPI.readdir(dir);
    if (!list || list.length === 0 || !list.includes(item)) {
      window.location.reload();
      return;
    }

    setUrl(item);
    setGrid(false);
  };

  const handleClickBlank = async () => {
    const dir = await myAPI.dirname(url);
    if (!dir) {
      window.location.reload();
      return;
    }

    const list = await myAPI.readdir(dir);
    if (!list || list.length === 0 || !list.includes(url)) {
      window.location.reload();
      return;
    }

    setGrid(false);
  };

  useEffect(() => {
    const unlistenFn = myAPI.menuNext(handleNext);
    return () => {
      unlistenFn();
    };
  }, [handleNext]);

  useEffect(() => {
    const unlistenFn = myAPI.menuPrev(handlePrev);
    return () => {
      unlistenFn();
    };
  }, [handlePrev]);

  useEffect(() => {
    const unlistenFn = myAPI.menuRemove(handleRemove);
    return () => {
      unlistenFn();
    };
  }, [handleRemove]);

  useEffect(() => {
    const unlistenFn = myAPI.menuOpen(handleMenuOpen);
    return () => {
      unlistenFn();
    };
  }, [handleMenuOpen]);

  useEffect(() => {
    const unlistenFn = myAPI.toggleGrid(handleToggleGrid);
    return () => {
      unlistenFn();
    };
  }, [handleToggleGrid]);

  return (
    <>
      <Header
        url={url}
        onClickOpen={handleClickOpen}
        onNext={handleNext}
        onPrev={handlePrev}
        onRemove={handleRemove}
        onToggleGrid={handleToggleGrid}
      />
      <div
        className={grid ? "container grid" : "container"}
        onDrop={handleDrop}
        onDragOver={preventDefault}
        onDragEnter={preventDefault}
        onDragLeave={preventDefault}
      >
        {grid ? (
          <Grid
            url={url}
            imgList={imgList}
            onClickBlank={handleClickBlank}
            onClickThumb={handleClickThumb}
          />
        ) : (
          <View url={url} />
        )}
      </div>
    </>
  );
};
