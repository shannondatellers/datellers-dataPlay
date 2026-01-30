import powerbi from "powerbi-visuals-api";
import ISelectionId = powerbi.visuals.ISelectionId;
import Fill = powerbi.Fill;

export type ButtonIconTypes = "default" | "filled" | "btn" | "btn-fill" | "circle" | "circle-fill";

export const buttonNames = ["play", "pause", "stop", "previous", "next"];

// Default/Outlined icons
export const buttonIconsDefault = ["bi-play", "bi-pause", "bi-stop", "bi-skip-backward", "bi-skip-forward"];
// Filled icons
export const buttonIconsFill = ["bi-play-fill", "bi-pause-fill", "bi-stop-fill", "bi-skip-backward-fill", "bi-skip-forward-fill"];
// Button outlined icons
export const buttonIconsBtn = ["bi-play-btn", "bi-pause-btn", "bi-stop-btn", "bi-skip-backward-btn", "bi-skip-forward-btn"];
// Button filled icons
export const buttonIconsBtnFill = ["bi-play-btn-fill", "bi-pause-btn-fill", "bi-stop-btn-fill", "bi-skip-backward-btn-fill", "bi-skip-forward-btn-fill"];
// Circle outlined icons
export const buttonIconsCircle = ["bi-play-circle", "bi-pause-circle", "bi-stop-circle", "bi-skip-backward-circle", "bi-skip-forward-circle"];
// Circle filled icons
export const buttonIconsCircleFill = ["bi-play-circle-fill", "bi-pause-circle-fill", "bi-stop-circle-fill", "bi-skip-backward-circle-fill", "bi-skip-forward-circle-fill"];

export enum Status {
  Play = "Play",
  Pause = "Pause",
  Stop = "Stop",
}

export interface IViewModel {
  dataPoints: ICategoryDataPoint[];
  settings: ISettings;
  categoryDisplay: string;
}

export interface ICategoryDataPoint {
  category: string;
  sortValue: any;
  selectionId: ISelectionId;
}

export interface ISettings {
  transitionSettings: {
    autoStart: boolean;
    loop: boolean;
    timeInterval: number;
    bin: number;
  };
  buttonSetting: {
    minimal: boolean;
    dynamicSize: boolean;
    buttonSize: number;
    pickedColor: Fill;
    showAll: boolean;
    playColor: Fill;
    pauseColor: Fill;
    stopColor: Fill;
    previousColor: Fill;
    nextColor: Fill;
    columnQuery: string;
    iconStyle: "default" | "filled" | "btn" | "btn-fill" | "circle" | "circle-fill";
    background: boolean;
    backgroundColor: Fill;
    padding: number;
  };
  captionSettings: {
    show: boolean;
    captionColor: Fill;
    fontSize: number;
    position: string;
    separator: string;
  };
  customSort: {
    show: boolean;
    ascending: boolean;
  };
  scrubberSettings: {
    show: boolean;
  };
}
