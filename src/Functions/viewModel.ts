import "core-js/stable";
import powerbi from "powerbi-visuals-api";
import { ICategoryDataPoint, IViewModel } from "../interfaces";
import { Visual } from "../visual";
import { VisualSettings } from "../Settings/settings";
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
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
  
  const settings: VisualSettings = VisualSettings.parse<VisualSettings>(dataViews[0]);
  const categoryDataPoints: ICategoryDataPoint[] = [];

  const sortIndex = categorical.values ? categorical.values.findIndex((value) => value.source.roles.sortBy) : -1;
  const categoryIndex = categorical.categories.length - 1;

  categorical.categories[categoryIndex].values.forEach((category, i) => {
    const sortValue = sortIndex === -1 ? "" : categorical.values[sortIndex].values[i];

    // Format category values if format string exists
    const categoryValue = categorical.categories.map((cat) => {
      const catValue:any = cat.source.type.dateTime ? new Date(`${cat.values[i]}`) : cat.values[i];
      const formatString = cat.source.format;

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

  if (settings.customSort.show) {
    const sortParameter = settings.customSort.ascending ? 1 : -1;
    categoryDataPoints.sort((a, b) => (a.sortValue > b.sortValue ? sortParameter : a.sortValue < b.sortValue ? sortParameter * -1 : 0));
  }

  return {
    dataPoints: categoryDataPoints,
    settings: settings,
    categoryDisplay: categorical.categories.map((el) => el.source.displayName).join(", "),
  };
}
