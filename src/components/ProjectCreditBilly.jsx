// Props: projectCreditTitleText
export default function ProjectCreditBilly(p) {
  return (
    <section id={"project-credit"} className={"project-credit"} style={{"backgroundColor":"#655bd5"}} data-nav-dark={""}>
      {"\n"}
      <section className={"project-credit-grid"} style={{"--credit-cols":"auto"}}>
        {"\n"}
        <section className={"project-credit-bloc project-credit-role"}>
          {"\n"}
          <p className={"project-credit-title"}>
            {p.projectCreditTitleText}
          </p>
          {"\n"}
          <p className={"project-credit-content"}>
            {"\nLead product designer"}
            <br />
            {"UX/UI"}
            <br />
            {"Design system"}
            <br />
            {"\n"}
          </p>
          {"\n"}
        </section>
        {"\n"}
      </section>
      {"\n"}
    </section>
  );
}
