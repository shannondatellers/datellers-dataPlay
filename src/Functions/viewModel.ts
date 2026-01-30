import "core-js/stable";
import powerbi from "powerbi-visuals-api";
import { ICategoryDataPoint, ISettings, IViewModel } from "../interfaces";
import { getValue, getCategoricalObjectValue } from "../objectEnumerationUtility";
import { Visual } from "../visual";
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import Fill = powerbi.Fill;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import DataViewObjects = powerbi.DataViewObjects;
import DataViewCategoryColumn = powerbi.DataViewCategoryColumn;
import ISandboxExtendedColorPalette = powerbi.extensibility.ISandboxExtendedColorPalette;
import { valueFormatter } from "powerbi-visuals-utils-formattingutils";

export function formatData(formatString: any, value: number, unit?: number, precision?: number): string {
  const iValueFormatter = valueFormatter.create({
    value: unit,
    precision: precision,
    format: formatString,
  });

  return iValueFormatter.format(value);
}

export function visualTransform(self: Visual, options: VisualUpdateOptions, host: IVisualHost): IViewModel {
  const dataViews = options.dataViews;

  const categorical = dataViews[0].categorical;

  const visualSettings: ISettings = createSettings(self, dataViews[0].metadata.objects);
  const categoryDataPoints: ICategoryDataPoint[] = [];

  const sortIndex = categorical.values ? categorical.values.findIndex((value) => value.source.roles.sortBy) : -1;
  const categoryIndex = categorical.categories.length - 1;

  categorical.categories[categoryIndex].values.forEach((category, i) => {
    const sortValue = sortIndex === -1 ? "" : categorical.values[sortIndex].values[i];

    // Format category values if format string exists
    const categoryValue = categorical.categories.map((cat) => {
      const catValue:any = cat.source.type.dateTime ? new Date(`${cat.values[i]}`) : cat.values[i];
      const formatString = cat.source.format;

      // Check if value is a number and format string exists
      if (formatString) {
        return formatData(formatString, catValue);
      }

      return catValue;
    }).join(" ");

    categoryDataPoints.push({
      category: `${categoryValue}`,
      selectionId: host.createSelectionIdBuilder().withCategory(categorical.categories[categoryIndex], i).createSelectionId(),
      sortValue: sortValue,
    });
  });

  if (visualSettings.customSort.show) {
    const sortParameter = visualSettings.customSort.ascending ? 1 : -1;
    categoryDataPoints.sort((a, b) => (a.sortValue > b.sortValue ? sortParameter : a.sortValue < b.sortValue ? sortParameter * -1 : 0));
  }

  return {
    dataPoints: categoryDataPoints,
    settings: visualSettings,
    categoryDisplay: categorical.categories.map((el) => el.source.displayName).join(", "),
  };
}

// Function used to get KPI color
export function getColumnColorByIndex(category: DataViewCategoryColumn, index: number, colorPalette: ISandboxExtendedColorPalette): string {
  if (colorPalette.isHighContrast) {
    return colorPalette.background.value;
  }
  const defaultColor: Fill = { solid: { color: `#abcdef` } };

  return getCategoricalObjectValue<Fill>(category, index, "buttonSetting", `pickedColor`, defaultColor).solid.color;
}

