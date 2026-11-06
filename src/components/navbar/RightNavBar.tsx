import type { JSX } from "solid-js";

interface RightNavBarProps {
  class?: string;
  children?: JSX.Element;
}

function RightNavBar(props: RightNavBarProps) {
  const mergedClass = () => [props.class ?? ""].filter(Boolean).join(" ");

  return (
    <ul class={`inline-flex cursor-pointer items-center justify-center ${mergedClass()}`.trim()}>
      {props.children}
    </ul>
  );
}

export default RightNavBar;
