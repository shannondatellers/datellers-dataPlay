/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

"use strict";

import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;
import { Visual } from "../visual";

export class VisualSettings extends DataViewObjectsParser {
  public transitionSettings: TransitionSettings = new TransitionSettings();
  public buttonSetting: ButtonSetting = new ButtonSetting();
  public captionSettings: CaptionSettings = new CaptionSettings();
  public customSort: CustomSortSettings = new CustomSortSettings();
  public scrubberSettings: ScrubberSettings = new ScrubberSettings();
}

export class TransitionSettings {
  public autoStart: boolean = false;
  public loop: boolean = false;
  public timeInterval: number = 1000;
  public bin: number = 1;
}

export class ButtonSetting {
  public minimal: boolean = false;
  public dynamicSize: boolean = true;
  public buttonSize: number = 25;
  public pickedColor: string = Visual.host ? Visual.host.colorPalette.getColor("default").value : "#333333";
  public showAll: boolean = false;
  public playColor: string = Visual.host ? Visual.host.colorPalette.getColor("play").value : "#333333";
  public pauseColor: string = Visual.host ? Visual.host.colorPalette.getColor("pause").value : "#333333";
  public stopColor: string = Visual.host ? Visual.host.colorPalette.getColor("stop").value : "#333333";
  public previousColor: string = Visual.host ? Visual.host.colorPalette.getColor("previous").value : "#333333";
  public nextColor: string = Visual.host ? Visual.host.colorPalette.getColor("next").value : "#333333";
  public columnQuery: string = "";
  public iconStyle: "default" | "filled" | "btn" | "btn-fill" | "circle" | "circle-fill" = "circle";
  public background: boolean = false;
  public backgroundColor: string = "#f0f0f0";
  public padding: number = 2;
  public margin: number = 2;
}

export class CaptionSettings {
  public show: boolean = true;
  public captionColor: string = "#333333";
  public fontSize: number = 12;
  public position: string = "left";
}

export class CustomSortSettings {
  public show: boolean = false;
  public ascending: boolean = true;
}

export class ScrubberSettings {
  public show: boolean = true;
}
