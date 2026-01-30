"use strict";

import "core-js/stable";
import { select, selectAll } from "d3-selection";
import powerbi from "powerbi-visuals-api";
import "./../style/visual.less";
import { minimalStyle, renderButtons, setButtonClick } from "./DesignElements/renderButtons";
import { renderCaptions } from "./DesignElements/renderCaptions";
import { renderScrubber, applyScrubberColors } from "./DesignElements/renderScrubber";
import { playAnimation, stopAnimation } from "./Functions/animationFunctions";
import { visualTransform } from "./Functions/viewModel";
import { LandingPageConstants as lc } from "./DesignElements/designConstants";
import { renderLandingPage } from "./DesignElements/renderLandingPage";
import { buttonNames, IViewModel, Status } from './interfaces';
import IVisualEventService = powerbi.extensibility.IVisualEventService;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import ISelectionManager = powerbi.extensibility.ISelectionManager;
import { createFormattingCards } from "./Settings/createFormattingCards";
import { isNil } from "lodash";
import { VisualSettings } from "./Settings/settings";

export class Visual implements IVisual {
  public static host: IVisualHost;
  public options: VisualUpdateOptions;
  public selectionManager: ISelectionManager;
  public element: HTMLElement;
  public rootSelection: any;
  private events: IVisualEventService;

  public settings: VisualSettings;
  public status: Status;
  public lastSelected: number;
  public viewModel: IViewModel;
  public timers: any;
  public buttonSize: number = 0;

  private readonly uiScale: number = 1;

  private fitCaptionFontToWidth(captionElement: HTMLElement, startingFontSizePt: number) {
    // Try to reduce font-size until the text fits in the available width.
    // If it still doesn't fit at the minimum, we fall back to ellipsis.
    const minFontSizePt = 6;
    const maxIterations = 6;

    let fontSize = Math.max(minFontSizePt, Math.floor(startingFontSizePt));
    captionElement.style.fontSize = `${fontSize}pt`;

    for (let i = 0; i < maxIterations; i++) {
      const available = captionElement.clientWidth;
      const needed = captionElement.scrollWidth;

      if (available <= 0 || needed <= available) {
        return;
      }

      const ratio = available / needed;
      const nextSize = Math.max(minFontSizePt, Math.floor(fontSize * ratio));

      // Ensure progress even when ratio rounds to same font size
      fontSize = nextSize >= fontSize ? Math.max(minFontSizePt, fontSize - 1) : nextSize;
      captionElement.style.fontSize = `${fontSize}pt`;
    }
  }

  private recomputeButtonSizeForCaption(
    visibleButtonCount: number,
    configuredButtonSize: number,
    dynamicButtonSize: boolean,
    captionDesiredWidth: number,
    viewportWidth: number,
    viewportHeight: number,
    basePadding: number,
    baseGap: number,
    toolbarGap: number
  ) {
    const minButtonPx = 8;
    const maxButtonPx = 300;
    // Add 20% extra width buffer to caption to prevent edge crossing
    const captionWidthBuffer = Math.ceil(captionDesiredWidth * 1.2);
    const reservedCaptionWidth = Math.max(captionWidthBuffer, this.settings.captionSettings.show ? 40 : 0);

    const configuredMargin = this.settings.buttonSetting.margin ?? 0;
    const totalButtonMargins = 2 * configuredMargin * visibleButtonCount;

    // Calculate maximum button size based on available width
    const availableWidth = viewportWidth - reservedCaptionWidth - toolbarGap - basePadding * 2 - baseGap * (visibleButtonCount - 1) - totalButtonMargins;
    const maxButtonByWidth = Math.max(minButtonPx, Math.floor(availableWidth / Math.max(1, visibleButtonCount)));
    const maxButtonByHeight = Math.max(minButtonPx, Math.floor(viewportHeight - basePadding * 2) - 2 * configuredMargin);

    const sizeByAvailableSpace = Math.min(maxButtonByWidth, maxButtonByHeight);
    const nextSize = dynamicButtonSize ? sizeByAvailableSpace : Math.min(configuredButtonSize, sizeByAvailableSpace);
    const scaled = Math.floor(nextSize * this.uiScale);
    return Math.max(minButtonPx, Math.min(scaled, maxButtonPx));
  }

