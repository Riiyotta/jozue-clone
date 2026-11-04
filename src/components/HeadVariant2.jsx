// Props: text, content, content2, content3, content4, content5, content6, content7, content8, content9, html, href, href2, href3, href4
export default function HeadVariant2(p) {
  return (
    <head>
      {"\n"}
      <meta charSet={"UTF-8"} />
      {"\n"}
      <meta name={"viewport"} content={"width=device-width, initial-scale=1"} />
      {"\n"}
      <link rel={"profile"} href={"http://gmpg.org/xfn/11"} />
      {"\n"}
      <title>
        {p.text}
      </title>
      {"\n"}
      {"\n"}
      <link rel={"icon"} href={"/favicon.ico"} sizes={"32x32"} />
      {"\n"}
      <link rel={"icon"} href={"/favicon.svg"} type={"image/svg+xml"} />
      {"\n"}
      <link rel={"apple-touch-icon"} href={"/apple-touch-icon.png"} />
      {"\n"}
      {"\n"}
      <script dangerouslySetInnerHTML={{ __html: "\n      try {\n        [['55Rg', 'normal'], ['75Bd', 'bold']].forEach(function (f) {\n          new FontFace('Neue Haas Grotesk Display', 'url(/fonts/NHaasGroteskDSPro-' + f[0] + '.woff2) format(\"woff2\")', { weight: f[1] }).load().catch(function () {});\n        });\n      } catch (e) { /* FontFace indisponible : les polices arrivent par la feuille de style, comme avant */ }\n    " }} />
      <link rel={"preload"} as={"image"} href={"/_astro/jozue-logo-project.B0nm3wc4.svg"} />
      {"\n"}
      <style dangerouslySetInnerHTML={{ __html: ":root{--motion-fast:200ms;--motion-base:300ms;--motion-slow:1000ms;--ease-default:ease;--ease-in:ease-in;--ease-in-out:ease-in-out;--transition-fade-in:300ms;--transition-hold:1000ms;--transition-fade-out:300ms;--dur-micro:160ms;--dur-base:380ms;--dur-move:720ms;--dur-cine:1400ms;--ease-enter:cubic-bezier(0.22,0.61,0.36,1);--ease-exit:cubic-bezier(0.4,0,1,1);--ease-move:cubic-bezier(0.4,0,0.2,1);--ease-emphasis:cubic-bezier(0.2,0.8,0.2,1);--stagger-step:60ms;--reveal-distance:24px;--reveal-duration:480ms;--panel-duration:720ms;--cycle-duration:420ms;--magnet-duration:600ms;--intro-signature-color:#050507;--intro-panel-duration:360ms;--intro-loader-max:2600ms;--home-nav-delay:0ms;--home-nav-step:70ms;--home-hi-delay:140ms;--home-hi-step:90ms;--home-title-delay:240ms;--home-letter-step:18ms;--home-letter-max:460ms;--home-title-exit-step:12ms;--home-text-delay:780ms;--home-text-step:100ms;--home-address-delay:960ms;--home-explore-delay:1080ms;--home-j-opacity:0.1;--home-j-color:#dcdbdb;--hint-duration:1800ms;--hint-distance:4px;--hint-line:8px;--hint-band:55px;--hint-band-mobile:55px;--hint-grow:8px;--hint-rise:720ms;--hint-enclose:2200ms;--ease-sweep:linear(0, 0.02 5%, 0.69 80%, 0.93 92%, 1);--hint-lift:380ms;--hint-nudge:6000ms;--hint-nudge-delay:2480ms;--arrival-settle:560ms;--hint-breaths:2;--hint-color:#f73326;--card-grow:1.8;--card-grow-mobile:1.4;--underline-duration:380ms;--underline-thickness:1px;--award-shift:6px;--roll-duration:420ms;--roll-step:20ms;--roll-max:200ms;--roll-ease:cubic-bezier(0.2,0.8,0.2,1);--lightbox-speed:500ms;--lightbox-scale:0.96;--lightbox-nudge:10px}" }} />
      {"\n"}
      <meta name={"description"} content={p.content} />
      {"\n"}
      <meta property={"og:type"} content={"article"} />
      {"\n"}
      <meta property={"og:title"} content={p.content2} />
      {"\n"}
      <meta property={"og:image"} content={p.content3} />
      {"\n"}
      <meta property={"og:image:width"} content={"1200"} />
      {"\n"}
      <meta property={"og:image:height"} content={p.content4} />
      {"\n"}
      <meta property={"og:image:alt"} content={p.content5} />
      {"\n"}
      <meta name={"twitter:card"} content={"summary_large_image"} />
      {"\n"}
      <meta property={"og:url"} content={p.content6} />
      {"\n"}
      <meta property={"og:site_name"} content={"jozue.fr"} />
      {"\n"}
      <meta property={"og:locale"} content={p.content7} />
      <meta property={"og:locale:alternate"} content={p.content8} />
      {"\n"}
      <meta property={"og:description"} content={p.content9} />
      {"\n"}
      <script type={"application/ld+json"} dangerouslySetInnerHTML={{ __html: p.html }} />
      {"\n"}
      <link rel={"canonical"} href={p.href} />
      <link rel={"alternate"} hrefLang={"en"} href={p.href2} />
      <link rel={"alternate"} hrefLang={"fr"} href={p.href3} />
      <link rel={"alternate"} hrefLang={"x-default"} href={p.href4} />
      {"\n"}
      <link rel={"sitemap"} href={"/sitemap-index.xml"} />
      {"\n"}
      {"\n"}
      <link rel={"stylesheet"} href={"/_astro/Base.Db0Vu-aS.css"} />
      {"\n"}
      <link rel={"stylesheet"} href={"/_astro/MotionTokens.mJrO5Au9.css"} />
      {"\n"}
      <link rel={"stylesheet"} href={"/_astro/lazyframe.JfMrjVw8.css"} />
    </head>
  );
}
