import React, { useRef, useEffect, useState } from "react";
import { select, Selection } from "d3-selection";
import { scaleLinear, scaleBand } from "d3-scale";
import { max } from "d3-array";
import randomstring from "randomstring";
import "d3-transition";
import styled from "styled-components";
import { easeElastic } from "d3-ease";
import { axisLeft, axisBottom } from "d3-axis";
import './App.css';

const Button = styled.button`
  background-color: "blue";
  transition-duration: 500ms;
  transition-timing-function: ease-in-out;

  &:hover {
    background-color: "orange";
  }
`;

let initialData = [
  {
    name: "cat",
    units: 23
  },
  {
    name: "fom",
    units: 73
  },
  {
    name: "tyr",
    units: 10
  },
  {
    name: "swine",
    units: 43
  },
  {
    name: "mouse",
    units: 99
  },
  {
    name: "owl",
    units: 24
  }
];

const dimensions = {
  width: 900,
  height: 600,
  marginLeft: 100,
  chartHeight: 600,
};

const App: React.FC = () => {
  const ref = useRef<SVGSVGElement | null>(null);
  const [selection, setSelection] = useState<null | Selection<
    SVGSVGElement | null,
    unknown,
    null,
    undefined
  >>(null);

  const [data, setData] = useState(initialData);

  let y = scaleLinear()
    .domain([0, max(data, d => d.units)!])
    .range([dimensions.height, 0]);

  let x = scaleBand()
    .domain(data.map(d => d.name))
    .range([0, dimensions.width])
    .padding(0.05);

  const yAxis = axisLeft(y);
  const xAxis = axisBottom(x);

  useEffect(() => {
    if (!selection) {
      setSelection(select(ref.current));
    } else {
      // const xAxisGroup = selection
      // .append('g')
      // .call(xAxis)

      // const yAxisGroup = selection.append("g").call(yAxis);

      selection
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("width", x.bandwidth)
        .attr("height", 0)
        .attr("fill", "orange")
        .attr("x", d => x(d.name)!)
        .attr("height", 0)
        .attr("y", dimensions.height)
        .transition()
        .duration(500)
        .delay((_, i) => i * 300)
        .ease(easeElastic)
        .attr("height", d => dimensions.height - y(d.units))
        .attr("y", d => y(d.units));
    }
  }, [selection]);

  useEffect(() => {
    if (selection) {
      y = scaleLinear()
        .domain([0, max(data, d => d.units)!])
        .range([dimensions.height, 0]);

      x = scaleBand()
        .domain(data.map(d => d.name))
        .range([0, dimensions.width])
        .padding(0.05);

      const rects = selection.selectAll("rect").data(data);

      rects
        .exit()
        .transition()
        .duration(300)
        .attr("y", dimensions.height)
        .attr("height", 0)

        .remove();

      rects
        .transition()
        .duration(300)
        .delay(100)
        .attr("width", x.bandwidth)
        .attr("height", d => dimensions.height - y(d.units))
        .attr("x", d => x(d.name)!)
        .attr("y", d => y(d.units))
        .attr("fill", "orange");

      rects
        .enter()
        .append("rect")
        .attr("width", x.bandwidth)
        .attr("height", 0)
        .attr("fill", "orange")
        .attr("x", d => x(d.name)!)
        .attr("y", dimensions.height)
        .attr("height", 0)
        .transition()
        .duration(500)
        .delay(250)
        .ease(easeElastic)
        .attr("height", d => dimensions.height - y(d.units))
        .attr("y", d => y(d.units));
    }
  }, [data]);

  const addRandom = () => {
    const dataToBeAdded = {
      name: randomstring.generate(10),
      units: Math.floor(Math.random() * 80 + 20)
    };
    setData([...data, dataToBeAdded]);
  };
  const removeLast = () => {
    if (data.length === 0) {
      return;
    }
    const slicedData = data.slice(0, data.length - 1);
    setData(slicedData);
  };
  return (
    <div>
      <svg ref={ref} width={dimensions.width} height={dimensions.height}></svg>
      <button className='controlFig' onClick={addRandom}>Add Random</button>
      <button onClick={removeLast}>Remove Last</button>
    </div>
  );
};

export default App;
