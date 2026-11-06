import NavItem from "./NavItem.tsx";

interface NavLinkItemProps {
  href?: string;
  text?: string;
  icon?: string | null;
  ariaLabel?: string;
  class?: string;
}

function NavLinkItem(props: NavLinkItemProps) {
  const iconClasses = () =>
    props.icon ? `${props.icon} icon-nav text-xl vertical-text-bottom inline-block` : "";
  const mergedClass = () => [props.class ?? ""].filter(Boolean).join(" ");

  return (
    <NavItem class={mergedClass()}>
      <a href={props.href ?? "#"} aria-label={props.ariaLabel}>
        {props.icon && <div class={iconClasses()}></div>}
        {props.text}
      </a>
    </NavItem>
  );
}

export default NavLinkItem;
