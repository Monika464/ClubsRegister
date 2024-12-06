const app = require("./app");
const port = process.env.PORT || 3000;
require("./db/mongoose");

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
