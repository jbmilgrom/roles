module.exports = (secureActions, actionsByRoles) => {
  const roles = Object.keys(actionsByRoles);

  const rolesByAction = {};
  for (const action of secureActions) {
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
