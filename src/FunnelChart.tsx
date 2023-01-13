import React from "react";
import ReactDOM from "react-dom";
import { ParentSize } from "@visx/responsive";
import { scaleLinear } from "@visx/scale";
import { Area } from "@visx/shape";
import { curveBasis } from "@visx/curve";
import { LinearGradient } from "@visx/gradient";
import { Text } from '@visx/text';
import "./styles.css";

const x = (d) => d.index;
const y = (d) => Math.max(d.value, 0.25);

function range(n) {
  return Array.from(Array(n).keys());
}

function interpolatePoints(current, next) {
  if (!next) return current;
  const xStep = 0.25;
  const yStep = Math.abs(y(next) - y(current)) * 0.03;
  const yMid1 = Math.abs(y(current) - yStep);
  const yMid2 = Math.abs(y(next) + yStep);
  const xMid1 = Math.abs(x(current) + xStep);
  const xMid2 = Math.abs(x(next) - xStep);
  return [
    current,
    { index: xMid1, value: yMid1 },
    { index: xMid2, value: yMid2 }
  ];
}

function interpolateData(data) {
  return data.map((d, i) => interpolatePoints(d, data[i + 1])).flat();
}

const segments = [
  { index: 0, value: 3287 },
  { index: 1, value: 1237 },
  { index: 2, value: 1000 },
  { index: 3, value: 700 },
  { index: 4, value: 400 },
];

const data = interpolateData(segments);

function FunnelChart({ width, height }) {
  const numSegments = segments.length;
  const maxValue = Math.max(...data.map(y));

  const xPadding = width / numSegments / 2;

  const xScale = scaleLinear({
    range: [0, width],
    domain: [0, numSegments]
  });
  const yScale = scaleLinear({
    range: [height, 0],
    domain: [0, maxValue]
  });

  return (
    <svg width={width} height={height}>
      // this is the funnel chart
      return (
      <Area
        key={`area-1`}
        data={data}
        fill={'rgb(191,248,179, 1)'}
        curve={curveBasis}
        x={(d) => xScale(x(d))}
        y0={(d) => yScale(y(d))}
        y1={(d) => yScale(-y(d))}
        fillOpacity={1}
        stroke="transparent"
      />
      );

      // these are the bins
      {data.map((d, i) => {
        console.log(d, i)
        if (!data[i + 1] || i === data.length - 1) return null;
        const r = range(numSegments);
        console.log(r)
        return (
          <React.Fragment key={`label-${i}`}>
            {r.includes(x(d)) && (
              < Text textAnchor="middle" fill="black" dy={".33em"} x={xScale(x(d)) + xPadding} y={height / 2}>{`${y(d)}`}</Text>
            )
            }
            {
              r.includes(x(d)) && (
                <line
                  x1={xScale(x(d) + 1)}
                  x2={xScale(x(d) + 1)}
                  y1={0}
                  y2={height}
                  stroke='rgba(0,0,0,0.1)'
                  strokeWidth={1}
                />
              )
            }
          </React.Fragment>
        );
      })}
    </svg >
  );
}

export default FunnelChart;