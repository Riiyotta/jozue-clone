// Props: menuToggleDataColor
export default function MenuToggleVariant1(p) {
  return (
    <button type={"button"} id={"js-menu-button"} className={"menu-toggle menu-toggle--site is-visible"} aria-label={"Menu"} aria-controls={"js-menu"} aria-expanded={"false"} data-color={p.menuToggleDataColor}>
      {"\n"}
      <span className={"menu-toggle-bar menu-toggle-bar--top"} />
      {"\n"}
      <span className={"menu-toggle-bar menu-toggle-bar--middle"} />
      {"\n"}
      <span className={"menu-toggle-bar menu-toggle-bar--bottom"} />
      {"\n"}
    </button>
  );
}
