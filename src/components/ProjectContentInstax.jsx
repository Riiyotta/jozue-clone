// Props: projectMissionBisText, lazyframePlayAriaLabel, carouselItemTitleText, lazyframePlayAriaLabel2, carouselItemTitleText2, lazyframePlayAriaLabel3, carouselItemTitleText3, buttonSlideAriaLabel, buttonSlideAriaLabel2, h4Text, projectStillsMediaAlt, projectStillsMediaAlt2, projectStillsMediaAlt3, h4Text2, projectCreditGridStyle, projectCreditTitleText, projectCreditTitleText2, projectCreditContentText, projectCreditTitleText3, projectCreditContentText2, projectCreditContentText3, projectCreditContentText4, projectCreditContentText5
export default function ProjectContentInstax(p) {
  return (
    <section className={"js-content project-content"}>
      {"\n"}
      <p className={"project-mission-bis"}>
        {p.projectMissionBisText}
      </p>
      {"\n"}
      <section className={"project-carousel-container js-slider-container scroll-container"}>
        {"\n"}
        <section className={"project-carousel js-slider"}>
          {"\n"}
          <section className={"js-slider-item carousel-item carousel-item-video-container"}>
            {"\n"}
            <div style={{"backgroundImage":"url('/_astro/instax-mini-link.x7pPR2vC_k5z0y.webp')"}} className={"lazyframe carousel-item-video carousel-item-video--simple"} data-src={"https://www.youtube.com/embed/pYaaOj27PTM"} data-vendor={"youtube"} data-thumbnail={"/_astro/instax-mini-link.x7pPR2vC_k5z0y.webp"} data-ratio={"16:9"} data-title={" "} data-tone={"1.7778:24:111111334423663122034332121111111112542134331233222111222211002204314311222111122213444333565311222111111044344444554543222111111043242033234432213301111112233530222111215555011000023554244520221378300355332343553432111247400455401125431125332225430345312312100343221122442444433311332344011233332333333333343333"}>
              <button type={"button"} className={"lazyframe__play"} aria-label={p.lazyframePlayAriaLabel} />
            </div>
            {"\n"}
            <p className={"carousel-item-title"}>
              <strong>
                {"Mini Link"}
              </strong>
              {p.carouselItemTitleText}
            </p>
            {"\n"}
          </section>
          <section className={"js-slider-item carousel-item carousel-item-video-container"}>
            {"\n"}
            <div style={{"backgroundImage":"url('/_astro/instax-mini-11.CBHAVKf1_Z1EF8i6.webp')"}} className={"lazyframe carousel-item-video carousel-item-video--simple"} data-src={"https://www.youtube.com/embed/5l_hUXRcCZI"} data-vendor={"youtube"} data-thumbnail={"/_astro/instax-mini-11.CBHAVKf1_Z1EF8i6.webp"} data-ratio={"16:9"} data-title={" "} data-tone={"1.768:24:333332111255521222145301333333111155534312434221333333111156555302446142333333211123344213455232333333211123345225544540333333211133324324564541233333211122223335761221223233211120222566434432222232211111020474453434222222111111024356644345312222101101203405515630443222100011220233121220443122222223342023303200100123333332454011213212"}>
              <button type={"button"} className={"lazyframe__play"} aria-label={p.lazyframePlayAriaLabel2} />
            </div>
            {"\n"}
            <p className={"carousel-item-title"}>
              <strong>
                {"Mini 11"}
              </strong>
              {p.carouselItemTitleText2}
            </p>
            {"\n"}
          </section>
          <section className={"js-slider-item carousel-item carousel-item-video-container"}>
            {"\n"}
            <div style={{"backgroundImage":"url('/_astro/instax-sq10.C_QLYaD3_Z16gzV.webp')"}} className={"lazyframe carousel-item-video carousel-item-video--simple"} data-src={"https://www.youtube.com/embed/DvmTe7lPhSs"} data-vendor={"youtube"} data-thumbnail={"/_astro/instax-sq10.C_QLYaD3_Z16gzV.webp"} data-ratio={"16:9"} data-title={" "} data-tone={"1.7778:24:242111112222221235323543342145531222136334432313442045531222235257410444221145421113434453534644011134421233345561324535111111110544455545635245011111111443355454646402011111113432114553557523011111124332105556224333000011023222226435501200000000133214631223554330000001054305644222254232000000023344056535324413"}>
              <button type={"button"} className={"lazyframe__play"} aria-label={p.lazyframePlayAriaLabel3} />
            </div>
            {"\n"}
            <p className={"carousel-item-title"}>
              <strong>
                {"SQ1"}
              </strong>
              {p.carouselItemTitleText3}
            </p>
            {"\n"}
          </section>
          {"\n"}
        </section>
        {"\n"}
        <button className={"button-slide button-slide--clean button-slide--project button-slide--hide button-slide--previous-clean js-slider-button-left"} type={"button"} aria-label={p.buttonSlideAriaLabel}>
          {"\n"}
          <svg xmlns={"http://www.w3.org/2000/svg"} width={"9"} height={"15"} fill={"none"} aria-hidden={"true"} focusable={"false"}>
            <path stroke={"#111319"} d={"m1 14 6.5-6.5L1 1"} />
          </svg>
          {"\n"}
        </button>
        {"\n"}
        <button className={"button-slide button-slide--clean button-slide--project button-slide--next-clean js-slider-button-right"} type={"button"} aria-label={p.buttonSlideAriaLabel2}>
          {"\n"}
          <svg xmlns={"http://www.w3.org/2000/svg"} width={"9"} height={"15"} fill={"none"} aria-hidden={"true"} focusable={"false"}>
            <path stroke={"#111319"} d={"m1 14 6.5-6.5L1 1"} />
          </svg>
          {"\n"}
        </button>
        {"\n"}
      </section>
      <section className={"project-stills-container"}>
        {"\n"}
        <h3 className={"h4 bold"}>
          {p.h4Text}
        </h3>
        {"\n"}
        <section data-no-swup={""} className={"js-project-gallery project-stills-gallery project-stills-gallery--wide"}>
          {"\n"}
          <a className={"project-stills-picture project-stills-wide"} href={"/_astro/Capture-decran-2023-10-25-a-21.51-1.D0Q0YDeo_DUXIJ.webp"} style={{"backgroundColor":"#00263b"}}>
            {"\n"}
            <img className={"project-stills-media"} src={"/_astro/Capture-decran-2023-10-25-a-21.51-1.D0Q0YDeo_DUXIJ.webp"} srcSet={"/_astro/Capture-decran-2023-10-25-a-21.51-1.D0Q0YDeo_23Gprg.webp 480w, /_astro/Capture-decran-2023-10-25-a-21.51-1.D0Q0YDeo_Z1JDR0D.webp 800w, /_astro/Capture-decran-2023-10-25-a-21.51-1.D0Q0YDeo_DUXIJ.webp 1041w"} sizes={"(min-width: 1100px) 1041px, (min-width: 1024px) 800px, (min-width: 767px) 600px, calc(100vw - 76px)"} alt={p.projectStillsMediaAlt} loading={"lazy"} decoding={"async"} style={{"aspectRatio":"1041 / 584"}} width={"1041"} height={"584"} data-tone={"1.7825:24:111112234643344214512111111132235554510103422111111342314321233021122211111352011322224554663011111232341022243677666421011000243144045677787631011100034222466778775501000123444530356556503201001133345530155445542010015423334455102666775021244322332234332323333332233332220220445444444433202344433334455554444343"} />
            {"\n"}
          </a>
          {"\n"}
          <a className={"project-stills-picture"} href={"/_astro/Capture-decran-2023-12-01-a-10.37.ClaSL5Rm_35W0Q.webp"} style={{"backgroundColor":"#00263b"}}>
            {"\n"}
            <img className={"project-stills-media"} src={"/_astro/Capture-decran-2023-12-01-a-10.37.ClaSL5Rm_35W0Q.webp"} srcSet={"/_astro/Capture-decran-2023-12-01-a-10.37.ClaSL5Rm_TNJuz.webp 480w, /_astro/Capture-decran-2023-12-01-a-10.37.ClaSL5Rm_35W0Q.webp 517w"} sizes={"(min-width: 1100px) 519px, (min-width: 1024px) 398px, (min-width: 767px) 298px, calc(50vw - 40px)"} alt={p.projectStillsMediaAlt2} loading={"lazy"} decoding={"async"} style={{"aspectRatio":"517 / 292"}} width={"517"} height={"292"} data-tone={"1.7705:24:111000000023355654430113221011101223454422311124111223202346655302301123233232112333344322121112554222222321312234432122531222223234433455443233200111112234223444443333001111223233045665434433001222232222476665343332122332333455677665333333232686132687565653233333223898553553134310133322216876765212234431233221237740434333333432122221"} />
            {"\n"}
          </a>
          {"\n"}
          <a className={"project-stills-picture"} href={"/_astro/Capture-decran-2023-12-01-a-10.38.DKTj_cyG_Z6siB6.webp"} style={{"backgroundColor":"#00263b"}}>
            {"\n"}
            <img className={"project-stills-media"} src={"/_astro/Capture-decran-2023-12-01-a-10.38.DKTj_cyG_Z6siB6.webp"} srcSet={"/_astro/Capture-decran-2023-12-01-a-10.38.DKTj_cyG_1lzpmC.webp 480w, /_astro/Capture-decran-2023-12-01-a-10.38.DKTj_cyG_Z6siB6.webp 514w"} sizes={"(min-width: 1100px) 519px, (min-width: 1024px) 398px, (min-width: 767px) 298px, calc(50vw - 40px)"} alt={p.projectStillsMediaAlt3} loading={"lazy"} decoding={"async"} style={{"aspectRatio":"514 / 292"}} width={"514"} height={"292"} data-tone={"1.7603:24:001044020687753444322111001045214143334343212210000122268631024322344210102540376765455333444024002326501243332460104302010566443251001230576545010564866672012130454364420024656871006777333011530233036884336897650221542145116655556574531100432023037545556402111000320001026546777412230100322310105567567640230100323322236555236650110100"} />
            {"\n"}
          </a>
          {"\n"}
        </section>
        {"\n"}
      </section>
      {"\n"}
      {"\n"}
      <section className={"project-small-title js-credit-title"} data-collapse={"(max-width: 766px)"} aria-controls={"project-credit"} style={{"--credit-color":"#00263b"}}>
        {"\n"}
        <h2 className={"h4 bold"}>
          {p.h4Text2}
        </h2>
        {"\n"}
      </section>
      {"\n"}
      <section id={"project-credit"} className={"project-credit"} style={{"backgroundColor":"#00263b"}} data-nav-dark={""}>
        {"\n"}
        <section className={"project-credit-grid"} style={p.projectCreditGridStyle}>
          {"\n"}
          <section className={"project-credit-bloc project-credit-agency"}>
            {"\n"}
            <p className={"project-credit-title"}>
              {p.projectCreditTitleText}
            </p>
            {"\n"}
            <p className={"project-credit-content"}>
              {"\nAustralieGAD"}
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
              {"\nBarbero&You"}
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
              {"\n"}
            </p>
            {"\n"}
          </section>
          <section className={"project-credit-bloc project-credit-team"}>
            {"\n"}
            <p className={"project-credit-title"}>
              {p.projectCreditTitleText3}
            </p>
            {"\n"}
            <p className={"project-credit-content"}>
              {"\nEmmanuel Bernard    "}
              <strong>
                {p.projectCreditContentText2}
              </strong>
              <br />
              {"Yoann Mallet    "}
              <strong>
                {p.projectCreditContentText3}
              </strong>
              <br />
              {p.projectCreditContentText4}
              <br />
              {p.projectCreditContentText5}
              <br />
              {"\n"}
            </p>
            {"\n"}
          </section>
          {"\n"}
        </section>
        {"\n"}
      </section>
      {"\n"}
    </section>
  );
}
