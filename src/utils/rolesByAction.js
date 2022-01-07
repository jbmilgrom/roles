const actionsByRoles = require("../../assets/roles.json");
const secureActions = require("../../assets/secureActions.json");

const roles = Object.keys(actionsByRoles);

module.exports = () => {
  const rolesByAction = {};
  for (const action in secureActions) {
    if (!rolesByAction[action]) {
      rolesByAction[action] = [];
    }

    for (const role of roles) {
      const actionsInRole = actionsByRoles[role];
      if (!actionsInRole) {
        console.warn(`No actions for ${role}`);
        continue;
      }
      if (actionsInRole.indexOf(action) > -1) {
        rolesByAction[action].push(role);
      }
    }
  }
  return rolesByAction;
};
