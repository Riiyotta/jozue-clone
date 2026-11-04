// Props: projectHeadStyle, projectHeadDataSignatureInk, projectH1Text, projectCategoryLiText, projectCategoryLiText2, projectMissionText, projectTitleText, projectTitleText2, projectTitleText3
export default function ProjectHeadVariant4(p) {
  return (
    <section className={"project-head"} style={p.projectHeadStyle} data-nav-dark={""} data-depth-scene={""} data-signature-ink={p.projectHeadDataSignatureInk}>
      {"\n"}
      <div className={"logo-full-container"} data-depth={"0.35"}>
        {"\n"}
        <img src={"/_astro/jozue-logo-project.B0nm3wc4.svg"} className={"logo-full-img logo-full-img--project logo-static"} alt={"jozue"} />
        {"\n"}
        <div id={"js-project-signature"} className={"logo-full-img logo-full-img--project project-signature"} aria-hidden={"true"} />
        {"\n"}
      </div>
      {"\n"}
      <a href={"/#works"} className={"project-back js-back"} data-color={"#F73326"} data-title={"Works"} aria-label={"Back to works"}>
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
            {p.projectH1Text}
          </h1>
          {"\n"}
          <ul className={"project-categories"} data-reveal={""}>
            {"\n"}
            <li className={"project-category-li"}>
              {p.projectCategoryLiText}
            </li>
            <li className={"project-category-li"}>
              {p.projectCategoryLiText2}
            </li>
            {"\n"}
          </ul>
          {"\n"}
        </section>
        {"\n"}
        <section className={"project-meta-right"} data-reveal={""}>
          {"\n"}
          <p className={"project-mission"}>
            {p.projectMissionText}
          </p>
          {"\n"}
        </section>
        {"\n"}
      </section>
      {"\n"}
      <div className={"project-claim"} data-depth={"1"}>
        {"\n"}
        <h2 className={"project-title js-project-slogan"}>
          <span>
            {p.projectTitleText}
          </span>
          <span>
            {p.projectTitleText2}
          </span>
          <span>
            {p.projectTitleText3}
          </span>
        </h2>
        {"\n"}
      </div>
      {"\n"}
    </section>
  );
}
