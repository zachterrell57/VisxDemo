import React from "react";
import { scaleLinear, scaleOrdinal, scaleTime } from "@visx/scale";
import { Area } from "@visx/shape";
import { AreaStack } from "@visx/shape";
import { curveBasis } from "@visx/curve";
import { Text } from "@visx/text";
import "./styles.css";
import { Group } from "@visx/group";

const x = (d) => d.index;

// Find the max value of the data
const y = (d) => {
  let max = 0;
  for (let key in d) {
    if (key !== "index") {
      if (d[key] > max) {
        max = d[key];
      }
    }
  }
  return max;
};

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
    { index: xMid2, value: yMid2 },
  ];
}

function interpolateData(segments) {
  return segments.map((d, i) => interpolatePoints(d, segments[i + 1])).flat();
}

// const segments = [
//   { index: 0, value: 3287 },
//   { index: 1, value: 1237 },
//   { index: 2, value: 1000 },
//   { index: 3, value: 700 },
//   { index: 4, value: 400 },
//   { index: 5, value: 400 }, // hacky way to add a final segment that doesn't show
// ];

const segments = [
  {
    index: 0,
    Twitter: 3287,
    Facebook: 2000,
    Instagram: 1000,
    LinkedIn: 700,
    Google: 400,
  },
  {
    index: 1,
    Twitter: 1237,
    Facebook: 1700,
    Instagram: 1000,
    LinkedIn: 700,
    Google: 400,
  },
  {
    index: 2,
    Twitter: 1000,
    Facebook: 1500,
    Instagram: 1000,
    LinkedIn: 700,
    Google: 400,
  },
  {
    index: 3,
    Twitter: 700,
    Facebook: 1200,
    Instagram: 1000,
    LinkedIn: 700,
    Google: 400,
  },
  {
    index: 4,
    Twitter: 400,
    Facebook: 1000,
    Instagram: 1000,
    LinkedIn: 700,
    Google: 400,
  },
  {
    index: 4,
    Twitter: 400,
    Facebook: 1000,
    Instagram: 1000,
    LinkedIn: 700,
    Google: 400,
  }, // hacky way to add a final segment that doesn't show
];

const keys = ["Twitter", "Facebook", "Instagram", "LinkedIn", "Google"];
// const keys = ["Twitter", "Facebook"];

const steps = {
  0: "Click",
  1: "Polygon Page",
  2: "Mint Page",
  3: "Mint",
  4: "Unique Mints",
};

// const keys = ["Group1", "Group2", "Group3"];

// const data = interpolateData(segments);
const data = segments;

function FunnelChart({ width, height }) {
  const numSegments = Math.max(...segments.map(x));
  const maxValue = Math.max(...data.map(y));

  const xPadding = width / numSegments / 2;
  const yPadding = height / 10;

  const xScale = scaleLinear({
    range: [0, width],
    domain: [x(data[0]), x(data[data.length - 1])],
  });
  const yScale = scaleLinear({
    range: [height, 0],
    domain: [0, maxValue],
  });
  const zScale = scaleOrdinal({
    range: ["green", "yellow", "red", "blue", "purple"],
    domain: keys,
  });

  return (
    <svg width={width} height={height}>
      {/* This is the funnel */}
      <AreaStack
        keys={keys}
        data={data}
        strokeWidth={2}
        stroke="transparent"
        curve={curveBasis}
        fillOpacity={1}
        x={(d) => xScale(x(d.data))}
        y0={(d) => yScale(d[0])}
        y1={(d) => yScale(d[0] + d[1])}>
        {({ stacks, path }) =>
          stacks.map((stack, i) => (
            <path
              key={`stack-${stack.key}`}
              d={path(stack) || ""}
              stroke="transparent"
              fill={zScale(keys[i])}
            />
          ))
        }
      </AreaStack>

      {/* These are the bins */}
      {data.map((d, i) => {
        if (!data[i + 1] || i === data.length - 1) return null;
        const r = range(numSegments);
        return (
          <React.Fragment key={`label-${i}`}>
            {r.includes(x(d)) && (
              <Text
                textAnchor="middle"
                fill="black"
                fontFamily="Inter"
                dy={".33em"}
                x={xScale(x(d)) + xPadding}
                y={yScale(y(d) / 2)}>
                {`${y(d)}`}
              </Text>
            )}
            {r.includes(x(d)) && (
              <line
                x1={xScale(x(d) + 1)}
                x2={xScale(x(d) + 1)}
                y1={0}
                y2={height}
                stroke="rgba(0,0,0,0.1)"
                strokeWidth={2}
              />
            )}
          </React.Fragment>
        );
      })}

      {/* These are the steps at the top */}
      {segments.map((d, i) => {
        return (
          <React.Fragment key={`label-${i}`}>
            <Text
              textAnchor="middle"
              fill="black"
              fontSize={24}
              fontFamily="Inter"
              dy={".33em"}
              x={xScale(x(d)) + xPadding}
              y={0 + yPadding}>
              {steps[i]}
            </Text>
          </React.Fragment>
        );
      })}
    </svg>
  );
}

export default FunnelChart;
