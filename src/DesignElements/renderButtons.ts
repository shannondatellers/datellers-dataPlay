import { select } from "d3";
import { pauseAnimation, playAnimation, step, stopAnimation } from "../Functions/animationFunctions";
import { buttonNames, buttonIconsDefault, buttonIconsFill, buttonIconsBtn, buttonIconsBtnFill, buttonIconsCircle, buttonIconsCircleFill } from "../interfaces";
import { Visual } from "../visual";

export function minimalStyle(self: Visual) {
  const isMinimal = self.visualSettings.buttonSetting.minimal;
  for (let i = 0; i < buttonNames.length; ++i) {
    const buttonId = buttonNames[i];
    const display = isMinimal ? (buttonId === 'play' ? 'flex' : 'none') : 'flex';
    select(`#${buttonId}`).style('display', display);
  }
}

export function renderButtons(self: Visual) {
  const toolbar = getOrCreateToolbar(self);

  // Clear any existing buttons
  toolbar.selectAll('.button-container').remove();

  const isMinimal = self.visualSettings.buttonSetting.minimal;

  // Create new div container
  const container = toolbar
    .append("div")
    .attr("class", `button-container${isMinimal ? " minimal" : ""}`)
    .style("display", "flex")
    .style("gap", "5px")
    .style("align-items", "center");

  let selectedIcons: string[] = [];
  switch (self.visualSettings.buttonSetting.iconStyle) {
    case "default":
      selectedIcons = buttonIconsDefault;
      break;
    case "filled":
      selectedIcons = buttonIconsFill;
      break;
    case "btn":
      selectedIcons = buttonIconsBtn;
      break;
    case "btn-fill":
      selectedIcons = buttonIconsBtnFill;
      break;
    case "circle":
      selectedIcons = buttonIconsCircle;
      break;
    case "circle-fill":
      selectedIcons = buttonIconsCircleFill;
      break;
    default:
      selectedIcons = buttonIconsDefault; // Default to default/outlined if no match
      console.warn(`Unknown iconStyle: ${self.visualSettings.buttonSetting.iconStyle}, defaulting to "default"`);
      break;
  }

  for (let i = 0; i < buttonNames.length; ++i) {
    const button = container
      .append("button")
      .attr("id", buttonNames[i])
      .attr("class", "control-button")
      // .style("background", self.visualSettings.buttonSetting.background ? "#f0f0f0" : "none");
      .style("background", self.visualSettings.buttonSetting.background ? self.visualSettings.buttonSetting.backgroundColor.solid.color : "none");

    button.append("i").attr("class", `bi ${selectedIcons[i]}`);
    // .html(`<i class="bi ${selectedIcons[i]}"></i>`);
  }

  // }
}

export function setButtonClick(self: Visual) {
  const bin = self.visualSettings.transitionSettings.bin;

  // Use div button event binding
  select("#play").on("click", () => {
    playAnimation(self);
  });

  select("#pause").on("click", () => {
    pauseAnimation(self);
  });

  select("#stop").on("click", () => {
    stopAnimation(self);
  });

  select("#previous").on("click", () => {
    step(self, -bin);
  });

  select("#next").on("click", () => {
    step(self, bin);
  });
}

function getOrCreateToolbar(self: Visual) {
  const root = select(self.element);
  const existing = root.select<HTMLDivElement>('.tp-toolbar');
  if (!existing.empty()) {
    return existing;
  }

  return root.append('div').attr('class', 'tp-toolbar');
}

// function getIcon(self: Visual, index: number): string {
//   switch (self.visualSettings.buttonSetting.iconStyle) {
//     case "filled":
//       return buttonIconsFill[index];
//     case "outlined":
//       return buttonIconsOutline[index];
//     case "rounded":
//       return buttonIconsRounded[index];
//     default:
//       return buttonIconsFill[index];
//   }
// }

// export function setButtonClick(self: Visual) {
//   const bin = self.visualSettings.transitionSettings.bin;
//   //Events on click
//   self.svg.select("#play").on("click", () => {
//     playAnimation(self);
//   });
//   self.svg.select("#stop").on("click", () => {
//     stopAnimation(self);
//   });
//   self.svg.select("#pause").on("click", () => {
//     pauseAnimation(self);
//   });
//   self.svg.select("#previous").on("click", () => {
//     step(self, -bin);
//   });
//   self.svg.select("#next").on("click", () => {
//     step(self, bin);
//   });
// }
