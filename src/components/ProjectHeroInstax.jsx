// Props: lazyframePlayAriaLabel
export default function ProjectHeroInstax(p) {
  return (
    <section className={"project-hero-container"}>
      {"\n"}
      <div style={{"backgroundImage":"url('/_astro/Capture-decran-2023-10-25-a-21.52-1.BMKusc7o_ZSmaox.webp')"}} className={"lazyframe carousel-item-video carousel-item-video--large"} data-src={"https://www.youtube.com/embed/DvmTe7lPhSs"} data-vendor={"youtube"} data-thumbnail={"/_astro/Capture-decran-2023-10-25-a-21.52-1.BMKusc7o_ZSmaox.webp"} data-ratio={"16:9"} data-title={" "} data-tone={"1.8893:24:421344312222234213333323420466412222065257320333421455312223232456423554111455311113355550535634111343213433354652324445111111104545555646735245111111114443455544536401111111134432045542557413111111143321024564234443001110232222056365001200000010232214433235433220000010442217601223553430000010353345064323353123"}>
        <button type={"button"} className={"lazyframe__play"} aria-label={p.lazyframePlayAriaLabel} />
      </div>
      {"\n"}
    </section>
  );
}
