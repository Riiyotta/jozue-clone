// Props: projectCreditGridStyle, projectCreditTitleText, projectCreditContentText, projectCreditTitleText2
export default function ProjectCreditFnacDarty(p) {
  return (
    <section id={"project-credit"} className={"project-credit"} style={{"backgroundColor":"#2e2a2a"}} data-nav-dark={""}>
      {"\n"}
      <section className={"project-credit-grid"} style={p.projectCreditGridStyle}>
        {"\n"}
        <section className={"project-credit-bloc project-credit-role"}>
          {"\n"}
          <p className={"project-credit-title"}>
            {p.projectCreditTitleText}
          </p>
          {"\n"}
          <p className={"project-credit-content"}>
            {p.projectCreditContentText}
            <br />
            {"UI designer"}
            <br />
            {"\n"}
          </p>
          {"\n"}
        </section>
        <section className={"project-credit-bloc project-credit-team"}>
          {"\n"}
          <p className={"project-credit-title"}>
            {p.projectCreditTitleText2}
          </p>
          {"\n"}
          <p className={"project-credit-content"}>
            {"\nÉloïse Gaboriau    "}
            <strong>
              {"UX designer"}
            </strong>
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
