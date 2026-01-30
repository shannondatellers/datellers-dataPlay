import { select } from "d3";
import { Visual } from "../visual";
import { pauseAnimation } from "../Functions/animationFunctions";
import { updateCaption } from "./renderCaptions";
import { Status } from "../interfaces";

export function renderScrubber(self: Visual) {
  const root = select(self.element);
  
  // Remove existing scrubber if any
  root.selectAll('.tp-scrubber-container').remove();
  
  // Check if scrubber should be shown
  if (!self.settings.scrubberSettings.show) {
    return;
  }
  
  if (!self.viewModel || !self.viewModel.dataPoints || self.viewModel.dataPoints.length === 0) {
    return;
  }
  
  // Create scrubber container - ensure it's at the bottom
  const scrubberContainer = root
    .append('div')
    .attr('class', 'tp-scrubber-container')
    .style('width', '100%')
    .style('padding', '2px 0 0 0')
    .style('box-sizing', 'border-box')
    .style('flex', '0 0 auto')
    .style('margin-top', 'auto');
  
  const total = self.viewModel.dataPoints.length;
  const bin = self.settings.transitionSettings.bin;
  const maxPosition = Math.max(0, total - bin);
  
  // Create the range input
  const scrubber = scrubberContainer
    .append('input')
    .attr('type', 'range')
    .attr('class', 'tp-scrubber')
    .attr('min', '0')
    .attr('max', maxPosition.toString())
    .attr('value', self.lastSelected.toString())
    .attr('step', bin.toString())
    .style('width', '100%')
    .style('cursor', 'pointer');
  
  // Set up event handlers
  scrubber.on('mousedown', function() {
    // Pause if playing when user starts dragging
    if (self.status === Status.Play) {
      pauseAnimation(self);
    }
    // Update caption immediately when starting to drag to show current position
    updateCaption(self, false);
  });
  
  scrubber.on('input', function() {
    const newValue = parseInt((this as HTMLInputElement).value, 10);
    
    // Align to bin boundaries - ensure we're at a valid starting position
    const alignedValue = Math.floor(newValue / bin) * bin;
    const clampedValue = Math.max(0, Math.min(alignedValue, maxPosition));
    
    // Only update if the value actually changed
    if (clampedValue !== self.lastSelected) {
      // Update position
      self.lastSelected = clampedValue;
      
      // Update selection based on current position
      const selectionArray = [];
      for (let j = 0; j < bin; j++) {
        const dp = self.viewModel.dataPoints[self.lastSelected + j];
        if (dp) selectionArray.push(dp.selectionId);
      }
      if(Visual.host.hostCapabilities.allowInteractions)
    {  self.selectionManager.select(selectionArray);}
      
      // Update caption - always show actual categories when scrubbing, not the default display
      updateCaption(self, false);
      
      // Update button states
      const isAtStart = self.lastSelected === 0;
      const isAtEnd = self.lastSelected + bin >= total;
      
      select('#previous').style('opacity', isAtStart ? '0.3' : '1');
      select('#next').style('opacity', isAtEnd ? '0.3' : '1');
      
      // Set status to pause if it was playing
      if (self.status === Status.Play) {
        self.status = Status.Pause;
      }
    }
    
    // Always sync the scrubber value to the actual position (in case of alignment)
    scrubber.property('value', self.lastSelected);
  });
}

export function updateScrubber(self: Visual) {
  const scrubber = select<HTMLInputElement, unknown>('.tp-scrubber');
  if (!scrubber.empty() && self.viewModel && self.viewModel.dataPoints) {
    const total = self.viewModel.dataPoints.length;
    const bin = self.settings.transitionSettings.bin;
    const maxPosition = Math.max(0, total - bin);
    
    // Ensure lastSelected is within valid range and aligned to bin
    const alignedPosition = Math.floor(self.lastSelected / bin) * bin;
    const clampedPosition = Math.max(0, Math.min(alignedPosition, maxPosition));
    
    // Update the scrubber element
    scrubber
      .attr('max', maxPosition.toString())
      .attr('step', bin.toString())
      .property('value', clampedPosition);
    
    // Sync lastSelected if it was adjusted
    if (clampedPosition !== self.lastSelected) {
      self.lastSelected = clampedPosition;
    }
  }
}

export function applyScrubberColors(self: Visual) {
  const scrubber = select<HTMLInputElement, unknown>('.tp-scrubber');
  if (scrubber.empty()) return;
  
  // Use the same color logic as buttons
  const buttonColor = self.settings.buttonSetting.showAll
    ? self.settings.buttonSetting.playColor
    : self.settings.buttonSetting.pickedColor;
  
  // Apply color to scrubber thumb using CSS custom property or inline style
  // Since we can't directly style pseudo-elements with inline styles, we'll use a CSS variable
  const scrubberElement = scrubber.node();
  if (scrubberElement) {
    scrubberElement.style.setProperty('--scrubber-thumb-color', buttonColor);
    
    // For webkit browsers, we need to use a style tag or update the CSS
    // Let's create a style element to override the CSS
    const styleId = 'tp-scrubber-color-style';
    let styleElement = select(`#${styleId}`);
    
    if (styleElement.empty()) {
      styleElement = select('head').append('style').attr('id', styleId);
    }
    
    // Create CSS rules for both webkit and moz
    const css = `
      .tp-scrubber::-webkit-slider-thumb {
        background: ${buttonColor} !important;
      }
      .tp-scrubber::-webkit-slider-thumb:hover {
        background: ${buttonColor} !important;
        opacity: 0.8;
      }
      .tp-scrubber::-moz-range-thumb {
        background: ${buttonColor} !important;
      }
      .tp-scrubber::-moz-range-thumb:hover {
        background: ${buttonColor} !important;
        opacity: 0.8;
      }
      .tp-scrubber:focus::-webkit-slider-thumb {
        box-shadow: 0 0 0 2px ${buttonColor}40 !important;
      }
      .tp-scrubber:focus::-moz-range-thumb {
        box-shadow: 0 0 0 2px ${buttonColor}40 !important;
      }
    `;
    
    styleElement.text(css);
  }
}

