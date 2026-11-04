// Props: projectCreditTitleText, projectCreditTitleText2, projectCreditContentText
export default function ProjectCreditVianney(p) {
  return (
    <section id={"project-credit"} className={"project-credit"} style={{"backgroundColor":"#2c3138"}} data-nav-dark={""}>
      {"\n"}
      <section className={"project-credit-grid"} style={{"--credit-cols":"minmax(13rem, min-content) 13rem auto"}}>
        {"\n"}
        <section className={"project-credit-bloc project-credit-agency"}>
          {"\n"}
          <p className={"project-credit-title"}>
            {p.projectCreditTitleText}
          </p>
          {"\n"}
          <p className={"project-credit-content"}>
            {"\nBilly"}
            <br />
            {"\n"}
          </p>
          {"\n"}
        </section>
        <section className={"project-credit-bloc project-credit-production"}>
          {"\n"}
          <p className={"project-credit-title"}>
            {"Production"}
          </p>
          {"\n"}
          <p className={"project-credit-content"}>
            {"\nZouave"}
            <br />
            {"\n"}
          </p>
          {"\n"}
        </section>
        <section className={"project-credit-bloc project-credit-role"}>
          {"\n"}
          <p className={"project-credit-title"}>
            {p.projectCreditTitleText2}
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
        {"\n"}
      </section>
      {"\n"}
    </section>
  );
}
