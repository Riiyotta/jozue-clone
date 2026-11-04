// Props: projectSmallTitleStyle, h4Text
export default function ProjectSmallTitle(p) {
  return (
    <section className={"project-small-title js-credit-title"} data-collapse={"(max-width: 766px)"} aria-controls={"project-credit"} style={p.projectSmallTitleStyle}>
      {"\n"}
      <h2 className={"h4 bold"}>
        {p.h4Text}
      </h2>
      {"\n"}
    </section>
  );
}
