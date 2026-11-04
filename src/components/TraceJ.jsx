// Props: id, html
export default function TraceJ(p) {
  return (
    <script type={"application/json"} id={p.id} dangerouslySetInnerHTML={{ __html: p.html }} />
  );
}
