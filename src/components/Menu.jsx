export default function Menu() {
  return (
    <nav id={"js-menu"} className={"menu menu--site"} aria-hidden={"true"} inert={""}>
      {"\n"}
      <ul className={"menu-ul"}>
        {"\n"}
        <li className={"menu-li"} style={{"--i":"0"}}>
          {"\n"}
          <a className={"menu-link"} href={"/#about"} data-color={"#F73326"} data-title={"About"} data-no-swup={""} data-underline={""}>
            {"About."}
          </a>
          {"\n"}
        </li>
        <li className={"menu-li"} style={{"--i":"1"}}>
          {"\n"}
          <a className={"menu-link"} href={"/#works"} data-color={"#F73326"} data-title={"Works"} data-no-swup={""} data-underline={""}>
            {"Works."}
          </a>
          {"\n"}
        </li>
        <li className={"menu-li"} style={{"--i":"2"}}>
          {"\n"}
          <a className={"menu-link"} href={"/#contact"} data-color={"#111319"} data-title={"Contact"} data-no-swup={""} data-underline={""}>
            {"Contact."}
          </a>
          {"\n"}
        </li>
        {"\n"}
      </ul>
      {"\n"}
      <p className={"menu-lang"} style={{"--i":"3"}}>
        <span className={"menu-lang__item"} lang={"en"} aria-current={"true"} data-underline={""}>
          {"English."}
        </span>
        {" "}
        <a className={"menu-lang__item menu-lang__link"} href={"/fr/"} hrefLang={"fr"} lang={"fr"} data-no-swup={""} data-underline={""}>
          {"Français."}
        </a>
      </p>
      {"\n"}
    </nav>
  );
}
