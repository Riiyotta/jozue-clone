// Props: homepageAwardTitleText, homepageAwardContextText, homepageWorkCategoryText, homepageWorkCategoryText2, homepageAwardsAwardText, homepageAwardContextText2, homepageWorkCategoryText3, homepageWorkCategoryText4, homepageAwardContextText3, homepageAwardClientText, homepageWorkCategoryText5, homepageWorkCategoryText6, homepageAwardContextText4, homepageWorkCategoryText7, homepageWorkCategoryText8, homepageAwardContextText5, homepageWorkCategoryText9, homepageWorkCategoryText10, homepageAwardContextText6, homepageWorkCategoryText11, homepageWorkCategoryText12, homepageAwardContextText7, homepageWorkCategoryText13, homepageWorkCategoryText14, homepageAwardContextText8, homepageWorkCategoryText15, homepageWorkCategoryText16, homepageAwardContextText9, homepageWorkCategoryText17, homepageWorkCategoryText18, homepageAwardContextText10, homepageWorkCategoryText19, homepageWorkCategoryText20, buttonSlideAriaLabel, buttonSlideAriaLabel2
export default function Awards(p) {
  return (
    <section className={"homepage__awards"} data-reveal-group={""}>
      {"\n"}
      <h2 className={"homepage__award-title h4 bold uppercase"} data-reveal={"fade"}>
        {p.homepageAwardTitleText}
      </h2>
      {"\n"}
      <section className={"js-scroll-container-awards scroll-container"}>
        {"\n"}
        <section className={"js-slider-awards homepage__awards-list-scroll"} data-init={"1"} data-destroy={"0"}>
          {"\n"}
          <section className={"js-slider-item homepage__award"} data-reveal={"fade"}>
            {"\n"}
            <span className={"homepage__award-context"}>
              {p.homepageAwardContextText}
            </span>
            {"\n"}
            <a target={"_blank"} rel={"noopener"} href={"https://www.11moissanstoit.com"} className={"homepage__award-client"}>
              {"11 mois sans toi(t)"}
            </a>
            {"\n"}
            <section className={"homepage__awards-categories"}>
              {"\n"}
              <span className={"homepage__work-category"}>
                {p.homepageWorkCategoryText}
              </span>
              <span className={"homepage__work-category"}>
                {p.homepageWorkCategoryText2}
              </span>
              {"\n"}
            </section>
            {"\n"}
            <ul className={"homepage__awards-list"}>
              {"\n"}
              <li className={"homepage__awards-award"}>
                {"1 Special Kudos award CSSDA"}
              </li>
              <li className={"homepage__awards-award"}>
                {p.homepageAwardsAwardText}
              </li>
              {"\n"}
            </ul>
            {"\n"}
          </section>
          <section className={"js-slider-item homepage__award"} data-reveal={"fade"}>
            {"\n"}
            <span className={"homepage__award-context"}>
              {p.homepageAwardContextText2}
            </span>
            {"\n"}
            <a target={"_blank"} rel={"noopener"} href={"https://thefwa.com/cases/rogue-one-a-star-wars-story-p2"} className={"homepage__award-client"}>
              {"Star Wars Rogue One"}
            </a>
            {"\n"}
            <section className={"homepage__awards-categories"}>
              {"\n"}
              <span className={"homepage__work-category"}>
                {p.homepageWorkCategoryText3}
              </span>
              <span className={"homepage__work-category"}>
                {p.homepageWorkCategoryText4}
              </span>
              {"\n"}
            </section>
            {"\n"}
            <ul className={"homepage__awards-list"}>
              {"\n"}
              <li className={"homepage__awards-award"}>
                {"2 Webby Awards"}
              </li>
              <li className={"homepage__awards-award"}>
                {"1 TheFWA"}
              </li>
              <li className={"homepage__awards-award"}>
                {"1 Awwwards"}
              </li>
              {"\n"}
            </ul>
            {"\n"}
          </section>
          <section className={"js-slider-item homepage__award"} data-reveal={"fade"}>
            {"\n"}
            <span className={"homepage__award-context"}>
              {p.homepageAwardContextText3}
            </span>
            {"\n"}
            <a target={"_blank"} rel={"noopener"} href={"https://fcinq.com"} className={"homepage__award-client"}>
              {p.homepageAwardClientText}
            </a>
            {"\n"}
            <section className={"homepage__awards-categories"}>
              {"\n"}
              <span className={"homepage__work-category"}>
                {p.homepageWorkCategoryText5}
              </span>
              <span className={"homepage__work-category"}>
                {p.homepageWorkCategoryText6}
              </span>
              {"\n"}
            </section>
            {"\n"}
            <ul className={"homepage__awards-list"}>
              {"\n"}
              <li className={"homepage__awards-award"}>
                {"1 Awwwards"}
              </li>
              <li className={"homepage__awards-award"}>
                {"1 TheFWA"}
              </li>
              {"\n"}
            </ul>
            {"\n"}
          </section>
          <section className={"js-slider-item homepage__award"} data-reveal={"fade"}>
            {"\n"}
            <span className={"homepage__award-context"}>
              {p.homepageAwardContextText4}
            </span>
            {"\n"}
            <a target={"_blank"} rel={"noopener"} href={"https://thefwa.com/cases/nothing-compares-to-havana"} className={"homepage__award-client"}>
              {"Nothing compares to Havana"}
            </a>
            {"\n"}
            <section className={"homepage__awards-categories"}>
              {"\n"}
              <span className={"homepage__work-category"}>
                {p.homepageWorkCategoryText7}
              </span>
              <span className={"homepage__work-category"}>
                {p.homepageWorkCategoryText8}
              </span>
              {"\n"}
            </section>
            {"\n"}
            <ul className={"homepage__awards-list"}>
              {"\n"}
              <li className={"homepage__awards-award"}>
                {"1 TheFWA"}
              </li>
              {"\n"}
            </ul>
            {"\n"}
          </section>
          <section className={"js-slider-item homepage__award"} data-reveal={"fade"}>
            {"\n"}
            <span className={"homepage__award-context"}>
              {p.homepageAwardContextText5}
            </span>
            {"\n"}
            <a target={"_blank"} rel={"noopener"} href={"https://www.awwwards.com/sites/nicolas-errera"} className={"homepage__award-client"}>
              {"Nicolas Errera"}
            </a>
            {"\n"}
            <section className={"homepage__awards-categories"}>
              {"\n"}
              <span className={"homepage__work-category"}>
                {p.homepageWorkCategoryText9}
              </span>
              <span className={"homepage__work-category"}>
                {p.homepageWorkCategoryText10}
              </span>
              {"\n"}
            </section>
            {"\n"}
            <ul className={"homepage__awards-list"}>
              {"\n"}
              <li className={"homepage__awards-award"}>
                {"1 Awwwards"}
              </li>
              {"\n"}
            </ul>
            {"\n"}
          </section>
          <section className={"js-slider-item homepage__award"} data-reveal={"fade"}>
            {"\n"}
            <span className={"homepage__award-context"}>
              {p.homepageAwardContextText6}
            </span>
            {"\n"}
            <a target={"_blank"} rel={"noopener"} href={"https://thefwa.com/cases/havana-mojito"} className={"homepage__award-client"}>
              {"Havana Mojito"}
            </a>
            {"\n"}
            <section className={"homepage__awards-categories"}>
              {"\n"}
              <span className={"homepage__work-category"}>
                {p.homepageWorkCategoryText11}
              </span>
              <span className={"homepage__work-category"}>
                {p.homepageWorkCategoryText12}
              </span>
              {"\n"}
            </section>
            {"\n"}
            <ul className={"homepage__awards-list"}>
              {"\n"}
              <li className={"homepage__awards-award"}>
                {"1 TheFWA"}
              </li>
              {"\n"}
            </ul>
            {"\n"}
          </section>
          <section className={"js-slider-item homepage__award"} data-reveal={"fade"}>
            {"\n"}
            <span className={"homepage__award-context"}>
              {p.homepageAwardContextText7}
            </span>
            {"\n"}
            <a target={"_blank"} rel={"noopener"} href={"https://www.awwwards.com/sites/recits-d-egypte"} className={"homepage__award-client"}>
              {"Récits d’Égypte"}
            </a>
            {"\n"}
            <section className={"homepage__awards-categories"}>
              {"\n"}
              <span className={"homepage__work-category"}>
                {p.homepageWorkCategoryText13}
              </span>
              <span className={"homepage__work-category"}>
                {p.homepageWorkCategoryText14}
              </span>
              {"\n"}
            </section>
            {"\n"}
            <ul className={"homepage__awards-list"}>
              {"\n"}
              <li className={"homepage__awards-award"}>
                {"1 Awwwards"}
              </li>
              <li className={"homepage__awards-award"}>
                {"1 TheFWA"}
              </li>
              {"\n"}
            </ul>
            {"\n"}
          </section>
          <section className={"js-slider-item homepage__award"} data-reveal={"fade"}>
            {"\n"}
            <span className={"homepage__award-context"}>
              {p.homepageAwardContextText8}
            </span>
            {"\n"}
            <a target={"_blank"} rel={"noopener"} href={"https://thefwa.com/cases/recyclons-nos-papiers"} className={"homepage__award-client"}>
              {"Recyclons nos papiers"}
            </a>
            {"\n"}
            <section className={"homepage__awards-categories"}>
              {"\n"}
              <span className={"homepage__work-category"}>
                {p.homepageWorkCategoryText15}
              </span>
              <span className={"homepage__work-category"}>
                {p.homepageWorkCategoryText16}
              </span>
              {"\n"}
            </section>
            {"\n"}
            <ul className={"homepage__awards-list"}>
              {"\n"}
              <li className={"homepage__awards-award"}>
                {"1 TheFWA"}
              </li>
              {"\n"}
            </ul>
            {"\n"}
          </section>
          <section className={"js-slider-item homepage__award"} data-reveal={"fade"}>
            {"\n"}
            <span className={"homepage__award-context"}>
              {p.homepageAwardContextText9}
            </span>
            {"\n"}
            <a target={"_blank"} rel={"noopener"} href={"https://www.awwwards.com/sites/tandems"} className={"homepage__award-client"}>
              {"Arte, Tandems"}
            </a>
            {"\n"}
            <section className={"homepage__awards-categories"}>
              {"\n"}
              <span className={"homepage__work-category"}>
                {p.homepageWorkCategoryText17}
              </span>
              <span className={"homepage__work-category"}>
                {p.homepageWorkCategoryText18}
              </span>
              {"\n"}
            </section>
            {"\n"}
            <ul className={"homepage__awards-list"}>
              {"\n"}
              <li className={"homepage__awards-award"}>
                {"1 TheFWA"}
              </li>
              <li className={"homepage__awards-award"}>
                {"1 Awwwards"}
              </li>
              {"\n"}
            </ul>
            {"\n"}
          </section>
          <section className={"js-slider-item homepage__award"} data-reveal={"fade"}>
            {"\n"}
            <span className={"homepage__award-context"}>
              {p.homepageAwardContextText10}
            </span>
            {"\n"}
            <a target={"_blank"} rel={"noopener"} href={"https://www.awwwards.com/sites/cinq7-music-label"} className={"homepage__award-client"}>
              {"Cinq7"}
            </a>
            {"\n"}
            <section className={"homepage__awards-categories"}>
              {"\n"}
              <span className={"homepage__work-category"}>
                {p.homepageWorkCategoryText19}
              </span>
              <span className={"homepage__work-category"}>
                {p.homepageWorkCategoryText20}
              </span>
              {"\n"}
            </section>
            {"\n"}
            <ul className={"homepage__awards-list"}>
              {"\n"}
              <li className={"homepage__awards-award"}>
                {"1 Awwwards"}
              </li>
              {"\n"}
            </ul>
            {"\n"}
          </section>
          {"\n"}
        </section>
        {"\n"}
        <section className={"js-scroll-nav scroll-nav scroll-nav--awards"} />
        {"\n"}
        <button className={"button-slide button-slide--hide button-slide--previous-clean js-slider-button-left"} type={"button"} aria-label={p.buttonSlideAriaLabel}>
          {"\n"}
          <svg xmlns={"http://www.w3.org/2000/svg"} width={"9"} height={"15"} fill={"none"} aria-hidden={"true"} focusable={"false"}>
            <path stroke={"#111319"} d={"m1 14 6.5-6.5L1 1"} />
          </svg>
          {"\n"}
        </button>
        {"\n"}
        <button className={"button-slide button-slide--next-clean js-slider-button-right"} type={"button"} aria-label={p.buttonSlideAriaLabel2}>
          {"\n"}
          <svg xmlns={"http://www.w3.org/2000/svg"} width={"9"} height={"15"} fill={"none"} aria-hidden={"true"} focusable={"false"}>
            <path stroke={"#111319"} d={"m1 14 6.5-6.5L1 1"} />
          </svg>
          {"\n"}
        </button>
        {"\n"}
      </section>
      {"\n"}
    </section>
  );
}
