import React, { useRef, useEffect, useState } from "react";
import {
  area,
  curve,
  extent,
  select,
  scaleLinear,
  line,
  max,
  curveCardinal,
  axisBottom,
  axisLeft,
  zoom,
  zoomTransform
} from "d3";
import { useResizeObserver } from "./utils";
import styled from "styled-components";
import { priceAtSupply } from 'utils/bonding'


const StyledSVG = styled.svg`
    display: block;
    width: 100%;
    height: 400px;
    overflow: visible;
`

const currentSupply = 1000000


/**
 * Component that renders a ZoomableLineChart
 */

function ZoomableLineChart({ data, areaData, id = "myZoomableLineChart" }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [currentZoomState, setCurrentZoomState] = useState();

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    const svgContent = svg.select(".content");

    // X and Y data arrays
    const xDataArray = data.map(item => item.x)
    const yDataArray = data.map(item => item.y)

    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    function xValue(d) { return d.x; }      // accessors
    function yValue(d) { return d.y; }

    // scales + line generator
    const xScale = scaleLinear()
      .domain(extent(data, xValue))
      .range([10, width - 10]);

    if (currentZoomState) {
      const newXScale = currentZoomState.rescaleX(xScale);
      xScale.domain(newXScale.domain());
    }

    const yScale = scaleLinear()
      .domain(extent(data, yValue))
      .range([height - 10, 10]);

    // Temporary
    if (currentZoomState) {
        const newYScale = currentZoomState.rescaleY(yScale);
        yScale.domain(newYScale.domain());
    }
    
    var lineGenerator = line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y)) // apply the y scale to the y data
      .curve(curveCardinal);

    var areaGenerator = area()
      .x(d => xScale(d.x))
      .y0(yScale(0))
      .y1(d => yScale(d.y))
      .curve(curveCardinal)

    // render the line
    svgContent
      .selectAll(".myLine")
      .data([data])
      .join("path")
      .attr("class", "myLine")
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("d", lineGenerator);
    
    svgContent
      .selectAll(".mySelection")
      .data([areaData])
      .join("path")
      .attr("class", "mySelection")
      .attr("stroke", "black")
      .attr("fill", "#0e4265")
      .attr("d", areaGenerator)

    /**
    svgContent
      .selectAll(".currentSupply")
      .join("line")
      .attr("class", "currentSupply")
      .style("stroke", "black")
      .attr("y1", 0)
      .attr("y2", height)
      .attr("x1", xScale(currentSupply))
      .attr("x2", xScale(currentSupply));

     */
    

    // axes
    const xAxis = axisBottom(xScale);
    svg
      .select(".x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    const yAxis = axisLeft(yScale);
    svg.select(".y-axis").call(yAxis);

    // zoom
    const zoomBehavior = zoom()
      .scaleExtent([0.5, 5])
      .translateExtent([
        [0, 0],
        [width, height]
      ])
      .on("zoom", () => {
        const zoomState = zoomTransform(svg.node());
        setCurrentZoomState(zoomState);
      });

    svg.call(zoomBehavior);
  }, [currentZoomState, data, dimensions]);

  return (
    <React.Fragment>
      <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
        <StyledSVG ref={svgRef}>
          <defs>
            <clipPath id={id}>
              <rect x="0" y="0" width="100%" height="100%" />
            </clipPath>
          </defs>
          <g className="content" clipPath={`url(#${id})`}>
            
          </g>
          <g className="x-axis" />
          <g className="y-axis" />
        </StyledSVG>
      </div>
    </React.Fragment>
  );
}

export default ZoomableLineChart;