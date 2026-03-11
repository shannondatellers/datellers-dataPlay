import { BaseType, Selection } from "d3";
import { datellersBubble, datellersCompleteImagetag } from "../DesignElements/designConstants";
import IVisualHost = powerbi.extensibility.visual.IVisualHost;

export function renderLandingPage(
  body: Selection<HTMLElement, unknown, null, BaseType>,
  host: IVisualHost,
  visualName: string,
  visualLink: string,
  visualDescription: string,
  showGettingStartedButton: boolean,
  viewport: {
    height: number;
    width: number;
  }
) {
  body.selectAll("*").remove();
  viewport.height;
  const visualWidth = viewport.width;
  const showFooter = viewport.width > 450 && viewport.height > 300;

  const landingPageContainer = createLandingPageContainer(body, viewport.height);
  const bodyContainer = landingPageContainer
    .append("div")
    .classed("bodyContainer", true)
    .style("position", "absolute")
    .style("top", "0px")
    .style("height", showFooter ? "calc(100% - 80px)" : "100%")
    .style("width", "100%")
    .style("overflow-y", "auto")
    .style("overflow-x", "hidden");

  createHeadingContainer(bodyContainer, visualName, host);
  createAboutVisual(bodyContainer, visualDescription);
  createScheduleConsultation(bodyContainer, host)
  createContactUsContainer(host, bodyContainer);
  createGettingStartedContainer(bodyContainer, showGettingStartedButton, visualLink, host);
  createFooterContainer(landingPageContainer, visualWidth, showFooter, host);
}

function createLandingPageContainer(body: Selection<HTMLElement, unknown, null, BaseType>, visualHeight: number) {
  return body
    .append("div")
    .classed("landingPageContainer", true)
    .style("width", "100%")
    .style("height", `${visualHeight}px`)
    .style("background", "transparent")
    .style("overflow", "hidden");
}

function createHeadingContainer(container: Selection<HTMLElement, unknown, null, BaseType>, visualName: string, host: any) {
  const headingContainer = container
    .append("div")
    .classed("headingContainer", true)
    .style("width", "100%")
    .style("height", "auto")
    .style("background", "transparent")
    .style("position", "relative")
    .style("display", "flex");

  headingContainer //company logo
    .append("img")
    .classed("logo", true)
    .attr("src", datellersBubble)
    .style("width", "60px")
    .style("height", "46px")
    .style("position", "absolute")
    .style("top", "0px")
    .style("display", "block")
    .style("right", "10px")
    .on("click", () => host.launchUrl(`https://datellers.com`));

  headingContainer // visualNameDiv
    .append("h1")
    .classed("visualName", true)
    .style("max-width", "calc(100% - 90px)")
    .style("height", "100%")
    .style("line-height", "1")
    .style("font-family", "Segoe UI")
    .style("margin-left", "15px")
    .style("margin-right", "75px")
    .style("padding-top", "5px")
    .style("display", "block")
    .style("white-space", "normal")
    .style("overflow-wrap", "break-word")
    .style("font-weight", "bold")
    .text(`${visualName}`);
}

function createAboutVisual(container: Selection<HTMLElement, unknown, null, BaseType>, visualDescription: string) {
  const aboutVisual = container
    .append("div")
    .classed("aboutContainer", true)
    .style("margin-top", "10px")
    .style("padding-left", "15px")
    .style("margin-bottom", "5px")
    .style("width", "95%")
    .style("height", "auto")
    .style("font-family", "Segoe UI");

  aboutVisual
    .append("p")
    .text(`${visualDescription}`)
    .style("font-weight", "normal")
    .style("text-align", "justify")
    .style("font-size", "12pt")
    .style("margin", "0px");
}


