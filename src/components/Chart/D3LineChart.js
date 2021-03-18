import React, { useRef, useEffect, useContext } from "react";
import { useChain, ChainContext } from 'context/chain/ChainContext'
import {
  area,
  extent,
  select,
  scaleLinear,
  line,
  curveCardinal,
  axisBottom,
  axisLeft
} from "d3";
import { useResizeObserver } from "./utils";
import styled from "styled-components";


const StyledSVG = styled.svg`
    display: block;
    width: 100%;
    height: 400px;
    overflow: visible;
`

/**
 * Component that renders a ZoomableLineChart
 */
function LineChart({ data, areaData, labelData: { priceAvg }, id = "bondingChart" }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

   const {theme} = useContext(ChainContext); 


  // charts and xAxis and yAxis
  useEffect(() => { 
    const margin = {top: 20, right: 20, bottom: 40, left: 80}
    const svg = select(svgRef.current);
    const svgContent = svg.select(".content");
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    function xValue(d) { return d.x; }      // accessors
    function yValue(d) { return d.y; }

    // scales + line generator
    const xScale = scaleLinear()
      .domain(extent(data, xValue))
      .range([margin.left, width - margin.right]);

    const yScale = scaleLinear()
      .domain(extent(data, yValue))
      .range([height - margin.top - margin.bottom, 10]);
  
    const lineGenerator = line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y)) // apply the y scale to the y data
      .curve(curveCardinal);

    const areaGenerator = area()
      .x(d => xScale(d.x))
      .y0(yScale(0))
      .y1(d => yScale(d.y))
      .curve(curveCardinal)
      console.log('12',theme.colors.lnHighlight)

    // render the base line
    svgContent
      .selectAll(".myLine")
      .data([data])
      .join("path")
      .attr("class", "myLine")
      .attr("stroke", `${theme.colors.lnNormal}`)
      .attr("stroke-width", "0.13rem")
      .attr("fill", "none")
      .attr("d", lineGenerator);
    
    //linearGradient
    const linearGradient = svgContent
      .append("linearGradient")
      .attr("id", "linear-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "0%")
      .attr("y2", "0%");

    linearGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", `${theme.colors.areaBottom}`); //

    linearGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", `${theme.colors.areaTop}`);  

    // highlited line and area
    svgContent
      .selectAll(".mySelectedLine")
      .data([areaData])
      .join("path")
      .attr("class", "mySelectedLine")
      .attr("stroke", `${theme.colors.lnHighlight}`)
      .attr("stroke-width", "0.22rem")
      .attr("fill", "none")
      .attr("d", lineGenerator);

    svgContent
      .selectAll(".mySelection")
      .data([areaData])
      .join("path")
      .attr("class", "mySelection")
      .attr("stroke", `${theme.colors.areaTop}`) 
      .attr("fill", "url(#linear-gradient")
      .attr("d", areaGenerator)

    
    // axes
    const xAxis = axisBottom(xScale);
    svg
      .select(".x-axis")
      .attr("transform", `translate(0, ${height - margin.bottom - margin.top})`)
      .attr("class", "xAxis")
      .call(xAxis)
      .style('color', `${theme.colors.textThirdly}`);

    const yAxis = axisLeft(yScale);
    svg
      .select(".y-axis")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis)
      .style("color", `${theme.colors.textThirdly}`);
    
  }, [priceAvg, areaData, data, dimensions]);

  return (
    <React.Fragment>
      <div ref={wrapperRef} style={{ marginTop: "1rem" }}>
        <StyledSVG ref={svgRef}>
          <defs>
            <clipPath id={id}>
              <rect x="0" y="0" width="100%" height="100%" />
            </clipPath>
          </defs>
          <g className="content" clipPath={`url(#${id})`} />
          <g className="x-axis" />
          <g className="y-axis" />
        </StyledSVG>
      </div>
    </React.Fragment>
  );
}

export default LineChart;