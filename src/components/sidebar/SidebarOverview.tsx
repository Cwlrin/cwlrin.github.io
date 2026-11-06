import type { JSX } from "solid-js";

import type { NavItemType } from "../navbar/NavTypes";
import type { SidebarConfig } from "./SidebarTypes";
import SidebarAuthor from "./SidebarAuthor.tsx";
import SidebarMenu from "./SidebarMenu.tsx";
import SidebarSocial from "./SidebarSocial.tsx";
import SidebarState from "./SidebarState.tsx";

interface SiteState {
  categories: number;
  posts: number;
  tags: number;
}

interface SidebarOverviewProps {
  config: SidebarConfig;
  siteState: SiteState;
  menuSource: NavItemType[];
  avatarImage?: JSX.Element;
}

function SidebarOverview(props: SidebarOverviewProps) {
  return (
    <div class="w-full">
      <SidebarAuthor
        author={props.config.author || ""}
        description={props.config.description || ""}
        avatarImage={props.avatarImage}
      />
      <SidebarState state={props.siteState} />
      <SidebarSocial social={props.config.social || {}} />
      <SidebarMenu menu={props.menuSource} />
    </div>
  );
}

export default SidebarOverview;
