module.exports = async function (context, req) {
  const question =
    req.query.q ||
    (req.body && req.body.q) ||
    "No question provided";

  context.res = {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      success: true,
      received: question,
      message: "ask-handbook API is working"
    }
  };
};
