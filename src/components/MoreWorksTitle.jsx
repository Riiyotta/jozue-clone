// Props: projectMoreWorksStyle, h4Text
export default function MoreWorksTitle(p) {
  return (
    <section className={"project-more-works"} data-nav-dark={""} style={p.projectMoreWorksStyle}>
      {"\n"}
      <h2 className={"h4 bold white"}>
        {p.h4Text}
      </h2>
      {"\n"}
    </section>
  );
}
