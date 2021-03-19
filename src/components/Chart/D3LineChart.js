import React, { useRef, useEffect, useContext } from "react";
import { ChainContext } from 'context/chain/ChainContext'
import {
  area,
  extent,
  select,
  scaleLinear,
  line,
  curveCardinal,
  axisBottom,
  axisLeft,
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
    const margin = {top: 20, right: 20, bottom: 40, left: 60}
    const svg = select(svgRef.current);
    const svgContent = svg.select(".content");
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    function xValue(d) { return d.x; }      // accessors
    function yValue(d) { return d.y; }


    // scales + line/area generators
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
 

    // base line
    svgContent
      .selectAll(".baseLine")
      .data([data])
      .join("path")
      .attr("class", "baseLine")
      .attr("stroke", `${theme.colors.bgHighlight}`)
      .attr("stroke-width", "0.16rem")
      .attr("fill", "none")
      .attr("d", lineGenerator);

      
    //highlited line and highlited area with linearGradient
    const linearGradient = svgContent
      .append("linearGradient")
      .attr("id", "linear-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", "0%")
      .attr("y1", "81%")
      .attr("x2", "1%")
      .attr("y2", "0%");

    linearGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", `${theme.colors.bgDarken}`); //

    linearGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", `${theme.colors.lnHighlight}`);  

    svgContent
      .selectAll(".selectedArea")
      .data([areaData])
      .join("path")
      .attr("class", "selectedArea")
      .attr("stroke", `${theme.colors.areaTop}`) 
      .attr("stroke-width", "0.03rem")
      .attr("fill", "url(#linear-gradient")
      .attr("d", areaGenerator)

    svgContent
      .selectAll(".selectedLine")
      .data([areaData])
      .join("path")
      .attr("class", "selectedLine")
      .attr("stroke", `${theme.colors.lnHighlight}`)
      .attr("stroke-width", "0.15rem")
      .attr("fill", "none")
      .attr("d", lineGenerator);


    // X Axis main
    const xAxis = axisBottom(xScale)
      .tickSize("15")
      .ticks(5)
      .tickFormat(d => d/1000000 + "m");

    const xComplex = svg
      .select(".x-axis")
      .attr("transform", `translate(0, ${height - margin.bottom - margin.top})`)
      .style('color', `${theme.colors.bgHighlight}`)
      .attr("stroke-width", "0.10rem")
      .call(xAxis);

    xComplex
      .selectAll(".tick text")
      .attr("transform", `translate(0, 10)`)
      .style("color", `${theme.colors.textThirdly}`)
      .style("font-size", "0.7rem");

    xComplex
      .selectAll(".tick line")
      .style("color", `${theme.colors.bgHighlight}`)


    //x Axis minor
    const xAxis1 = axisBottom(xScale)
      .tickSize("10")
      .ticks(25)
      .tickFormat([]);

    const xComplex1 = svg
      .select(".x-axis2")
      .attr("transform", `translate(0, ${height - margin.bottom - margin.top})`)
      .style('color', `${theme.colors.bgHighlight}`)
      .call(xAxis1);  

    xComplex1
      .selectAll(".tick line")
      .style('stroke-width', '0.1rem')
      .style("color", `${theme.colors.bgHighlight}`)
 
      
    // the end tick of x-axis comes from the x-axis, not the ticks
    // To hide the x-axis horizontal line, but still make the end tick show up, we cannot just remove or hide the x-axis
    // Here,  we use a base line with same color as the background to cover the x-axis horizontal line, but leave the end tick visible
    svgContent.append("line")
      .attr("stroke", `${theme.colors.bgDarken}`)
      .attr("stroke-width", "0.12rem")
      .attr("x1", margin.left)
      .attr("y1", yScale(0)+ 0.5)
      .attr("x2", width - margin.right)
       .attr("y2",yScale(0)+ 0.5);  


    // y Axis and gridlines
    const gridlinesSize = width - margin.right - margin.left;
    const yAxis = axisLeft(yScale).tickSizeInner(-gridlinesSize);
    const yComplex = svg
      .select(".y-axis")
      .attr("transform", `translate(${margin.left}, 0)`)
      .style('color', `${theme.colors.bgDarken}`)
      .call(yAxis);

    yComplex.selectAll(".tick text")
      .style("color", `${theme.colors.textThirdly}`)
      
    yComplex.selectAll(".tick line")
      .style("color", `${theme.colors.bgNormal}`)
      ;
    
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
          <g className="y-axis" />
          <g className="x-axis2" />
          <g className="x-axis" />
          <g className="content" clipPath={`url(#${id})`} />
          
         
        </StyledSVG>
      </div>
    </React.Fragment>
  );
}

export default LineChart;