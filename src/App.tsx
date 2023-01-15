import "./App.css";
import React from "react";
import { ParentSize } from "@visx/responsive";
import FunnelChart from "./FunnelChart";
import StackedCharts from "./example";

export default function App() {
  const width = "100vw";
  const height = "100vh";

  return (
    <main>
      <div className="Chart" style={{ width, height }}>
        <ParentSize>
          {(parent) => {
            return <FunnelChart width={parent.width} height={parent.height} />;
            // return (
            //   <StackedCharts width={parent.width} height={parent.height} />
            // );
          }}
        </ParentSize>
      </div>
    </main>
  );
}
