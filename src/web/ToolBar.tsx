import { memo } from "react";
import "./ToolBar.scss";

type Props = {
  onPrev: () => Promise<void>;
  onNext: () => Promise<void>;
  onRemove: () => Promise<void>;
  onClickOpen: () => Promise<void>;
  onToggleGrid: () => Promise<void>;
};

export const ToolBar = memo((props: Props) => {
  return (
    <div className="toolbar-actions">
      <button
        type="button"
        className="btn btn-default"
        onClick={props.onClickOpen}
      >
        <span className="icon icon-folder" />
      </button>

      <div className="btn-group">
        <button
          type="button"
          className="btn btn-default"
          onClick={props.onPrev}
        >
          <span className="icon icon-left-open" />
        </button>
        <button
          type="button"
          className="btn btn-default"
          onClick={props.onNext}
        >
          <span className="icon icon-right-open" />
        </button>
      </div>
      <button
        type="button"
        className="btn btn-default"
        onClick={props.onToggleGrid}
      >
        <span className="icon icon-layout" />
      </button>
      <button
        type="button"
        className="btn btn-default pull-right"
        onClick={props.onRemove}
      >
        <span className="icon icon-trash" />
      </button>
    </div>
  );
});
ToolBar.displayName = "ToolBar";
