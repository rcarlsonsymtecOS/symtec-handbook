// force redeploy
const fs = require("fs");
const path = require("path");

/**
 * Load handbook sections individually
 * Each section keeps its filename + cleaned text
 */
function loadHandbookSections() {
  const handbookDir = path.join(process.cwd(), "handbook");
  const sections = [];

  if (!fs.existsSync(handbookDir)) {
    return sections;
  }

  const files = fs.readdirSync(handbookDir);

  for (const file of files) {
    if (file.endsWith(".html")) {
      const filePath = path.join(handbookDir, file);
      const raw = fs.readFileSync(filePath, "utf8");

      // Strip HTML safely
      const cleaned = raw
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

      sections.push({
        file,
        sectionName: file.replace(".html", "").replace(/-/g, " "),
        text: cleaned
      });
    }
  }

  return sections;
}

module.exports = async function (context, req) {
  const question = (req.query.q || "").trim().toLowerCase();

  if (!question) {
    context.res = {
      status: 400,
      body: {
        success: false,
        message: "Missing query parameter ?q="
      }
    };
    return;
  }

  const sections = loadHandbookSections();

  let matchedSection = null;

  for (const section of sections) {
    if (section.text.includes(question)) {
      matchedSection = section;
      break;
    }
  }

  let answer;

  if (matchedSection) {
    answer = `This topic is addressed in the SymTec Employee Handbook under the section "${matchedSection.sectionName}". Please review that section for full details.`;
  } else {
    answer =
      "This topic is not covered in the handbook. Please reach out to your team lead for guidance.";
  }

  context.res = {
    status: 200,
    body: {
      success: true,
      question: req.query.q,
      answer
    }
  };
};
