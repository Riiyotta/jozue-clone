export default function MenuToggle() {
  return (
    <button type={"button"} id={"js-menu-button"} className={"menu-toggle menu-toggle--site"} aria-label={"Menu"} aria-controls={"js-menu"} aria-expanded={"false"} data-color={"#111319"} inert={""}>
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
