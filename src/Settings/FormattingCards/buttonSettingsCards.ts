import powerbi from "powerbi-visuals-api";
import { Visual } from "../../visual";
import { createDefaultArray } from "../createFormattingCards";
import { ButtonSetting } from "../settings";
import FormattingCard = powerbi.visuals.FormattingCard;
import FormattingGroup = powerbi.visuals.FormattingGroup;
import FormattingComponent = powerbi.visuals.FormattingComponent;
import ValidatorType = powerbi.visuals.ValidatorType;

export function ButtonSettingCard(self: Visual): FormattingCard {
    const settings = self.settings.buttonSetting;
    const card: FormattingCard = {
        displayName: "Button Settings",
        uid: "buttonSetting",
        groups: [
            createGeneralGroup(settings),
            createBackgroundGroup(settings),
            createIconColorGroup(settings)
        ],
        revertToDefaultDescriptors: createDefaultArray(settings, "buttonSetting"),
    };

    return card;
}

function createGeneralGroup(settings: ButtonSetting): FormattingGroup {
    const group: FormattingGroup = {
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
        group.slices.push({
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

    group.slices.push(
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

    return group;
}

function createBackgroundGroup(settings: ButtonSetting): FormattingGroup {
    const group: FormattingGroup = {
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
        group.slices.push({
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

    return group;
}

function createIconColorGroup(settings: ButtonSetting): FormattingGroup {
    const group: FormattingGroup = {
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
        group.slices.push(
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
        group.slices.push({
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

    return group;
}
