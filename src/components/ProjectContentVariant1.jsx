// Props: projectContentStyle, projectAppMediaSrc, projectAppMediaDataSrc, projectAppMediaDataSrcset, projectAppMediaSizes, projectAppMediaAlt, projectAppMediaStyle, projectAppMediaWidth, projectAppMediaHeight, projectAppMediaDataTone
export default function ProjectContentVariant1(p) {
  return (
    <section id={"js-project-container"} className={"project-content project-content--app project-content--app-full"} style={p.projectContentStyle}>
      {"\n"}
      <section className={"project-app"} id={"js-project-content"}>
        {"\n"}
        <div className={"project-app-frame"} data-reveal={"soft"} data-reveal-manual={""}>
          {"\n"}
          <div className={"project-app-head"}>
            {"\n"}
            <div className={"project-app-head-left"}>
              {"\n"}
              <div className={"project-app-head-bullet"} />
              {"\n"}
              <div className={"project-app-head-bullet"} />
              {"\n"}
              <div className={"project-app-head-bullet"} />
              {"\n"}
            </div>
            {"\n"}
            <div className={"project-app-head-right"}>
              {"\n"}
              <div className={"project-app-head-close"} />
              {"\n"}
            </div>
            {"\n"}
          </div>
          {"\n"}
          <div className={"project-app-content"}>
            {"\n"}
            <img id={"js-project-app-media"} className={"project-app-media"} src={p.projectAppMediaSrc} data-src={p.projectAppMediaDataSrc} data-srcset={p.projectAppMediaDataSrcset} sizes={p.projectAppMediaSizes} alt={p.projectAppMediaAlt} style={p.projectAppMediaStyle} width={p.projectAppMediaWidth} height={p.projectAppMediaHeight} data-tone={p.projectAppMediaDataTone} />
            {"\n"}
          </div>
          {"\n"}
        </div>
        {"\n"}
      </section>
      {"\n"}
    </section>
  );
}
