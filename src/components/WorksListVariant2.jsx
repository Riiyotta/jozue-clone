// Props: homepageWorkHref, homepageWorkDataColor, homepageWorkDataTitle, homepageWorkDataSlogan, homepageWorkDataCategories, homepageWorkDataDate, homepageWorkDataHero, homepageWorkDataHeroRatio, homepageWorkLinkText, homepageWorkCategoryDataWorkCategory, homepageWorkCategoryText, homeWorkMediaDataSrc, homeWorkMediaAlt, homeWorkMediaDataTone, homepageWorkHref2, homepageWorkClassName, homepageWorkDataColor2, homepageWorkDataTitle2, homepageWorkDataSlogan2, homepageWorkDataCategories2, homepageWorkDataDate2, homepageWorkDataHero2, homepageWorkDataHeroRatio2, homepageWorkLinkText2, homepageWorkCategoryDataWorkCategory2, homepageWorkCategoryText2, homepageWorkCategoryDataWorkCategory3, homepageWorkCategoryText3, homepageWorkCategoryText4, homeWorkMediaDataSrc2, homeWorkMediaAlt2, homeWorkMediaDataTone2, homepageWorkHref3, homepageWorkClassName2, homepageWorkDataColor3, homepageWorkDataTitle3, homepageWorkDataSlogan3, homepageWorkDataCategories3, homepageWorkDataDate3, homepageWorkDataHero3, homepageWorkDataHeroRatio3, homepageWorkLinkText3, homepageWorkCategoryDataWorkCategory4, homepageWorkCategoryText5, homepageWorkCategoryText6, homepageWorkCategoryText7, homeWorkMediaDataSrc3, homeWorkMediaAlt3, homeWorkMediaDataTone3, gotProjectLinkHref, gotProjectLinkText
export default function WorksListVariant2(p) {
  return (
    <section className={"homepage__works"}>
      {"\n"}
      <section className={"homepage__works-list js-project-list"} data-loaded={"0"}>
        {"\n"}
        <a href={p.homepageWorkHref} className={"js-homepage-work homepage__work homepage__work--web"} data-color={p.homepageWorkDataColor} data-title={p.homepageWorkDataTitle} data-slogan={p.homepageWorkDataSlogan} data-categories={p.homepageWorkDataCategories} data-date={p.homepageWorkDataDate} data-home-index={"0"} data-hero={p.homepageWorkDataHero} data-hero-ratio={p.homepageWorkDataHeroRatio} data-hero-full={"1"} data-reveal={""} data-magnet={""}>
          {"\n"}
          <section className={"homepage__work-container"}>
            {"\n"}
            <p className={"homepage__work-link"}>
              {p.homepageWorkLinkText}
            </p>
            {"\n"}
          </section>
          {"\n"}
          <span className={"homepage__work-categories"}>
            {"\n"}
            <span className={"homepage__work-category"} data-work-category={"product-design"}>
              {"Product design"}
            </span>
            <span className={"homepage__work-category"} data-work-category={p.homepageWorkCategoryDataWorkCategory}>
              {p.homepageWorkCategoryText}
            </span>
            {"\n"}
          </span>
          {"\n"}
          <img className={"js-home-work-media homepage__work--media"} data-src={p.homeWorkMediaDataSrc} alt={p.homeWorkMediaAlt} data-tone={p.homeWorkMediaDataTone} />
          {"\n"}
        </a>
        <a href={p.homepageWorkHref2} className={p.homepageWorkClassName} data-color={p.homepageWorkDataColor2} data-title={p.homepageWorkDataTitle2} data-slogan={p.homepageWorkDataSlogan2} data-categories={p.homepageWorkDataCategories2} data-date={p.homepageWorkDataDate2} data-home-index={"1"} data-hero={p.homepageWorkDataHero2} data-hero-ratio={p.homepageWorkDataHeroRatio2} data-hero-full={"1"} data-reveal={""} data-magnet={""}>
          {"\n"}
          <section className={"homepage__work-container"}>
            {"\n"}
            <p className={"homepage__work-link"}>
              {p.homepageWorkLinkText2}
            </p>
            {"\n"}
          </section>
          {"\n"}
          <span className={"homepage__work-categories"}>
            {"\n"}
            <span className={"homepage__work-category"} data-work-category={p.homepageWorkCategoryDataWorkCategory2}>
              {p.homepageWorkCategoryText2}
            </span>
            <span className={"homepage__work-category"} data-work-category={p.homepageWorkCategoryDataWorkCategory3}>
              {p.homepageWorkCategoryText3}
            </span>
            <span className={"homepage__work-category"} data-work-category={"graphic-design"}>
              {p.homepageWorkCategoryText4}
            </span>
            {"\n"}
          </span>
          {"\n"}
          <img className={"js-home-work-media homepage__work--media"} data-src={p.homeWorkMediaDataSrc2} alt={p.homeWorkMediaAlt2} data-tone={p.homeWorkMediaDataTone2} />
          {"\n"}
        </a>
        <a href={p.homepageWorkHref3} className={p.homepageWorkClassName2} data-color={p.homepageWorkDataColor3} data-title={p.homepageWorkDataTitle3} data-slogan={p.homepageWorkDataSlogan3} data-categories={p.homepageWorkDataCategories3} data-date={p.homepageWorkDataDate3} data-home-index={"2"} data-hero={p.homepageWorkDataHero3} data-hero-ratio={p.homepageWorkDataHeroRatio3} data-hero-full={"1"} data-reveal={""} data-magnet={""}>
          {"\n"}
          <section className={"homepage__work-container"}>
            {"\n"}
            <p className={"homepage__work-link"}>
              {p.homepageWorkLinkText3}
            </p>
            {"\n"}
          </section>
          {"\n"}
          <span className={"homepage__work-categories"}>
            {"\n"}
            <span className={"homepage__work-category"} data-work-category={p.homepageWorkCategoryDataWorkCategory4}>
              {p.homepageWorkCategoryText5}
            </span>
            <span className={"homepage__work-category"} data-work-category={"art-direction"}>
              {p.homepageWorkCategoryText6}
            </span>
            <span className={"homepage__work-category"} data-work-category={"graphic-design"}>
              {p.homepageWorkCategoryText7}
            </span>
            {"\n"}
          </span>
          {"\n"}
          <img className={"js-home-work-media homepage__work--media"} data-src={p.homeWorkMediaDataSrc3} alt={p.homeWorkMediaAlt3} data-tone={p.homeWorkMediaDataTone3} />
          {"\n"}
        </a>
        {"\n"}
      </section>
      {"\n"}
      <section className={"got-project"}>
        {"\n"}
        <p className={"h4 uppercase bold"}>
          <a href={p.gotProjectLinkHref} className={"got-project__link"} data-color={"#111319"} data-title={"Contact"}>
            {p.gotProjectLinkText}
          </a>
        </p>
        {"\n"}
      </section>
      {"\n"}
    </section>
  );
}
