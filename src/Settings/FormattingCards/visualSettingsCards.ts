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

export function ButtonSettingCard(self: Visual): FormattingCard {
    const settings = self.settings.buttonSetting;
    const card: FormattingCard = {
        displayName: "Button Settings",
        uid: "buttonSetting",
        groups: [],
        revertToDefaultDescriptors: createDefaultArray(settings, "buttonSetting"),
    };

    const generalGroup: FormattingGroup = {
        displayName: undefined,
        uid: "buttonSettingGeneralGroup",
        collapsible: false,
        slices: [
            {
                uid: "buttonSetting_minimal",
                displayName: "Minimal",
                control: {
                    type: FormattingComponent.ToggleSwitch,
                    properties: {
                        descriptor: { objectName: "buttonSetting", propertyName: "minimal" },
                        value: settings.minimal,
                    },
                },
            },
            {
                uid: "buttonSetting_dynamicSize",
                displayName: "Dynamic Sizing",
                control: {
                    type: FormattingComponent.ToggleSwitch,
                    properties: {
                        descriptor: { objectName: "buttonSetting", propertyName: "dynamicSize" },
                        value: settings.dynamicSize,
                    },
                },
            },
        ],
    };

    if (!settings.dynamicSize) {
        generalGroup.slices.push({
            uid: "buttonSetting_buttonSize",
            displayName: "Button Size",
            control: {
                type: FormattingComponent.NumUpDown,
                properties: {
                    descriptor: { objectName: "buttonSetting", propertyName: "buttonSize" },
                    value: settings.buttonSize,
                    options: {
                        minValue: { value: 1, type: ValidatorType.Min },
                        maxValue: { value: 10000, type: ValidatorType.Max },
                    },
                },
            },
        });
    }

    generalGroup.slices.push(
        {
            uid: "buttonSetting_iconStyle",
            displayName: "Icon Style",
            control: {
                type: FormattingComponent.Dropdown,
                properties: {
                    descriptor: { objectName: "buttonSetting", propertyName: "iconStyle" },
                    value: settings.iconStyle,
                },
            },
        },
        {
            uid: "buttonSetting_padding",
            displayName: "Padding",
            control: {
                type: FormattingComponent.NumUpDown,
                properties: {
                    descriptor: { objectName: "buttonSetting", propertyName: "padding" },
                    value: settings.padding,
                    options: {
                        minValue: { value: 0, type: ValidatorType.Min },
                        maxValue: { value: 100, type: ValidatorType.Max },
                    },
                },
            },
        },
        {
            uid: "buttonSetting_margin",
            displayName: "Margin",
            control: {
                type: FormattingComponent.NumUpDown,
                properties: {
                    descriptor: { objectName: "buttonSetting", propertyName: "margin" },
                    value: settings.margin,
                    options: {
                        minValue: { value: 0, type: ValidatorType.Min },
                        maxValue: { value: 100, type: ValidatorType.Max },
                    },
                },
            },
        }
    );

    const backgroundGroup: FormattingGroup = {
        displayName: "Background",
        uid: "buttonSettingBackgroundGroup",
        slices: [],
        topLevelToggle: {
            uid: "buttonSetting_background",
            suppressDisplayName: true,
            control: {
                type: FormattingComponent.ToggleSwitch,
                properties: {
                    descriptor: { objectName: "buttonSetting", propertyName: "background" },
                    value: settings.background,
                },
            },
        },
    };

    if (settings.background) {
        backgroundGroup.slices.push({
            uid: "buttonSetting_backgroundColor",
            displayName: "Background Color",
            control: {
                type: FormattingComponent.ColorPicker,
                properties: {
                    descriptor: { objectName: "buttonSetting", propertyName: "backgroundColor" },
                    value: { value: settings.backgroundColor },
                },
            },
        });
    }

    const colorGroup: FormattingGroup = {
        displayName: "Icon Color",
        uid: "buttonSettingColorGroup",
        slices: [
            {
                uid: "buttonSetting_showAll",
                displayName: "Individual Colors",
                control: {
                    type: FormattingComponent.ToggleSwitch,
                    properties: {
                        descriptor: { objectName: "buttonSetting", propertyName: "showAll" },
                        value: settings.showAll,
                    },
                },
            },
        ],
    };

    if (settings.showAll) {
        colorGroup.slices.push(
            {
                uid: "buttonSetting_playColor",
                displayName: "Play Color",
                control: {
                    type: FormattingComponent.ColorPicker,
                    properties: {
                        descriptor: { objectName: "buttonSetting", propertyName: "playColor" },
                        value: { value: settings.playColor },
                    },
                },
            },
            {
                uid: "buttonSetting_pauseColor",
                displayName: "Pause Color",
                control: {
                    type: FormattingComponent.ColorPicker,
                    properties: {
                        descriptor: { objectName: "buttonSetting", propertyName: "pauseColor" },
                        value: { value: settings.pauseColor },
                    },
                },
            },
            {
                uid: "buttonSetting_stopColor",
                displayName: "Stop Color",
                control: {
                    type: FormattingComponent.ColorPicker,
                    properties: {
                        descriptor: { objectName: "buttonSetting", propertyName: "stopColor" },
                        value: { value: settings.stopColor },
                    },
                },
            },
            {
                uid: "buttonSetting_previousColor",
                displayName: "Previous Color",
                control: {
                    type: FormattingComponent.ColorPicker,
                    properties: {
                        descriptor: { objectName: "buttonSetting", propertyName: "previousColor" },
                        value: { value: settings.previousColor },
                    },
                },
            },
            {
                uid: "buttonSetting_nextColor",
                displayName: "Next Color",
                control: {
                    type: FormattingComponent.ColorPicker,
                    properties: {
                        descriptor: { objectName: "buttonSetting", propertyName: "nextColor" },
                        value: { value: settings.nextColor },
                    },
                },
            }
        );
    } else {
        colorGroup.slices.push({
            uid: "buttonSetting_pickedColor",
            displayName: "Button Color",
            control: {
                type: FormattingComponent.ColorPicker,
                properties: {
                    descriptor: { objectName: "buttonSetting", propertyName: "pickedColor" },
                    value: { value: settings.pickedColor },
                },
            },
        });
    }

    card.groups.push(generalGroup, backgroundGroup, colorGroup);
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
