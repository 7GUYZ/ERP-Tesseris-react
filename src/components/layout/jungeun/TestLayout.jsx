import React from "react";
import { Outlet } from "react-router-dom";
import TestHeader from "./TestHeader";
import TestNavi from "./TestNavi";

const TestLayout = () => {
  return (
    <div>
      <TestHeader />
      <main style={{ padding: "20px" }}>
        <Outlet /> {/* 자식 페이지 렌더링 */}
      </main>
      <TestNavi />
    </div>
  );
};

export default TestLayout;
