import Head404 from '../components/Head404.jsx';
import Transition from '../components/Transition.jsx';
import TalkCta404 from '../components/TalkCta404.jsx';
import Script from '../components/Script.jsx';

// Route: /404/
// Page content (text, links, images) for the shared components below.
const content = {};

export default function Page404() {
  return (
    <html lang={"en"} prefix={"og: http://ogp.me/ns#"}>
      <Head404 />
      <body id={"body"} className={"body"}>
        <main className={"main"} id={"swup"}>
        <Transition />
        <article id={"js-project"} className={"project"} data-loaded={"0"}>
          <TalkCta404 />
          <Script />
        </article>
        </main>
        <script type={"module"} src={"/_astro/Base.astro_astro_type_script_index_0_lang.o1EI0Byl.js"} />
      </body>
    </html>
  );
}
