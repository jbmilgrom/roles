const express = require("express");
const app = express();
const port = 3030;
const intersection = require("./utils/intersection");
const computeRolesByAction = require("./utils/rolesByAction");
const getRoleData = require("./resources/rolesByActions");

app.set("view engine", "pug");

const SNAPCHAT3_ROLES_CHECKER_CLI_PATH = "/Users/jmilgrom/Desktop/snap/snapchat3/cli/roles-checker";
const FILE_NAME = "/Users/jmilgrom/Desktop/hack/roles-server/assets/generated.json";

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/roles", async (req, res) => {
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

  try {
    const roleData = await getRoleData(SNAPCHAT3_ROLES_CHECKER_CLI_PATH, FILE_NAME);
    const rolesByActions = computeRolesByAction(roleData.secureActions, roleData.map);
    res.render("rolesByAction", {
      rolesByActions: secureActions.map((action) => [action, rolesByActions[action]]),
      desiredRoles: intersection(...secureActions.map((action) => rolesByActions[action])),
    });
  } catch (e) {
    console.error(e);
    res.send(`Error: ${e}`);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
