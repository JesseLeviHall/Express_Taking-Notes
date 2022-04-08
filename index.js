const express = require("express");
const app = express();

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`The app is running on http://localhost:${PORT}`);
});
