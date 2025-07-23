
import weasyprintModule from "node-weasyprint";

const weasyprint = weasyprintModule.default;

export async function generatePDF (data, output, baseUrl) {
  const html = data.dom.serialize();
  await weasyprint(html, { output, baseUrl });
}
