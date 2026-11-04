// Props: homepageWorkHref, homepageWorkDataColor, homepageWorkDataTitle, homepageWorkDataSlogan, homepageWorkDataHero, homepageWorkDataHeroRatio, homepageWorkLinkText, homepageWorkCategoryText, homepageWorkCategoryText2, homepageWorkCategoryText3, homeWorkMediaDataSrc, homeWorkMediaAlt, homeWorkMediaDataTone, homepageWorkHref2, homepageWorkCategoryText4, homepageWorkCategoryText5, homepageWorkCategoryText6, homepageWorkCategoryText7, homepageWorkHref3, homepageWorkCategoryText8, homepageWorkCategoryText9, homepageWorkCategoryText10, homepageWorkCategoryText11, gotProjectLinkHref, gotProjectLinkText
export default function WorksListVariant3(p) {
  return (
    <section className={"homepage__works"}>
      {"\n"}
      <section className={"homepage__works-list js-project-list"} data-loaded={"0"}>
        {"\n"}
        <a href={p.homepageWorkHref} className={"js-homepage-work homepage__work homepage__work--web"} data-color={p.homepageWorkDataColor} data-title={p.homepageWorkDataTitle} data-slogan={p.homepageWorkDataSlogan} data-categories={"websites,art-direction,graphic-design"} data-date={"2024-11-27"} data-home-index={"0"} data-hero={p.homepageWorkDataHero} data-hero-ratio={p.homepageWorkDataHeroRatio} data-hero-full={"1"} data-reveal={""} data-magnet={""}>
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
            <span className={"homepage__work-category"} data-work-category={"websites"}>
              {p.homepageWorkCategoryText}
            </span>
            <span className={"homepage__work-category"} data-work-category={"art-direction"}>
              {p.homepageWorkCategoryText2}
            </span>
            <span className={"homepage__work-category"} data-work-category={"graphic-design"}>
              {p.homepageWorkCategoryText3}
            </span>
            {"\n"}
          </span>
          {"\n"}
          <img className={"js-home-work-media homepage__work--media"} data-src={p.homeWorkMediaDataSrc} alt={p.homeWorkMediaAlt} data-tone={p.homeWorkMediaDataTone} />
          {"\n"}
        </a>
        <a href={p.homepageWorkHref2} className={"js-homepage-work homepage__work"} data-color={"#2e3ca8"} data-title={"Graille sur le rail"} data-slogan={"[\"île\",\"-de-\",\"food\"]"} data-categories={"filmmaking,art-direction,photography,graphic-design"} data-date={"2025-11-08"} data-home-index={"1"} data-hero={"/_astro/graille-sur-le-rail-hero-1.CcNlupbV_2p5tnX.webp"} data-hero-ratio={"1.7778"} data-hero-full={"1"} data-reveal={""} data-magnet={""}>
          {"\n"}
          <section className={"homepage__work-container"}>
            {"\n"}
            <p className={"homepage__work-link"}>
              {"Graille sur le rail"}
            </p>
            {"\n"}
          </section>
          {"\n"}
          <span className={"homepage__work-categories"}>
            {"\n"}
            <span className={"homepage__work-category"} data-work-category={"filmmaking"}>
              {p.homepageWorkCategoryText4}
            </span>
            <span className={"homepage__work-category"} data-work-category={"art-direction"}>
              {p.homepageWorkCategoryText5}
            </span>
            <span className={"homepage__work-category"} data-work-category={"photography"}>
              {p.homepageWorkCategoryText6}
            </span>
            <span className={"homepage__work-category"} data-work-category={"graphic-design"}>
              {p.homepageWorkCategoryText7}
            </span>
            {"\n"}
          </span>
          {"\n"}
          <img className={"js-home-work-media homepage__work--media"} data-src={"/_astro/graille-sur-le-rail-hero-1.CcNlupbV_CmXo9.webp"} alt={"Graille sur le rail"} data-tone={"1.7778:24:122222222233333444443333222222223333344444334433222222333334444431113444222223333344444402411444222233333444444444433354222333334444455556455445233333344455556667645335233333344456655666445224333333444455665663355335333333444555656664454566333333444555535666743666333333444555545667754676333333444555676677654676"} />
          {"\n"}
        </a>
        <a href={p.homepageWorkHref3} className={"js-homepage-work homepage__work"} data-color={"#241f1a"} data-title={"Arte"} data-slogan={"[\"arte.tv\",\"& chill\"]"} data-categories={"art-direction,campaign,copywriting,graphic-design"} data-date={"2022-08-16"} data-home-index={"2"} data-hero={"/_astro/arte-hero-1.DiJqoqfB_1YzdRy.webp"} data-hero-ratio={"1.7777"} data-hero-full={"1"} data-reveal={""} data-magnet={""}>
          {"\n"}
          <section className={"homepage__work-container"}>
            {"\n"}
            <p className={"homepage__work-link"}>
              {"Arte"}
            </p>
            {"\n"}
          </section>
          {"\n"}
          <span className={"homepage__work-categories"}>
            {"\n"}
            <span className={"homepage__work-category"} data-work-category={"art-direction"}>
              {p.homepageWorkCategoryText8}
            </span>
            <span className={"homepage__work-category"} data-work-category={"campaign"}>
              {p.homepageWorkCategoryText9}
            </span>
            <span className={"homepage__work-category"} data-work-category={"copywriting"}>
              {p.homepageWorkCategoryText10}
            </span>
            <span className={"homepage__work-category"} data-work-category={"graphic-design"}>
              {p.homepageWorkCategoryText11}
            </span>
            {"\n"}
          </span>
          {"\n"}
          <img className={"js-home-work-media homepage__work--media"} data-src={"/_astro/arte-hero-1.DiJqoqfB_2oyUDL.webp"} alt={"Arte"} data-tone={"1.7777:24:258877777775666777777777257887777653444677777777256678765454544556777875245656654556874555676532345665445556654555556642444456666543455555556652245556656533543454356544356556547524544553455655556456678535555664565655556547888545566666655655455556888545566665655555555555666655554555555545555555555555554355554444666666666666665556666665"} />
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
