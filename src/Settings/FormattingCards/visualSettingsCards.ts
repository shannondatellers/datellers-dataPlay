import powerbi from "powerbi-visuals-api";
import { Visual } from "../../visual";
import { createDefaultArray } from "../createFormattingCards";
import FormattingCard = powerbi.visuals.FormattingCard;
import FormattingGroup = powerbi.visuals.FormattingGroup;
import FormattingComponent = powerbi.visuals.FormattingComponent;
import ValidatorType = powerbi.visuals.ValidatorType;

export function TransitionSettingsCard(self: Visual): FormattingCard {
    const settings = self.settings.transitionSettings;
    const card: FormattingCard = {
        displayName: "Transition Settings",
        uid: "transitionSettings",
        groups: [],
        revertToDefaultDescriptors: createDefaultArray(settings, "transitionSettings"),
    };

    const group: FormattingGroup = {
        displayName: undefined,
        uid: "transitionSettingsGroup",
        collapsible: false,
        slices: [
            {
                uid: "transitionSettings_autoStart",
                displayName: "Auto Start",
                control: {
                    type: FormattingComponent.ToggleSwitch,
                    properties: {
                        descriptor: { objectName: "transitionSettings", propertyName: "autoStart" },
                        value: settings.autoStart,
                    },
                },
            },
            {
                uid: "transitionSettings_loop",
                displayName: "Loop",
                control: {
                    type: FormattingComponent.ToggleSwitch,
                    properties: {
                        descriptor: { objectName: "transitionSettings", propertyName: "loop" },
                        value: settings.loop,
                    },
                },
            },
            {
                uid: "transitionSettings_timeInterval",
                displayName: "Time Interval (ms)",
                control: {
                    type: FormattingComponent.NumUpDown,
                    properties: {
                        descriptor: { objectName: "transitionSettings", propertyName: "timeInterval" },
                        value: settings.timeInterval,
                        options: {
                            minValue: { value: 1, type: ValidatorType.Min },
                            maxValue: { value: 10000000, type: ValidatorType.Max },
                        },
                    },
                },
            }
        ],
    };

    card.groups.push(group);
    return card;
}

export function CaptionSettingsCard(self: Visual): FormattingCard {
    const settings = self.settings.captionSettings;
    const card: FormattingCard = {
        displayName: "Caption",
        uid: "captionSettings",
        groups: [],
        revertToDefaultDescriptors: createDefaultArray(settings, "captionSettings"),
        topLevelToggle: {
            uid: "captionSettings_show",
            suppressDisplayName: true,
            control: {
                type: FormattingComponent.ToggleSwitch,
                properties: {
                    descriptor: { objectName: "captionSettings", propertyName: "show" },
                    value: settings.show,
                },
            },
        },
    };

    const group: FormattingGroup = {
        displayName: undefined,
        uid: "captionSettingsGroup",
        collapsible: false,
        slices: [
            {
                uid: "captionSettings_captionColor",
                displayName: "Color",
                control: {
                    type: FormattingComponent.ColorPicker,
                    properties: {
                        descriptor: { objectName: "captionSettings", propertyName: "captionColor" },
                        value: { value: settings.captionColor },
                    },
                },
            },
            {
                uid: "captionSettings_fontSize",
                displayName: "Font Size",
                control: {
                    type: FormattingComponent.NumUpDown,
                    properties: {
                        descriptor: { objectName: "captionSettings", propertyName: "fontSize" },
                        value: settings.fontSize,
                        options: {
                            minValue: { value: 8, type: ValidatorType.Min },
                            maxValue: { value: 60, type: ValidatorType.Max },
                        },
                    },
                },
            },
            {
                uid: "captionSettings_position",
                displayName: "Position",
                control: {
                    type: FormattingComponent.Dropdown,
                    properties: {
                        descriptor: { objectName: "captionSettings", propertyName: "position" },
                        value: settings.position,
                    },
                },
            },
        ],
    };

    card.groups.push(group);
    return card;
}

export function CustomSortCard(self: Visual): FormattingCard {
    const settings = self.settings.customSort;
    const card: FormattingCard = {
        displayName: "Custom Sort",
        uid: "customSort",
        groups: [],
        revertToDefaultDescriptors: createDefaultArray(settings, "customSort"),
    };

    const group: FormattingGroup = {
        displayName: undefined,
        uid: "customSortGroup",
        collapsible: false,
        slices: [
            {
                uid: "customSort_ascending",
                displayName: "Ascending",
                control: {
                    type: FormattingComponent.ToggleSwitch,
                    properties: {
                        descriptor: { objectName: "customSort", propertyName: "ascending" },
                        value: settings.ascending,
                    },
                },
            },
        ],
        topLevelToggle: {
            uid: "customSort_show",
            suppressDisplayName: true,
            control: {
                type: FormattingComponent.ToggleSwitch,
                properties: {
                    descriptor: { objectName: "customSort", propertyName: "show" },
                    value: settings.show,
                },
            },
        },
    };

    card.groups.push(group);
    return card;
}

export function ScrubberSettingsCard(self: Visual): FormattingCard {
    const settings = self.settings.scrubberSettings;
    const card: FormattingCard = {
        displayName: "Scrubber",
        uid: "scrubberSettings",
        groups: [],
        revertToDefaultDescriptors: createDefaultArray(settings, "scrubberSettings"),
        topLevelToggle: {
            uid: "scrubberSettings_show",
            suppressDisplayName: true,
            control: {
                type: FormattingComponent.ToggleSwitch,
                properties: {
                    descriptor: { objectName: "scrubberSettings", propertyName: "show" },
                    value: settings.show,
                },
            },
        },
    };

    return card;
}
