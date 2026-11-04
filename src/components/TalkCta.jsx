// Props: homepageTalkTitleText, homepageTalkDescriptionText, availableWhereText, homepageTalkLinkText
export default function TalkCta(p) {
  return (
    <section data-nav-dark={""} className={"homepage__talk"} data-parallax-scene={""} data-reveal-group={""}>
      {"\n"}
      <div className={"logo-full-container"}>
        {"\n"}
        <div className={"logo-full-layer"} data-parallax={"soft"}>
          {"\n"}
          <img src={"/_astro/jozue-logo-full.DpMZCk-F.svg"} className={"logo-full-img logo-static"} alt={"jozue"} />
          {"\n"}
          <div className={"logo-full-img talk-signature js-talk-signature"} aria-hidden={"true"} />
          {"\n"}
        </div>
        {"\n"}
      </div>
      {"\n"}
      <h2 className={"homepage__talk-title"} data-reveal={""}>
        {p.homepageTalkTitleText}
      </h2>
      {"\n"}
      <p className={"homepage__talk-description"} data-reveal={""}>
        {p.homepageTalkDescriptionText}
        <span className={"available-where"}>
          {p.availableWhereText}
        </span>
      </p>
      {"\n"}
      <a href={"#contact"} className={"homepage__talk-link js-to-scroll"} data-anchor={"#contact"} data-reveal={""} data-roll={"ink"}>
        {p.homepageTalkLinkText}
      </a>
      {"\n"}
    </section>
  );
}
