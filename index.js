const server = require("./api/server");

const PORT = process.env.PORT || 5500;

server.listen(PORT, () =>
  console.log(`\n*** Server Running on http://localhost:${PORT} ***\n`)
);
