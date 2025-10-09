import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function generateEditorTemplate(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemma-3-4b-it" });

  const detailedPrompt = `
You are an expert assistant that generates structured JSON for Editor.js.
You MUST return ONLY valid JSON, with no extra text or markdown formatting like \`\`\`json.

Your task is to generate rich, well-structured content for the following topic: "${prompt}"

Use a variety of block types to make the content engaging and easy to read. Follow these schemas precisely:

- **Header**: For titles and subtitles.
  - \`{ "type": "header", "data": { "text": "This is a Header", "level": 2 } }\` (level can be 1-6)

- **Paragraph**: For regular text.
  - \`{ "type": "paragraph", "data": { "text": "This is a paragraph. You can use <b>bold</b> and <i>italic</i> tags." } }\`

- **List**: For bullet points. The 'items' property MUST be an array of strings.
  - \`{ "type": "list", "data": { "style": "unordered", "items": ["First item", "Second item", "Third item"] } }\`

- **Checklist**: For to-do items. The 'items' property MUST be an array of objects.
  - \`{ "type": "checklist", "data": { "items": [{ "text": "My first task", "checked": false }, { "text": "Another task", "checked": true }] } }\`
  
- **Table**: For tabular data. 'withHeadings' must be true if you provide a header row. 'content' MUST be an array of arrays of strings.
  - \`{ "type": "table", "data": { "withHeadings": true, "content": [["Header 1", "Header 2"], ["Cell 1", "Cell 2"], ["Cell 3", "Cell 4"]] } }\`

Now, generate the complete Editor.js JSON object for the topic: "${prompt}"
`;

  let text = "";

  try {
    const result = await model.generateContent(detailedPrompt);
    const response = await result.response;

    text = response.text();
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    } else {
      throw new Error("No valid JSON object found in the AI response.");
    }

  } catch (err) {
    console.error("❌ Failed to parse AI JSON:", err, "Raw AI Response:", text);
    throw err;
  }
}

