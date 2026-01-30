import { BaseType, Selection } from "d3";
import { datellersBubble, datellersCompleteImagetag } from "../DesignElements/designConstants";
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import powerbi from "powerbi-visuals-api";

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
  const visualWidth = viewport.width;

  const landingPageContainer = createLandingPageContainer(body, viewport.height);
  const bodyContainer = landingPageContainer
    .append("div")
    .classed("bodyContainer", true)
    .style("position", "absolute")
    .style("top", "0px")
    .style("height", "calc(100% - 100px)")
    .style("width", "100%")
    .style("overflow-y", "auto")
    .style("overflow-x", "hidden");

  createHeadingContainer(bodyContainer, visualName, visualWidth, host);
  createAboutVisual(bodyContainer, visualDescription);
  createContactUsContainer(host, bodyContainer);
  createGettingStartedContainer(bodyContainer, showGettingStartedButton, visualLink, host);
  createFooterContainer(landingPageContainer, visualWidth, host);
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

function createHeadingContainer(container: Selection<HTMLDivElement, unknown, null, BaseType>, visualName: string, visualWidth: number, host: any) {
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
    .style("width", "85px")
    .style("height", "65px")
    .style("position", "absolute")
    .style("top", "0px")
    .style("display", "block")
    .style("right", "10px")
    .on("click", () => host.launchUrl(`https://datellers.com`));

  headingContainer // visualNameDiv
    .append("h1")
    .classed("visualName", true)
    .style("min-width", "250px")
    .style("height", "100%")
    .style("line-height", "1")
    .style("font-family", "Segoe UI")
    .style("margin-left", "15px")
    .style("padding-top", () => (visualWidth < 300 ? "75px" : "5px"))
    .style("display", "block")
    .style("font-weight", "bold")
    .text(`${visualName}`);
}

function createAboutVisual(container: Selection<HTMLDivElement, unknown, null, BaseType>, visualDescription: string) {
  const aboutVisual = container
    .append("div")
    .classed("aboutContainer", true)
    .style("margin-top", "20px")
    .style("padding-left", "15px")
    .style("margin-bottom", "10px")
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

function createContactUsContainer(host: IVisualHost, container: Selection<HTMLDivElement, unknown, null, BaseType>) {
  const contactUsContainer = container
    .append("div")
    .classed("contactUsContainer", true)
    .style("padding-left", "15px")
    .style("width", "95%")
    .style("height", "auto")
    .style("font-size", "12pt")
    .style("font-family", "Segoe UI");

  contactUsContainer.append("span").text("Have any questions or feedback? Email us at ");
  contactUsContainer.append("span").text("contact@datellers.com").style("font-weight", "500");
}

function createGettingStartedContainer(
  container: Selection<HTMLDivElement, unknown, null, BaseType>,
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
    .text("Contact Us")
    .style("font-size", "16px")
    .style("font-family", "Segoe UI")
    .style("border-left", "5px solid #00C69A")
    .style("border-top", "5px solid #FF423E")
    .style("border-right", "5px solid #FFCA1F")
    .style("border-bottom", "5px solid #3DBBE8")
    .style("border-radius", "50px")
    .on("click", () => host.launchUrl(visualLink));
}

function createFooterContainer(container: Selection<HTMLDivElement, unknown, null, BaseType>, visualWidth: number, host: any) {
  const footerContainer = container
    .append("div")
    .classed("footerContainer", true)
    .style("position", "absolute")
    .style("bottom", "0px")
    .style("height", "100px")
    .style("width", "100%")
    .style("background", "#293F55")
    .on("click", () => host.launchUrl(`https://datellers.com/contact-us/`));

  footerContainer //footerDescription
    .append("div")
    .classed("footerDescription", true)
    .style("height", "100%")
    .style("width", `calc(100% - 310px)`)
    .style("min-width", "50px")
    .style("max-width", "300px")
    .style("max-height", "60px")
    .style("color", "#fff")
    .style("position", "relative")
    .style("top", "calc(25% - 10px)")
    .style("font-size", "15pt")
    .style("text-align", "left")
    .style("font-family", "Segoe UI")
    .style("font-weight", "400")
    .style("left", "30px")
    .text("Click here to get your own visual built!")
    .style("display", "-webkit-box")
    .style("-webkit-box-orient", "vertical")
    .style("-webkit-line-clamp", "3")
    .style("overflow", "hidden")
    .style("text-overflow", "ellipsis")
    .style("word-wrap", "break-word");

  footerContainer //company logo full
    .append("img")
    .classed("logo", true)
    .attr("src", datellersCompleteImagetag)
    .style("position", "absolute")
    .style("height", "70px")
    .style("width", "260px")
    .style("top", "13px")
    .style("left", "none")
    .style("right", "10px");
}
