import React from "react";
import { scaleLinear, scaleOrdinal } from "@visx/scale";
import { AreaStack } from "@visx/shape";
import { curveBasis } from "@visx/curve";
import { Text } from "@visx/text";
import "./styles.css";
import { Label } from "@visx/annotation";

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

const segments = [
  {
    index: 0,
    google: 3287,
    instagram: 1437,
    linkedin: 2045,
    twitter: 2645,
  },
  {
    index: 1,
    google: 2787,
    instagram: 1337,
    linkedin: 1945,
    twitter: 2145,
  },
  {
    index: 2,
    google: 1924,
    instagram: 1237,
    linkedin: 1845,
    twitter: 1145,
  },
  {
    index: 3,
    google: 1124,
    instagram: 1137,
    linkedin: 1045,
    twitter: 1045,
  },
  {
    index: 4,
    google: 900,
    instagram: 800,
    linkedin: 900,
    twitter: 700,
  },
  {
    //hack to make the last segment show up
    index: 5,
    google: 900,
    instagram: 800,
    linkedin: 900,
    twitter: 700,
  },
];

// const keys = ["google", "instagram", "linkedin", "twitter"];
const keys = ["google", "instagram", "linkedin", "twitter"];

const steps = {
  0: "Click",
  1: "Polygon Page",
  2: "Mint Page",
  3: "Mint",
  4: "Unique Mints",
};

// const data = interpolateData(segments);
const data = segments;

function FunnelChart({ width, height }) {
  const numSegments = Math.max(...segments.map(x));

  const xPadding = width / numSegments / 2;
  const yPadding = height / 10;

  const xScale = scaleLinear({
    range: [0, width],
    domain: [x(data[0]), x(data[data.length - 1])],
  });

  // set max equal to the max value of all the data added together
  const max = data.reduce((acc, d) => {
    let total = 0;
    for (let key in d) {
      if (key !== "index") {
        total += d[key];
      }
    }
    if (total > acc) {
      acc = total;
    }
    return acc;
  }, 0);

  const yScale = scaleLinear({
    range: [height, 0],
    domain: [0, max * 1.3], // add 30% to the max value to give some space at the top
  });

  // I have no idea why this is 'z' axis, but it's the color of the funnel
  const zScale = scaleOrdinal({
    range: ["#FF59AE", "#FF7E65", "#FFCE7E", "#AFFAAC"],
    domain: keys,
  });

  return (
    <svg width={width} height={height}>
      {/* This is the stacked funnel */}
      <AreaStack
        keys={keys}
        data={data}
        strokeWidth={2}
        stroke="transparent"
        curve={curveBasis}
        fillOpacity={1}
        x={(d) => xScale(x(d.data))}
        y0={(d) => yScale(d[0])}
        y1={(d) => yScale(d[1])}>
        {/* This fills in each area with the corresponding color */}
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
          <React.Fragment key={`bin-${i}`}>
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

      {/* These are the funnel labels */}
      {data.slice(0, 1).map((d, i) => {
        if (!data[i + 1] || i === data.length - 1) return null;
        const r = range(numSegments);
        if (!r.includes(x(d))) return null;
        return keys.map((key, j) => {
          if (key === "index") return;
          return (
            <Label
              title={`${key}`}
              fontColor="white"
              horizontalAnchor="start"
              verticalAnchor="middle"
              showAnchorLine={false}
              backgroundFill="rgba(0,0,0,0.25)"
              backgroundPadding={{ top: 4, bottom: 4, left: 20, right: 16 }}
              backgroundProps={{
                rx: 4,
              }}
              titleProps={{
                fontFamily: "Inter",
                textAnchor: "middle",
                fontWeight: 400,
                style: {
                  textTransform: "capitalize",
                },
              }}
              x={xScale(x(d)) - 4} // -4 to cut off the border radius
              y={yScale(
                // this code is calculating the sum of values of d object with given key up to index j
                j > 0
                  ? keys.slice(0, j).reduce((acc, k) => acc + d[k], 0) +
                      d[key] -
                      (keys.slice(0, j).reduce((acc, k) => acc + d[k], 0) +
                        d[key] -
                        //get the value of the sum of values of the next segment with given key up to index j - 1
                        keys
                          .slice(0, j)
                          .reduce((acc, k) => acc + data[i + 1][k], 0)) /
                        2
                  : d[key] / 2
              )}
            />
          );
        });
      })}

      {/* these are the values in each funnel */}
      {data.map((d, i) => {
        if (!data[i + 1] || i === data.length - 1) return null;
        const r = range(numSegments);
        if (!r.includes(x(d))) return null;
        return keys.map((key, j) => {
          if (key === "index") return;

          return (
            <React.Fragment key={`value-${i}-${key}`}>
              <Text
                textAnchor="middle"
                fill="black"
                fontSize={18}
                fontFamily="Inter"
                dy={".33em"}
                x={xScale(x(d)) + xPadding}
                y={yScale(
                  // this code is calculating the sum of values of d object with given key up to index j
                  j > 0
                    ? keys.slice(0, j).reduce((acc, k) => acc + d[k], 0) +
                        d[key] -
                        (keys.slice(0, j).reduce((acc, k) => acc + d[k], 0) +
                          d[key] -
                          //get the value of the sum of values of the next segment with given key up to index j - 1
                          keys
                            .slice(0, j)
                            .reduce((acc, k) => acc + data[i + 1][k], 0)) /
                          2
                    : d[key] / 2
                )}>
                {`${d[key]}`}
              </Text>
            </React.Fragment>
          );
        });
      })}

      {/* These are the steps at the top */}
      {segments.map((d, i) => {
        return (
          <React.Fragment key={`step-${i}`}>
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
