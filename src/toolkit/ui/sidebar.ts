export interface SidebarMenuActiveInput {
  targetPathname: string;
  currentPathname: string;
  targetHostname: string;
  currentHostname: string;
}

export function isSidebarMenuItemActive({
  targetPathname,
  currentPathname,
  targetHostname,
  currentHostname,
}: SidebarMenuActiveInput): boolean {
  const currentPathWithoutIndex = currentPathname.replace("index.html", "");

  const isSamePath =
    targetPathname === currentPathname || targetPathname === currentPathWithoutIndex;

  const isSubPath = currentPathname.startsWith(targetPathname) && targetPathname !== "/";

  return targetHostname === currentHostname && (isSamePath || isSubPath);
}
