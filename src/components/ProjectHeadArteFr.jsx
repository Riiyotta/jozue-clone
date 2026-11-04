export default function ProjectHeadArteFr() {
  return (
    <section className={"project-head"} style={{"backgroundColor":"#241f1a","--signature-alpha":"0.047"}} data-nav-dark={""} data-depth-scene={""} data-signature-ink={"light"}>
      {"\n"}
      <div className={"logo-full-container"} data-depth={"0.35"}>
        {"\n"}
        <img src={"/_astro/jozue-logo-project.B0nm3wc4.svg"} className={"logo-full-img logo-full-img--project logo-static"} alt={"jozue"} />
        {"\n"}
        <div id={"js-project-signature"} className={"logo-full-img logo-full-img--project project-signature"} aria-hidden={"true"} />
        {"\n"}
      </div>
      {"\n"}
      <a href={"/fr/#works"} className={"project-back js-back"} data-color={"#F73326"} data-title={"Projets"} aria-label={"Retour aux projets"}>
        {"\n"}
        <span className={"project-back__icon"} aria-hidden={"true"} />
        {"\n"}
      </a>
      {"\n"}
      <section className={"project-meta"} data-reveal-group={"120"} data-depth={"0.5"}>
        {"\n"}
        <section className={"project-meta-left"}>
          {"\n"}
          <h1 className={"project-h1 js-project-name"} data-reveal={""}>
            {"Arte"}
          </h1>
          {"\n"}
          <ul className={"project-categories"} data-reveal={""}>
            {"\n"}
            <li className={"project-category-li"}>
              {"Direction artistique"}
            </li>
            <li className={"project-category-li"}>
              {"Campagne"}
            </li>
            <li className={"project-category-li"}>
              {"Conception-rédaction"}
            </li>
            <li className={"project-category-li"}>
              {"Graphisme"}
            </li>
            {"\n"}
          </ul>
          {"\n"}
        </section>
        {"\n"}
        <section className={"project-meta-right"} data-reveal={""}>
          {"\n"}
          <p className={"project-mission"}>
            {"J’ai écrit et fait la direction artistique d’affiches pour arte.tv, la plateforme gratuite d’Arte, lors d’un pitch gagné avec AustralieGAD."}
          </p>
          {"\n"}
        </section>
        {"\n"}
      </section>
      {"\n"}
      <div className={"project-claim"} data-depth={"1"}>
        {"\n"}
        <h2 className={"project-title js-project-slogan"} lang={"en"}>
          <span>
            {"arte.tv "}
          </span>
          <span>
            {"& chill"}
          </span>
        </h2>
        {"\n"}
      </div>
      {"\n"}
    </section>
  );
}
