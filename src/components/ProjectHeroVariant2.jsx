// Props: lazyframeStyle, lazyframeDataThumbnail, lazyframeDataTone, lazyframeVideoSrc, lazyframeVideoPoster, lazyframeVideoAriaLabel, lazyframePlayAriaLabel
export default function ProjectHeroVariant2(p) {
  return (
    <section className={"project-hero-container"}>
      {"\n"}
      <div style={p.lazyframeStyle} className={"lazyframe carousel-item-video lazyframe--hosted js-reel carousel-item-video--large"} data-vendor={"youtube"} data-thumbnail={p.lazyframeDataThumbnail} data-ratio={"16:9"} data-title={" "} data-tone={p.lazyframeDataTone}>
        <video className={"lazyframe__video"} src={p.lazyframeVideoSrc} poster={p.lazyframeVideoPoster} preload={"none"} playsInline={true} aria-label={p.lazyframeVideoAriaLabel} />
        <button type={"button"} className={"lazyframe__play js-reel-play"} aria-label={p.lazyframePlayAriaLabel} />
      </div>
      {"\n"}
    </section>
  );
}
