module.exports = async function (context, req) {
  context.res = {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      message: "ask-handbook function is alive",
      timestamp: new Date().toISOString()
    }
  };
};
