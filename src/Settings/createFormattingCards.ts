import powerbi from "powerbi-visuals-api";
import { Visual } from "../visual";
import { 
    TransitionSettingsCard, 
    CaptionSettingsCard, 
    CustomSortCard, 
    ScrubberSettingsCard 
} from "./FormattingCards/visualSettingsCards";
import { ButtonSettingCard } from "./FormattingCards/buttonSettingsCards";

import FormattingCard = powerbi.visuals.FormattingCard;

export interface IDefaultSetting {
  objectName: string;
  propertyName: string;
}

export function createDefaultArray(settings: object, objectLabel: string): IDefaultSetting[] {
  return Object.keys(settings).map((prop) => {
    return {
      objectName: objectLabel,
      propertyName: prop,
    };
  });
}

export function createFormattingCards(self: Visual): FormattingCard[] {
  const cards = [
    TransitionSettingsCard(self),
    ButtonSettingCard(self),
    CaptionSettingsCard(self),
    ScrubberSettingsCard(self),
  ];

  const sortByFieldExists = self.options.dataViews[0]?.metadata?.columns?.find((col) => col.roles.sortBy);
  if (sortByFieldExists) {
    cards.push(CustomSortCard(self));
  }

  return cards;
}
