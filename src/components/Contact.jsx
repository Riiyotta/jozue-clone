export default function Contact() {
  return (
    <section id={"contact"} className={"homepage__talk homepage__talk--home"} data-nav-dark={""} data-parallax-scene={""} data-reveal-group={""}>
      {"\n"}
      <div className={"logo-full-container"}>
        {"\n"}
        <div className={"logo-full-layer"} data-parallax={"soft"}>
          {"\n"}
          <img src={"/_astro/jozue-logo-full.DpMZCk-F.svg"} className={"logo-full-img"} alt={"jozue"} />
          {"\n"}
        </div>
        {"\n"}
      </div>
      {"\n"}
      <ul className={"homepage__socials-ul"} data-reveal={""}>
        {"\n"}
        <li className={"homepage__socials-list"}>
          <a href={"https://www.instagram.com/__jozue__"} target={"_blank"} rel={"noopener"} className={"homepage__social"} data-underline={""}>
            {"instagram"}
          </a>
          {"."}
        </li>
        <li className={"homepage__socials-list"}>
          <a href={"https://bsky.app/profile/jozue.bsky.social"} target={"_blank"} rel={"noopener"} className={"homepage__social"} data-underline={""}>
            {"bluesky"}
          </a>
          {"."}
        </li>
        <li className={"homepage__socials-list"}>
          <a href={"https://fr.linkedin.com/in/jopichot"} target={"_blank"} rel={"noopener"} className={"homepage__social"} data-underline={""}>
            {"linkedin"}
          </a>
        </li>
        {"\n"}
      </ul>
      {"\n"}
      <p className={"homepage__talk-description"} data-reveal={""}>
        {"+33 6 61 77 32 20"}
      </p>
      {"\n"}
      <a href={"mailto:hi@jozue.fr"} target={"_blank"} rel={"noopener"} className={"homepage__talk-link"} data-reveal={""} data-roll={"ink"}>
        {"hi@jozue.fr"}
      </a>
      {"\n"}
    </section>
  );
}
