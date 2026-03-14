import fs from "fs";
import path from "path";

function loadSchema() {
  const fullPath = path.join(process.cwd(), "supabase", "schema.sql");
  return fs.readFileSync(fullPath, "utf8");
}

export default function SchemaPage() {
  const sql = loadSchema();

  return (
    <main className="doc-shell">
      <div className="doc-header">
        <a className="doc-back" href="/">Back</a>
        <h1>Supabase Schema</h1>
      </div>
      <pre className="doc-block">{sql}</pre>
    </main>
  );
}
