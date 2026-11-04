export default function MenuFr() {
  return (
    <nav id={"js-menu"} className={"menu menu--site"} aria-hidden={"true"} inert={""}>
      {"\n"}
      <ul className={"menu-ul"}>
        {"\n"}
        <li className={"menu-li"} style={{"--i":"0"}}>
          {"\n"}
          <a className={"menu-link"} href={"/fr/#about"} data-color={"#F73326"} data-title={"À propos"} data-no-swup={""} data-underline={""}>
            {"À propos."}
          </a>
          {"\n"}
        </li>
        <li className={"menu-li"} style={{"--i":"1"}}>
          {"\n"}
          <a className={"menu-link"} href={"/fr/#works"} data-color={"#F73326"} data-title={"Projets"} data-no-swup={""} data-underline={""}>
            {"Projets."}
          </a>
          {"\n"}
        </li>
        <li className={"menu-li"} style={{"--i":"2"}}>
          {"\n"}
          <a className={"menu-link"} href={"/fr/#contact"} data-color={"#111319"} data-title={"Contact"} data-no-swup={""} data-underline={""}>
            {"Contact."}
          </a>
          {"\n"}
        </li>
        {"\n"}
      </ul>
      {"\n"}
      <p className={"menu-lang"} style={{"--i":"3"}}>
        <a className={"menu-lang__item menu-lang__link"} href={"/"} hrefLang={"en"} lang={"en"} data-no-swup={""} data-underline={""}>
          {"English."}
        </a>
        {" "}
        <span className={"menu-lang__item"} lang={"fr"} aria-current={"true"} data-underline={""}>
          {"Français."}
        </span>
      </p>
      {"\n"}
    </nav>
  );
}
