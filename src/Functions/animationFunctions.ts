import { Visual } from "../visual";
import { Status } from "../interfaces";
import { updateCaption } from "../DesignElements/renderCaptions";
import { updateScrubber } from "../DesignElements/renderScrubber";
import { select } from "d3";

export function playAnimation(self: Visual) {
  if (self.status === Status.Play) return;

  // Clear any pending timers from a previous run/pause.
  for (const t of self.timers) {
    clearTimeout(t);
  }
  self.timers = [];

  // Update button opacity
  select("#play").style("opacity", "0.3");
  select("#next").style("opacity", "0.3");
  select("#previous").style("opacity", "0.3");
  select("#stop").style("opacity", "1");
  select("#pause").style("opacity", "1");

  // Toggle display
  select('#play').style('display', self.settings.buttonSetting.minimal ? 'none' : 'flex');
  select('#stop').style('display', 'flex');

  const timeInterval = self.viewModel.settings.transitionSettings.timeInterval;
  const bin = Math.max(1, self.viewModel.settings.transitionSettings.bin ?? 1);
  const total = self.viewModel.dataPoints.length;

  const tick = () => {
    // Stop scheduling if playback was cancelled.
    if (self.status !== Status.Play) return;

    // Build selection for current window.
    const selectionArray = [];
    for (let j = 0; j < bin; j++) {
      const dp = self.viewModel.dataPoints[self.lastSelected + j];
      if (dp) selectionArray.push(dp.selectionId);
    }
    if (Visual.host.hostCapabilities.allowInteractions) {
      self.selectionManager.select(selectionArray);
    }
    updateCaption(self, false);
    // Update scrubber to show current position BEFORE advancing
    updateScrubber(self);

    // Check if this is the last iteration (next advance would go past the end)
    const nextSelected = self.lastSelected + bin;
    if (nextSelected >= total) {
      if (self.settings.transitionSettings.loop) {
        // Loop back to start after showing the last value
        const timer = setTimeout(() => {
          self.lastSelected = 0;
          updateScrubber(self);
          tick();
        }, timeInterval);
        self.timers = [timer];
      } else {
        // Playback complete - show last value then reset to start
        const timer = setTimeout(() => {
          // Clear timers first
          for (const t of self.timers) {
            clearTimeout(t);
          }
          self.timers = [];

          // Reset to starting position and clear selection
          self.lastSelected = 0; 
          
          if (Visual.host.hostCapabilities.allowInteractions) {
            self.selectionManager.clear();
          }
          self.status = Status.Stop;

          select('#play').style('opacity', '1');
          select('#pause').style('opacity', '0.3');
          select('#stop').style('opacity', '0.3');
          select('#next').style('opacity', '0.3'); // Disabled when stopped
          select('#previous').style('opacity', '0.3'); // Disabled when stopped
          select('#play').style('display', 'flex');
          select('#stop').style('display', self.settings.buttonSetting.minimal ? 'none' : 'flex');

          updateCaption(self, true);
          updateScrubber(self);
        }, timeInterval);
        self.timers = [timer];
      }
      return;
    }

    // Advance to next position and continue
    self.lastSelected = nextSelected;
    const timer = setTimeout(tick, timeInterval);
    self.timers = [timer];
  };

  self.status = Status.Play;
  // Run immediately for responsiveness, then schedule subsequent ticks.
  tick();
}

export function stopAnimation(self: Visual) {
  if (self.status === Status.Stop) return;

  // Set button opacities
  select("#pause").style("opacity", "0.3");
  select("#stop").style("opacity", "0.3");
  select("#next").style("opacity", "0.3");
  select("#previous").style("opacity", "0.3");
  select("#play").style("opacity", "1");

  // Toggle visibility
  select('#play').style('display', 'flex');
  select('#stop').style('display', self.settings.buttonSetting.minimal ? 'none' : 'flex');

  // Clear timers
  for (const i of self.timers) {
    clearTimeout(i);
  }

  updateCaption(self, true);
  self.lastSelected = 0;
    if (Visual.host.hostCapabilities.allowInteractions) {
    self.selectionManager.clear();
  }
  self.status = Status.Stop;
  updateScrubber(self);
}


export function pauseAnimation(self: Visual) {
  if (self.status === Status.Pause || self.status === Status.Stop) return;

  select("#pause").style("opacity", "0.3");
  select("#play").style("opacity", "1");
  select("#stop").style("opacity", "1");
  select("#next").style("opacity", "1");
  select("#previous").style("opacity", "1");

  // Optional layout change if needed (was in original)
  // select("#pause").style("left", "-170px"); // only if your layout needs it

  for (const i of self.timers) {
    clearTimeout(i);
  }

  self.status = Status.Pause;
}

export function step(self: Visual, step: number) {
  // Allow stepping during pause or stop (for scrubber interaction)
  if (self.status === Status.Play) return;

  const total = self.viewModel.dataPoints.length;
  if (self.lastSelected + step < 0 || self.lastSelected + step > total - 1) return;
  const bin = self.viewModel.settings.transitionSettings.bin;

  self.lastSelected = self.lastSelected + step;
  const selectionArray = [];
  for (let j = 0; j < bin; j++) {
    if (self.viewModel.dataPoints[self.lastSelected + j]) {
      selectionArray.push(self.viewModel.dataPoints[self.lastSelected + j].selectionId);
    }
  }
    if (Visual.host.hostCapabilities.allowInteractions) {
    self.selectionManager.select(selectionArray);
  }

  updateCaption(self, false);
  updateScrubber(self);

  // Update button opacities based on position
  const isAtStart = self.lastSelected === 0;
  const isAtEnd = self.lastSelected + bin >= total;

  select('#previous').style('opacity', isAtStart ? '0.3' : '1');
  select('#next').style('opacity', isAtEnd ? '0.3' : '1');
  select('#play').style('opacity', '1');
  select('#stop').style('opacity', '1');
  select('#pause').style('opacity', '0.3');

  self.status = Status.Pause;
}
