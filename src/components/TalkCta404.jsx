export default function TalkCta404() {
  return (
    <section className={"homepage__talk homepage__talk--404"} style={{"backgroundColor":"#111319"}}>
      {"\n"}
      <div className={"logo-full-container"}>
        {"\n"}
        <img src={"/_astro/jozue-logo-project.B0nm3wc4.svg"} className={"logo-full-img logo-full-img--project"} alt={"jozue"} />
        {"\n"}
      </div>
      {"\n"}
      <h1 className={"homepage__talk-title"}>
        {"not found"}
      </h1>
      {"\n"}
      <p className={"homepage__talk-description"}>
        {"This page doesn't exist (anymore)."}
      </p>
      {"\n"}
      <a href={"/"} className={"homepage__talk-link"} data-color={"#111319"} data-title={"Home"} data-roll={"ink"}>
        {"Back home"}
      </a>
      {"\n"}
    </section>
  );
}