  private applyButtonStyles(containerPadding: number) {
    const effectivePadding = Math.max(0, Math.floor(containerPadding));
    const effectiveGap = 0;
    // Make toolbar gap responsive to button size - grows with buttons for better spacing
    const responsiveToolbarGap = 0;

    selectAll('.tp-toolbar').style('gap', `${responsiveToolbarGap}px`);
    selectAll('.button-container').style('padding', `${effectivePadding}px`).style('gap', `${effectiveGap}px`);

    // Button padding controls spacing between the icon and the button border - make it responsive
    const configuredInnerPadding = this.settings.buttonSetting.padding ?? 0;
    const configuredMargin = this.settings.buttonSetting.margin ?? 0;
    const maxInnerPadding = Math.max(0, Math.floor((this.buttonSize - 4) / 2.0));
    const innerPadding = Math.min(maxInnerPadding, Math.max(0, Math.floor(configuredInnerPadding)));

    const innerSize = Math.max(0, this.buttonSize - innerPadding * 2);
    // Icon size should be proportional to available inner space
    // When padding is 0, use full button size. Otherwise, use innerSize directly to fill available space
    const iconFontSize = innerPadding === 0
      ? Math.floor(this.buttonSize * 1.0) // Use full button size when no padding
      : Math.max(6, Math.floor(innerSize)); // Use innerSize directly - padding already creates the space
    selectAll('.control-button')
      .style('width', `${this.buttonSize}px`)
      .style('height', `${this.buttonSize}px`)
      .style('padding', `${innerPadding}px`)
      .style('margin', `${configuredMargin}px`)
      .style('font-size', `${iconFontSize}px`)
      .style('display', 'flex')
      .style('align-items', 'center')
      .style('justify-content', 'center')
      .style('line-height', '1');
  }

  private applyButtonColors() {
    if (this.settings.buttonSetting.showAll) {
      select('#play').style('color', this.settings.buttonSetting.playColor);
      select('#pause').style('color', this.settings.buttonSetting.pauseColor);
      select('#stop').style('color', this.settings.buttonSetting.stopColor);
      select('#previous').style('color', this.settings.buttonSetting.previousColor);
      select('#next').style('color', this.settings.buttonSetting.nextColor);
    } else {
      selectAll('.control-button').style('color', this.settings.buttonSetting.pickedColor);
    }
    // Also update scrubber colors when button colors change
    applyScrubberColors(this);
  }

  private applyCaptionAndAdjustButtons(
    visibleButtonCount: number,
    captionMinWidth: number,
    basePadding: number,
    baseGap: number,
    toolbarGap: number,
    scrubberHeight: number
  ) {
    renderCaptions(this);

    const captionColor = this.settings.captionSettings.captionColor;
    const configuredCaptionFontSize = this.settings.captionSettings.fontSize;
    // Caption font size is treated as pt - make it responsive to viewport height
    const viewportHeightPt = (this.options.viewport.height * 72) / 96;
    const maxByHeightPt = Math.floor(viewportHeightPt * 0.9); // Use 90% of available height

    // Caption size should scale directly with button size for simultaneous growth
    const buttonSizePt = (this.buttonSize * 72) / 96;
    const maxByButtonSize = Math.floor(buttonSizePt * 0.85); // Caption scales with button (85% ratio)

    // Use the minimum of configured size and calculated constraints
    const effectiveCaptionFontSize = Math.max(
      6,
      Math.floor(Math.min(configuredCaptionFontSize, Math.min(maxByHeightPt, maxByButtonSize)) * this.uiScale)
    );

    select('.caption')
      .style('color', captionColor)
      .style('font-size', `${effectiveCaptionFontSize}pt`)
      .style('padding-left', '0px')
      .style('padding-right', '4px');

    // Adjust layout based on Dynamic Sizing setting
    const isDynamicSize = this.settings.buttonSetting.dynamicSize;

    // Adjust layout: caption always takes remaining space to allow full alignment
    selectAll('.button-container').style('flex', '0 0 auto');
    select('.caption').style('flex', '1 1 auto');
    // Remove any fixed width so flexbox can take over
    select('.caption').style('width', null);

    // Measure caption text width for button size calculation (only when dynamic sizing is on)
    const captionElement = this.element.querySelector<HTMLElement>('.caption');
    let captionWidth = 0;
    if (isDynamicSize && this.settings.captionSettings.show && captionElement) {
      // Force layout recalculation to get accurate measurement
      void captionElement.offsetWidth;
      const textWidth = captionElement.scrollWidth;
      captionWidth = textWidth + 10; 
    }

    // Adjust viewport height to account for scrubber
    const availableHeight = this.options.viewport.height - scrubberHeight;

    let targetButtonSize: number;
    const configuredMargin = this.settings.buttonSetting.margin ?? 0;

    if (isDynamicSize) {
      // Dynamic Sizing ON: Calculate button size considering both width and height constraints
      // Reserve space for caption, gaps, padding, and button margins
      const buttonGaps = baseGap * (visibleButtonCount - 1);
      const totalButtonMargins = 2 * configuredMargin * visibleButtonCount;
      const reservedWidth = captionWidth + toolbarGap + buttonGaps + totalButtonMargins;
      const availableWidth = Math.max(0, this.options.viewport.width - reservedWidth);

      // Calculate max button size by width (divide available width by button count)
      const maxButtonByWidth = Math.max(8, Math.floor(availableWidth / Math.max(1, visibleButtonCount)));
      // Subtract margin from available height as well
      const maxButtonByHeight = Math.max(8, Math.floor(availableHeight - basePadding * 2 - 2) - 2 * configuredMargin);

      // Button size is constrained by both width and height - use the smaller value to keep buttons square
      const maxButtonSize = Math.min(maxButtonByWidth, maxButtonByHeight);
      targetButtonSize = maxButtonSize;
    } else {
      // Dynamic Sizing OFF: Use configured button size, constrained by height only
      // Subtract margin from available height
      const maxButtonByHeight = Math.max(8, Math.floor(availableHeight - basePadding * 2 - 2) - 2 * configuredMargin);
      targetButtonSize = Math.min(this.settings.buttonSetting.buttonSize, maxButtonByHeight);
    }

    const nextButtonSize = Math.max(8, Math.min(Math.floor(targetButtonSize * this.uiScale), 300));

    if (nextButtonSize !== this.buttonSize) {
      this.buttonSize = nextButtonSize;
      this.applyButtonStyles(basePadding);
    }

    if (captionElement && this.buttonSize <= 8) {
      this.fitCaptionFontToWidth(captionElement, effectiveCaptionFontSize);
    }
  }

