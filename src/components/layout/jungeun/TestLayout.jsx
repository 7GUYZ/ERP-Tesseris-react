import React from "react";
import { Outlet } from "react-router-dom";
import TestHeader from "./TestHeader";
import TestNavi from "./TestNavi";

const TestLayout = () => {
  return (
    <div style={{minHeight:"100vh", display:"flex", flexDirection:"column"}}>
      <TestHeader />
      <main style={{ flex:1, overflow: "auto", padding: "20px", marginBottom:"56px", backgroundColor: "#F5F5F9"}}>
        <Outlet /> {/* 자식 페이지 렌더링 */}
      </main>
      <TestNavi />
    </div>
  );
};

export default TestLayout;
