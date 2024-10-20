import { ToolBar } from "./ToolBar";
import "./Header.scss";
import { memo } from "react";

type Props = {
  url: string;
  onPrev: () => Promise<void>;
  onNext: () => Promise<void>;
  onRemove: () => Promise<void>;
  onClickOpen: () => Promise<void>;
  onToggleGrid: () => Promise<void>;
};

export const Header = memo((props: Props) => {
  const basename = props.url.replace(/.*[/|\\]/, "");

  return (
    <header className="toolbar toolbar-header draggable">
      <div className="title-bar">
        <h1 className="title">{basename || "Photon Image Viewer"}</h1>
      </div>
      <ToolBar
        onClickOpen={props.onClickOpen}
        onNext={props.onNext}
        onPrev={props.onPrev}
        onRemove={props.onRemove}
        onToggleGrid={props.onToggleGrid}
      />
    </header>
  );
});

Header.displayName = "Header";
