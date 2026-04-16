/**
 * Tenant helpers: user records may store "ABC" or "school_ABC"; connection URIs use the short key.
 */

const tenantConnectionKey = (raw) => {
  if (!raw || typeof raw !== "string") return "";
  return raw.startsWith("school_") ? raw.slice("school_".length) : raw;
};

const tenantStoredAliases = (connectionKey) => {
  const k = tenantConnectionKey(connectionKey);
  if (!k) return [];
  const withPrefix = `school_${k}`;
  return k === withPrefix ? [k] : [k, withPrefix];
};

const listSchoolConnectionKeys = (user) => {
  const seen = new Set();
  const out = [];
  const push = (raw) => {
    const key = tenantConnectionKey(raw);
    if (!key || seen.has(key)) return;
    seen.add(key);
    out.push(key);
  };
  if (Array.isArray(user.schoolIDs)) {
    user.schoolIDs.forEach(push);
  }
  push(user.schoolID);
  return out;
};

const userHasSchoolAccess = (user, requestedTenant) => {
  if (!requestedTenant || requestedTenant === "Users") return true;
  const want = tenantConnectionKey(requestedTenant);
  if (!want) return false;
  return listSchoolConnectionKeys(user).includes(want);
};

/** Stored `schoolID` string for the active tenant (for creating child users in Users DB). */
const storedSchoolIdForActiveTenant = (user, tenantRaw) => {
  const key = tenantConnectionKey(tenantRaw || "");
  if (!key || tenantRaw === "Users") {
    return user.schoolID || null;
  }
  if (user.schoolID && tenantConnectionKey(user.schoolID) === key) {
    return user.schoolID;
  }
  if (Array.isArray(user.schoolIDs)) {
    const hit = user.schoolIDs.find((s) => tenantConnectionKey(s) === key);
    if (hit) return hit;
  }
  return `school_${key}`;
};

module.exports = {
  tenantConnectionKey,
  tenantStoredAliases,
  listSchoolConnectionKeys,
  userHasSchoolAccess,
  storedSchoolIdForActiveTenant,
};
