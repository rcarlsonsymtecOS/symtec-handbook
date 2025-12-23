const fs = require("fs");
const path = require("path");

function loadHandbookText() {
  const handbookDir = path.join(process.cwd(), "handbook");
  let text = "";

  if (!fs.existsSync(handbookDir)) {
    return "";
  }

  const files = fs.readdirSync(handbookDir);

  for (const file of files) {
    if (file.endsWith(".html")) {
      const filePath = path.join(handbookDir, file);
      const content = fs.readFileSync(filePath, "utf8");

      // Strip HTML tags (simple + safe)
      const cleaned = content
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ");

      text += "\n" + cleaned;
    }
  }

  return text.toLowerCase();
}

module.exports = async function (context, req) {
  const question = (req.query.q || "").toLowerCase();

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

  const handbookText = loadHandbookText();

  let answer;

  if (handbookText.includes(question)) {
    answer =
      "This topic is addressed in the SymTec Employee Handbook. Please review the relevant section for full details.";
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
