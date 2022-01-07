const express = require("express");
const app = express();
const port = 3030;
const intersection = require("./utils/intersection");
const computeRolesByAction = require("./utils/rolesByAction");
const validateActions = require("./utils/validateActions");
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
    const invalidActions = validateActions(roleData.secureActions, secureActions);
    if (invalidActions.length > 0) {
      res.render("invalidActions", {invalidActions});
      return;
    }
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

app.get("/actions", async (req, res) => {
  const search = req.query.search;
  if (search) {
    console.log(`Searching ${search}`);
  }

  try {
    const roleData = await getRoleData(SNAPCHAT3_ROLES_CHECKER_CLI_PATH, FILE_NAME);
    if (!search) {
      res.render("actions", {actions: roleData.secureActions});
      return;
    }
    const matches = roleData.secureActions.filter(action => action.includes(search.toUpperCase()));
    if (matches.length === 0) {
      res.send(`No matches for ${search}`);
      return;
    }
    res.render("actions", {actions: matches});
  } catch (e) {
    console.error(e);
    res.send(`Error: ${e}`);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