function createScheduleConsultation(container: Selection<HTMLElement, unknown, null, BaseType>, host: IVisualHost) {
  const scheduleConsultationContainer = container
    .append("div")
    .classed("scheduleConsultationContainer", true)
    .style("margin-top", "10px")
    .style("padding-left", "15px")
    .style("margin-bottom", "5px")
    .style("width", "95%")
    .style("height", "auto")
    .style("font-family", "Segoe UI");

  const paragraph = scheduleConsultationContainer
    .append("p")
    .style("font-weight", "normal")
    .style("text-align", "justify")
    .style("font-size", "12pt")
    .style("margin", "0px");

  paragraph.append("span").text("Since every dataset is different, you may need help tailoring the visual to your use case. ");
  
  paragraph
    .append("span")
    .text("Schedule a free consultation call")
    .style("color", "#0078D4")
    .style("cursor", "pointer")
    .style("text-decoration", "underline")
    .on("click", () => host.launchUrl("https://outlook.office.com/book/SuccessConsulting@datellers.com/?ismsaljsauthenabled"));
  
  paragraph.append("span").text(" and we’ll help you with your report configuration.");
}

function createContactUsContainer(host: IVisualHost, container: Selection<HTMLElement, unknown, null, BaseType>) {
  const contactUsContainer = container
    .append("div")
    .classed("contactUsContainer", true)
    .style("margin-top", "10px")
    .style("padding-left", "15px")
    .style("margin-bottom", "5px")
    .style("width", "95%")
    .style("height", "auto")
    .style("font-size", "12pt")
    .style("font-family", "Segoe UI");

  contactUsContainer.append("span").text("Have any questions? Email us at ");
  contactUsContainer.append("span").text("contact@datellers.com").style("font-weight", "500");
}

function createGettingStartedContainer(
  container: Selection<HTMLElement, unknown, null, BaseType>,
  showGettingStartedButton: boolean,
  visualLink: string,
  host: any
) {
  const gettingStartedContainer = container
    .append("div")
    .classed("gettingStartedContainer", true)
    .style("width", "100%")
    .style("height", "auto")
    .style("text-align", "center")
    .style("display", showGettingStartedButton ? "block" : "none")
    .style("margin-top", "15px")
    .style("margin-bottom", "50px");

  gettingStartedContainer //getting started button
    .append("button")
    .style("width", "200px")
    .style("height", "50px")
    .style("background", "#293F55")
    .style("color", "#fff")
    .text("Getting Started")
    .style("font-size", "16px")
    .style("font-family", "Segoe UI")
    .style("border-left", "5px solid #00C69A")
    .style("border-top", "5px solid #FF423E")
    .style("border-right", "5px solid #FFCA1F")
    .style("border-bottom", "5px solid #3DBBE8")
    .style("border-radius", "50px")
    .on("click", () => host.launchUrl(visualLink));
}

function createFooterContainer(container: Selection<HTMLElement, unknown, null, BaseType>, visualWidth: number, showFooter: boolean, host: any) {
  const footerContainer = container
    .append("div")
    .classed("footerContainer", true)
    .style("position", "absolute")
    .style("bottom", "0px")
    .style("height", "80px")
    .style("width", "100%")
    .style("background", "#293F55")
    .style("display", showFooter ? "block" : "none")
    .on("click", () => host.launchUrl(`https://datellers.com/contact-us/`));

  const footerDescription = footerContainer //footerDescription
    .append("div")
    .classed("footerDescription", true)
    .style("height", "100%")
    .style("max-height", "60px")
    .style("color", "#fff")
    .style("position", "absolute")
    .style("left", "30px")
    .style("right", "250px")
    .style("top", "calc(25% - 10px)")
    .style("font-size", "13pt")
    .style("text-align", "left")
    .style("font-family", "Segoe UI")
    .style("font-weight", "400")
    .style("display", "flex")
    .style("flex-direction", "column")
    .style("overflow", "hidden");

  footerDescription
    .append("span")
    .style("white-space", "nowrap")
    .style("overflow", "hidden")
    .text("Need help with your data?");

  footerDescription
    .append("span")
    .style("white-space", "nowrap")
    .style("overflow", "hidden")
    .text("Get in touch.");

  footerContainer //company logo full
    .append("img")
    .classed("logo", true)
    .attr("src", datellersCompleteImagetag)
    .style("position", "absolute")
    // .style("height", "70px")
    .style("width", "220px")
    .style("top", "10px")
    .style("left", "none")
    .style("right", "10px");
}
