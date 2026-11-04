// Props: projectHeroContainerStyle, projectHeroImageSrc, projectHeroImageAlt, projectHeroImageDataTone, projectHeroImageSrc2, projectHeroImageDataTone2
export default function ProjectHeroVariant1(p) {
  return (
    <section id={"js-project-previous"} className={"project-hero-container project-hero-container--full"} style={p.projectHeroContainerStyle} data-parallax-scene={""}>
      {"\n"}
      <img className={"project-hero-image project-hero-image--drawn js-hero-image js-hero-drawn"} src={p.projectHeroImageSrc} alt={p.projectHeroImageAlt} data-tone={p.projectHeroImageDataTone} data-parallax={"hero"} data-parallax-origin={"top"} data-parallax-max={"0.05"} />
      {"\n"}
      <img className={"project-hero-image js-hero-background"} src={p.projectHeroImageSrc2} alt={""} data-tone={p.projectHeroImageDataTone2} fetchpriority={"low"} data-parallax={"hero"} data-parallax-origin={"top"} data-parallax-max={"0.05"} />
      {"\n"}
    </section>
  );
}