function createSettings(self: Visual, objects: DataViewObjects) {
  const defaultSettings: ISettings = {
    transitionSettings: {
      autoStart: false,
      loop: false,
      timeInterval: 1000,
      bin: 1,
    },
    buttonSetting: {
      buttonSize: 40,
      minimal: false,
      dynamicSize: true,
      pickedColor: { solid: { color: self.host.colorPalette.getColor(`default`).value } },
      showAll: false,
      playColor: { solid: { color: self.host.colorPalette.getColor(`play`).value } },
      pauseColor: { solid: { color: self.host.colorPalette.getColor(`pause`).value } },
      stopColor: { solid: { color: self.host.colorPalette.getColor(`stop`).value } },
      previousColor: { solid: { color: self.host.colorPalette.getColor(`previous`).value } },
      nextColor: { solid: { color: self.host.colorPalette.getColor(`next`).value } },
      columnQuery: "",
      iconStyle: "circle", // Default icon style
      background: false,
      backgroundColor: { solid: { color: "#f0f0f0" } },
      padding: 2,
    },
    captionSettings: {
      show: true,
      position: "left",
      captionColor: { solid: { color: "#000000" } },
      fontSize: 20,
      separator: ",",
    },
    customSort: {
      show: false,
      ascending: true,
    },
    scrubberSettings: {
      show: false,
    },
  };
  // const kpiColor: string = getColumnColorByIndex(self.options.dataViews[0].categorical.categories[0], 0, self.host.colorPalette);

  return {
    transitionSettings: {
      autoStart: getValue<boolean>(objects, "transitionSettings", "autoStart", defaultSettings.transitionSettings.autoStart),
      loop: getValue<boolean>(objects, "transitionSettings", "loop", defaultSettings.transitionSettings.loop),
      timeInterval: getValue<number>(objects, "transitionSettings", "timeInterval", defaultSettings.transitionSettings.timeInterval),
      bin: getValue<number>(objects, "transitionSettings", "bin", defaultSettings.transitionSettings.bin),
    },
    buttonSetting: {
      buttonSize: getValue<number>(objects, "buttonSetting", "buttonSize", defaultSettings.buttonSetting.buttonSize),
      minimal: getValue<boolean>(objects, "buttonSetting", "minimal", defaultSettings.buttonSetting.minimal),
      dynamicSize: getValue<boolean>(objects, "buttonSetting", "dynamicSize", defaultSettings.buttonSetting.dynamicSize),
      pickedColor: getValue<Fill>(objects, "buttonSetting", "pickedColor", defaultSettings.buttonSetting.pickedColor),
      showAll: getValue<boolean>(objects, "buttonSetting", "showAll", defaultSettings.buttonSetting.showAll),
      playColor: getValue<Fill>(objects, "buttonSetting", "playColor", defaultSettings.buttonSetting.playColor),
      pauseColor: getValue<Fill>(objects, "buttonSetting", "pauseColor", defaultSettings.buttonSetting.pauseColor),
      stopColor: getValue<Fill>(objects, "buttonSetting", "stopColor", defaultSettings.buttonSetting.stopColor),
      previousColor: getValue<Fill>(objects, "buttonSetting", "previousColor", defaultSettings.buttonSetting.previousColor),
      nextColor: getValue<Fill>(objects, "buttonSetting", "nextColor", defaultSettings.buttonSetting.nextColor),
      columnQuery: self.options.dataViews[0].metadata.columns.find((col) => col.roles.category).queryName,
      iconStyle: getValue<string>(objects, "buttonSetting", "iconStyle", defaultSettings.buttonSetting.iconStyle) as
        | "default"
        | "filled"
        | "btn"
        | "btn-fill"
        | "circle"
        | "circle-fill",
      background: getValue<boolean>(objects, "buttonSetting", "background", defaultSettings.buttonSetting.background),
      backgroundColor: getValue<Fill>(objects, "buttonSetting", "backgroundColor", defaultSettings.buttonSetting.backgroundColor),
      padding: getValue<number>(objects, "buttonSetting", "padding", defaultSettings.buttonSetting.padding),
    },

    captionSettings: {
      show: getValue<boolean>(objects, "captionSettings", "show", defaultSettings.captionSettings.show),
      position: getValue<string>(objects, "captionSettings", "position", defaultSettings.captionSettings.position),
      captionColor: getValue<Fill>(objects, "captionSettings", "captionColor", defaultSettings.captionSettings.captionColor),
      fontSize: getValue<number>(objects, "captionSettings", "fontSize", defaultSettings.captionSettings.fontSize),
      separator: getValue<string>(objects, "captionSettings", "separator", defaultSettings.captionSettings.separator),
    },
    customSort: {
      show: getValue<boolean>(objects, "customSort", "show", defaultSettings.customSort.show),
      ascending: getValue<boolean>(objects, "customSort", "ascending", defaultSettings.customSort.ascending),
    },
    scrubberSettings: {
      show: getValue<boolean>(objects, "scrubberSettings", "show", defaultSettings.scrubberSettings.show),
    },
  };
}
