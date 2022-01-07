const express = require("express");
const app = express();
const port = 3030;
const computeRolesByAction = require("./utils/rolesByAction");

app.set("view engine", "pug");

const rolesByActions = computeRolesByAction();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/roles", (req, res) => {
  const secureActionsQueryParam = req.query.secureActions;
  if (!secureActionsQueryParam) {
    res.send("'secureActions' query param is required");
    return;
  }

  let secureActions;
  try {
    secureActions = secureActionsQueryParam.split(",");
  } catch (e) {
    res.send("Secure actions should be comma delimited like 'a,b,c'");
    return;
  }

  console.info(`Secure actions requested ${secureActions}`);

  res.render("rolesByAction", {
    rolesByActions: secureActions.map((action) => [
      action,
      rolesByActions[action],
    ]),
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
