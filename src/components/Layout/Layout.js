// src/components/Layout/Layout.js
import { Outlet } from "react-router-dom";
import  Header  from "../Header/Header";

export function Layout() {
  return (
    <>
      <Header />
      <Outlet /> {/* This renders the child route */}
    </>
  );
}
