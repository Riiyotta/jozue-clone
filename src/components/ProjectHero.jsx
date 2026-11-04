// Props: projectHeroContainerClassName, projectHeroContainerStyle, projectHeroImageSrc, projectHeroImageAlt, projectHeroImageDataTone
export default function ProjectHero(p) {
  return (
    <section className={p.projectHeroContainerClassName} style={p.projectHeroContainerStyle} data-parallax-scene={""}>
      {"\n"}
      <img className={"project-hero-image"} src={p.projectHeroImageSrc} alt={p.projectHeroImageAlt} data-tone={p.projectHeroImageDataTone} data-parallax={"hero"} data-parallax-origin={"top"} data-parallax-max={"0.05"} />
      {"\n"}
    </section>
  );
}
