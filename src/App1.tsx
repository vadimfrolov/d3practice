import React, { useRef, useEffect, useState } from "react";
import { select, Selection } from "d3-selection";
import { scaleLinear, scaleBand } from "d3-scale";
import { max } from "d3-array";
import randomstring from "randomstring";
import "d3-transition";
import styled from "styled-components";
import { easeBounce } from 'd3-ease'

const Button = styled.button`
  background-color: "blue";
  transition-duration: 500ms;
  transition-timing-function: ease-in-out;

  &:hover {
    background-color: "orange";
  }
`

const App: React.FC = () => {
  const ref = useRef<SVGSVGElement | null>(null);
  const [selection, setSelection] = useState<null | Selection<
    SVGSVGElement | null,
    unknown,
    null,
    undefined
  >>(null);



  useEffect(() => {
    if (!selection) {
      setSelection(select(ref.current));
    } else {
      selection
        .append("rect")
        .attr("width", 100)
        .attr("height", 100)
        .attr("fill", "orange")
        .transition()
        .duration(2000)
        .ease(easeBounce)
        .attr('fill', 'blue')
        .attr("height", 400)
    }
  }, [selection]);

  return (
    <div>
      <svg ref={ref} height={400}></svg>

    </div>
  );
};

export default App;
