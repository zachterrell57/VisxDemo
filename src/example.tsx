import { Group } from "@visx/group";
import { AreaStack } from "@visx/shape";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { scaleTime, scaleLinear, scaleOrdinal } from "@visx/scale";

let data = [
  { date: "2012-04-23T04:00:00.000Z", Group1: 37, Group2: 12, Group3: 46 },
  { date: "2012-04-24T04:00:00.000Z", Group1: 32, Group2: 19, Group3: 42 },
  { date: "2012-04-25T04:00:00.000Z", Group1: 45, Group2: 16, Group3: 44 },
  { date: "2012-04-26T04:00:00.000Z", Group1: 24, Group2: 52, Group3: 64 },
];

const keys = ["Group1", "Group2", "Group3"];
const x = (d) => new Date(d.date);

const xScale = scaleTime({
  domain: [x(data[0]), x(data[3])],
});
const yScale = scaleLinear({
  domain: [0, 240],
});
const zScale = scaleOrdinal({
  range: ["#3182bd", "#6baed6", "#9ecae1"],
  domain: keys,
});

const StackedCharts = ({ width, height }) => {
  const xMax = width;
  const yMax = height;

  xScale.range([0, xMax]);
  yScale.range([yMax, 0]);

  return (
    <svg width={width} height={height}>
      <Group>
        <AreaStack
          keys={keys}
          data={data}
          stroke="white"
          strokeWidth={2}
          x={(d) => xScale(x(d.data))}
          y0={(d) => yScale(d[0])}
          y1={(d) => yScale(d[0] + d[1])}
          fill={(d) => zScale(keys[d.index])}
        />
        <AxisLeft scale={yScale} />
        <AxisBottom top={yMax} scale={xScale} />
      </Group>
    </svg>
  );
};

export default StackedCharts;
