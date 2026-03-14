import fs from "fs";
import path from "path";

function loadDoc(fileName: string) {
  const fullPath = path.join(process.cwd(), "docs", fileName);
  return fs.readFileSync(fullPath, "utf8");
}

export default function BlueprintPage() {
  const markdown = loadDoc("product-blueprint.md");

  return (
    <main className="doc-shell">
      <div className="doc-header">
        <a className="doc-back" href="/">Back</a>
        <h1>Product Blueprint</h1>
      </div>
      <pre className="doc-block">{markdown}</pre>
    </main>
  );
}
