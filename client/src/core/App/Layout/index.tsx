import { Outlet } from "react-router-dom";
import { MainContent, StyledLayout } from "./styled";
import { TopPanel } from "./TopPanel";
import { NavPanel } from "./NavPanel";

export const Layout = () => {
  return (
    <StyledLayout>
      <TopPanel />
      <NavPanel />
      <MainContent>
        <Outlet />
      </MainContent>
    </StyledLayout>
  );
};