  constructor(options: VisualConstructorOptions) {
    Visual.host = options.host;
    this.events = options.host.eventService;
    this.selectionManager = options.host.createSelectionManager();
    this.status = Status.Stop;
    this.timers = [];
    this.lastSelected = 0;

    this.element = options.element;

    select(options.element).classed("body", true);
    this.rootSelection = select(this.element);
    this.handleContextMenu();  }
  private handleContextMenu() {
    this.rootSelection.on("contextmenu", (event: PointerEvent) => {
      event.preventDefault();

      this.selectionManager.showContextMenu(
        {},
        {
          x: event.clientX,
          y: event.clientY,
        }
      );
    });
  }

  public update(options: VisualUpdateOptions) {
    this.events.renderingStarted(options);
    // Always clear the root element so only one UI is shown
    
    try {
      // Set background to white
      this.rootSelection.selectAll("*").remove();

      // Show landing page if data is missing/null
      if (
        !options ||
        !options.dataViews ||
        !options.dataViews[0] ||
        !options.dataViews[0].categorical ||
        !options.dataViews[0].categorical.categories
      ) {
        renderLandingPage(
          this.rootSelection,
          Visual.host,
          lc.visualName,

          'https://datellers.com/contact-us/',
          `${lc.visualDescription}`,
          true,
          options.viewport
        );
        this.events.renderingFinished(options);
        return;
      }

      stopAnimation(this);
      this.options = options;
      this.settings = VisualSettings.parse<VisualSettings>(options.dataViews[0]);
      this.viewModel = visualTransform(this, options, Visual.host);

      // Compute button size early so layout can be responsive on very small tiles
      const visibleButtonCount = this.settings.buttonSetting.minimal ? 1 : buttonNames.length;
      const captionMinWidth = this.settings.captionSettings.show ? 40 : 0;
      const baseGap = 6;
      const basePadding = 0;
      const toolbarGap = this.settings.captionSettings.show ? 6 : 0;

      const configuredMargin = this.settings.buttonSetting.margin ?? 0;
      const totalButtonMargins = 2 * configuredMargin * visibleButtonCount;

      const maxButtonByWidth = Math.max(
        8,
        Math.floor(
          (this.options.viewport.width - captionMinWidth - toolbarGap - basePadding * 2 - baseGap * (visibleButtonCount - 1) - totalButtonMargins) /
          Math.max(1, visibleButtonCount)
        )
      );
      // Reserve space for scrubber if it's shown (20px scrubber height + 2px padding = 22px total)
      const scrubberHeight = this.settings.scrubberSettings.show ? 22 : 0;
      // Add small buffer to prevent cutoff (2px)
      const maxButtonByHeight = Math.max(8, Math.floor(this.options.viewport.height - basePadding * 2 - scrubberHeight - 2) - 2 * configuredMargin);

      const computedButtonSize = this.settings.buttonSetting.dynamicSize
        ? Math.min(maxButtonByWidth, maxButtonByHeight)
        : this.settings.buttonSetting.buttonSize;

      // Allow buttons to scale up/down to fill the tile
      this.buttonSize = Math.max(8, Math.min(Math.floor(computedButtonSize * this.uiScale), 150));

      renderButtons(this);

      setButtonClick(this);
      this.handleContextMenu();

      this.applyButtonStyles(basePadding);

      this.applyCaptionAndAdjustButtons(visibleButtonCount, captionMinWidth, basePadding, baseGap, toolbarGap, scrubberHeight);

      // Apply minimal style AFTER button styles to ensure it takes precedence
      minimalStyle(this);

      //Start playing without click
      if (this.settings.transitionSettings.autoStart) {
        playAnimation(this);
      }

      this.applyButtonColors();

      // Render scrubber below the toolbar
      renderScrubber(this);

      // Apply button colors to scrubber
      applyScrubberColors(this);

      this.events.renderingFinished(options);
    } catch (err) {
      // 👇 required if something breaks
      console.log("Error:",err)
      this.events.renderingFailed(options, err instanceof Error ? err.message : "Unknown error");
    }
  }



  public getFormattingModel(): powerbi.visuals.FormattingModel {

    const formattingModel: powerbi.visuals.FormattingModel = { cards: [] };
    const cards = createFormattingCards(this);
    cards.forEach((card) => {
      if (!isNil(card)) {
        formattingModel.cards.push(card);
      }
    });
    return formattingModel;
  }
}
