import { select } from 'd3';
import { Visual } from '../visual';

function fitCaptionFontToHeight(captionElement: HTMLElement) {
  // Only shrink when the rendered text is taller than the available box.
  // This avoids top/bottom clipping for multi-line captions (e.g., bin >= 3).
  const maxIterations = 6;
  const minFontSizePt = 6;

  const computed = window.getComputedStyle(captionElement);
  const computedFontSizePx = Number.parseFloat(computed.fontSize || '0');
  const pxToPt = 72 / 96;
  let fontSizePt = Math.max(minFontSizePt, Math.floor((computedFontSizePx || 0) * pxToPt));

  for (let i = 0; i < maxIterations; i++) {
    const available = captionElement.clientHeight;
    const needed = captionElement.scrollHeight;
    if (available <= 0 || needed <= available) return;

    const ratio = available / needed;
    const nextSize = Math.max(minFontSizePt, Math.floor(fontSizePt * ratio));
    fontSizePt = nextSize >= fontSizePt ? Math.max(minFontSizePt, fontSizePt - 1) : nextSize;
    captionElement.style.fontSize = `${fontSizePt}pt`;
  }
}

function getOrCreateToolbar(self: Visual) {
  const root = select(self.element);
  const existing = root.select<HTMLDivElement>('.tp-toolbar');
  if (!existing.empty()) {
    return existing;
  }

  return root.append('div').attr('class', 'tp-toolbar');
}

export function renderCaptions(self: Visual) {
  const toolbar = getOrCreateToolbar(self);
  toolbar.selectAll('.caption').remove();

  if (!self.visualSettings.captionSettings.show) return;
  toolbar
    .append('div')
    .classed('caption', true)
    .style('height', '100%')
    .style('min-width', '40px')
    .style('overflow', 'visible')
    .style('box-sizing', 'border-box');

  updateCaption(self, true);
}

export function updateCaption(self: Visual, isStopped: boolean) {
  const bin = self.visualSettings.transitionSettings.bin;
  const shouldWrap = (bin ?? 1) > 1;

  const captionSelection = select('.caption');
  const position = self.visualSettings.captionSettings.position;
  const horizontalAlign = position === 'right' ? 'flex-end' : position === 'center' ? 'center' : 'flex-start';

  // Layout rules:
  // - When stopped: single-line, no wrap (shows full categoryDisplay)
  // - When playing with bin == 1: allow wrapping if space isn't enough
  // - When playing with bin > 1: wrap, one per line, aligned by captionSettings.position
  // Always vertically centered.
  if (isStopped) {
    // Stopped: single line, no wrap
    captionSelection
      .style('display', 'flex')
      .style('flex-direction', 'row')
      .style('align-items', 'center')
      .style('justify-content', horizontalAlign)
      .style('text-align', position)
      .style('white-space', 'nowrap')
      .style('text-overflow', 'ellipsis')
      .style('word-break', null)
      .style('line-height', null)
      .style('padding-top', null)
      .style('padding-bottom', null);
  } else if (shouldWrap) {
    // Playing with bin > 1: wrap, one per line, keep words whole
    captionSelection
      .style('display', 'flex')
      .style('flex-direction', 'column')
      .style('align-items', horizontalAlign)
      .style('justify-content', 'center')
      .style('text-align', position)
      .style('white-space', 'normal')
      .style('text-overflow', 'clip')
      .style('word-break', 'normal')
      .style('overflow-wrap', 'break-word')
      .style('line-height', '1.1')
      .style('padding-top', '2px')
      .style('padding-bottom', '2px');
  } else {
    // Playing with bin == 1: allow wrapping if space isn't enough, but keep words whole
    captionSelection
      .style('display', 'flex')
      .style('flex-direction', 'row')
      .style('align-items', 'center')
      .style('justify-content', horizontalAlign)
      .style('text-align', position)
      .style('white-space', 'normal')
      .style('text-overflow', 'clip')
      .style('word-break', 'normal')
      .style('overflow-wrap', 'break-word')
      .style('line-height', '1.2')
      .style('padding-top', null)
      .style('padding-bottom', null);
  }

  const captionArray = self.viewModel.dataPoints.filter((datapoint, index) => {
    return index >= self.lastSelected && index < self.lastSelected + bin;
  });
  // const separator = self.visualSettings.captionSettings.separator;
  captionSelection.selectAll('*').remove();
  if (self.visualSettings.captionSettings.show) {
    const caption = isStopped ? self.viewModel.categoryDisplay : captionArray.map((el) => el.category).join(', ');
    captionSelection.attr('title', caption);
    if (isStopped) {
      captionSelection.append('span').text(self.viewModel.categoryDisplay);
    } else if (shouldWrap) {
      // bin > 1: one per line
      captionArray.forEach((el, i) => {
        captionSelection
          .append('span')
          .style('display', 'block')
          .text(`${el.category}${i === captionArray.length - 1 ? '' : `${self.visualSettings.captionSettings.separator} `}`);
      });
    } else {
      // bin == 1: single text that can wrap
      captionSelection.append('span').text(captionArray[0]?.category || '');
    }

    if (shouldWrap && !isStopped) {
      const captionElement = captionSelection.node() as HTMLElement | null;
      if (captionElement) {
        fitCaptionFontToHeight(captionElement);
      }
    }

    // select(".caption").text(caption);
  }
}
