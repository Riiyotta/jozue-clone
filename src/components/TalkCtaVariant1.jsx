// Props: homepageTalkStyle, homepageTalkDataSignatureInk, homepageTalkTitleText, homepageTalkDescriptionText, availableWhereText, homepageTalkLinkHref, homepageTalkLinkText
export default function TalkCtaVariant1(p) {
  return (
    <section className={"homepage__talk"} style={p.homepageTalkStyle} data-nav-dark={""} data-parallax-scene={""} data-reveal-group={""} data-signature-ink={p.homepageTalkDataSignatureInk}>
      {"\n"}
      <div className={"logo-full-container"}>
        {"\n"}
        <div className={"logo-full-layer"} data-parallax={"soft"}>
          {"\n"}
          <img src={"/_astro/jozue-logo-project.B0nm3wc4.svg"} className={"logo-full-img logo-full-img--project logo-static"} alt={"jozue"} />
          {"\n"}
          <div className={"logo-full-img logo-full-img--project project-signature js-talk-signature"} aria-hidden={"true"} />
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
      <a href={p.homepageTalkLinkHref} className={"homepage__talk-link"} data-color={"#111319"} data-title={"Contact"} data-reveal={""} data-roll={"ink"}>
        {p.homepageTalkLinkText}
      </a>
      {"\n"}
    </section>
  );
}
