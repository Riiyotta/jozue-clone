// Props: homepageWhatTitleText, homepageWhatHeadTitleText, homepageWhatListText, homepageWhatListText2, homepageWhatListText3, homepageWhatListText4, homepageWhatListText5, homepageWhatListText6, homepageWhatListText7, homepageWhatListText8, homepageWhatListText9, homepageWhatListText10, homepageWhatListText11, homepageWhatListText12, homepageWhatListText13, homepageWhatListText14, homepageWhatListText15, homepageWhatListText16, homepageWhatTextText, homepageWhatTextText2, homepageWhatTextText3, homepageWhatTextText4, homepageWhatTextText5, homepageWhatTextText6, homepageWhatTextText7, homepageWhatTextText8, homepageWhatTextText9, homepageWhatTextText10, homepageWhatTextText11, homepageWhatTextText12, homepageWhatAvailableText, availableWhereText, homepageTalkLinkText
export default function About(p) {
  return (
    <section id={"about"} className={"homepage__what js-what"} data-nav-dark={""} data-parallax-scene={""}>
      {"\n"}
      <section className={"wrapper wrapper--what"} data-reveal-group={""}>
        {"\n"}
        <h2 className={"homepage__what-title h4 bold white uppercase"} data-reveal={""}>
          {p.homepageWhatTitleText}
        </h2>
        {"\n"}
        <section className={"homepage__what-container"}>
          {"\n"}
          <p className={"homepage__what-head-title"} data-reveal={""}>
            {p.homepageWhatHeadTitleText}
          </p>
          {"\n"}
          <div className={"homepage__what-marquee"} data-reveal={""}>
            {"\n"}
            <ul className={"homepage__what-ul js-marquee"}>
              {"\n"}
              <li className={"homepage__what-list"}>
                {p.homepageWhatListText}
              </li>
              <li className={"homepage__what-list"}>
                {p.homepageWhatListText2}
              </li>
              <li className={"homepage__what-list"}>
                {p.homepageWhatListText3}
              </li>
              <li className={"homepage__what-list"}>
                {p.homepageWhatListText4}
              </li>
              <li className={"homepage__what-list"}>
                {p.homepageWhatListText5}
              </li>
              <li className={"homepage__what-list"}>
                {p.homepageWhatListText6}
              </li>
              <li className={"homepage__what-list"}>
                {p.homepageWhatListText7}
              </li>
              <li className={"homepage__what-list"}>
                {p.homepageWhatListText8}
              </li>
              <li className={"homepage__what-list homepage__what-list--copy"} aria-hidden={"true"}>
                {p.homepageWhatListText9}
              </li>
              <li className={"homepage__what-list homepage__what-list--copy"} aria-hidden={"true"}>
                {p.homepageWhatListText10}
              </li>
              <li className={"homepage__what-list homepage__what-list--copy"} aria-hidden={"true"}>
                {p.homepageWhatListText11}
              </li>
              <li className={"homepage__what-list homepage__what-list--copy"} aria-hidden={"true"}>
                {p.homepageWhatListText12}
              </li>
              <li className={"homepage__what-list homepage__what-list--copy"} aria-hidden={"true"}>
                {p.homepageWhatListText13}
              </li>
              <li className={"homepage__what-list homepage__what-list--copy"} aria-hidden={"true"}>
                {p.homepageWhatListText14}
              </li>
              <li className={"homepage__what-list homepage__what-list--copy"} aria-hidden={"true"}>
                {p.homepageWhatListText15}
              </li>
              <li className={"homepage__what-list homepage__what-list--copy"} aria-hidden={"true"}>
                {p.homepageWhatListText16}
              </li>
              {"\n"}
            </ul>
            {"\n"}
          </div>
          {"\n"}
          <section className={"homepage__what-text"} data-reveal={""}>
            {"\n"}
            <p>
              {p.homepageWhatTextText}
              <br />
              {p.homepageWhatTextText2}
              <br />
              {p.homepageWhatTextText3}
              <br />
              {p.homepageWhatTextText4}
              <br />
              {p.homepageWhatTextText5}
            </p>
            {"\n"}
            <p>
              {p.homepageWhatTextText6}
              <br />
              {p.homepageWhatTextText7}
            </p>
            {"\n"}
            <p>
              {p.homepageWhatTextText8}
              <br />
              {p.homepageWhatTextText9}
            </p>
            {"\n"}
            <p>
              {p.homepageWhatTextText10}
              <br />
              {p.homepageWhatTextText11}
              <a href={"https://www.instagram.com/__jozue__/"} target={"_blank"} rel={"noopener"} data-underline={""}>
                {p.homepageWhatTextText12}
              </a>
              {".)"}
            </p>
            {"\n"}
          </section>
          {"\n"}
        </section>
        {"\n"}
        <p className={"homepage__what-available"} data-reveal={""}>
          {p.homepageWhatAvailableText}
          <span className={"available-where"}>
            {p.availableWhereText}
          </span>
        </p>
        {"\n"}
        <a href={"#contact"} className={"homepage__talk-link homepage__talk-link--what js-to-scroll"} data-anchor={"#contact"} data-reveal={""} data-roll={"ink"}>
          {p.homepageTalkLinkText}
        </a>
        {"\n"}
        <div className={"logo-small-container"}>
          {"\n"}
          <img src={"/_astro/jozue-logo-small.DJpN4TMc.svg"} className={"logo-small-img logo-static"} alt={"jozue"} />
          {"\n"}
          <div id={"js-about-j"} className={"logo-small-img about-j"} aria-hidden={"true"} />
          {"\n"}
        </div>
        {"\n"}
      </section>
      {"\n"}
    </section>
  );
}
