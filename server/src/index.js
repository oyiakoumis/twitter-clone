const app = require("./app");

const port = process.env.PORT;

app.listen(
  port,
  () => `Server is listening on port ${port}`
);
