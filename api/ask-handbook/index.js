module.exports = async function (context, req) {
  const question = req.query.q || "No question provided";

  context.res = {
    status: 200,
    headers: { "Content-Type": "application/json" },
    body: {
      answer: `You asked: "${question}". (AI coming next)`
    }
  };
};

