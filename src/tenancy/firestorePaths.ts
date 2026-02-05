export function tenantRoot(tenantId: string) {
  return `tenants/${tenantId}`;
}

export function tenantUsersCollection(tenantId: string) {
  return `${tenantRoot(tenantId)}/users`;
}

export function tenantContentCollection(tenantId: string) {
  return `${tenantRoot(tenantId)}/content`;
}

export function tenantLicensesDoc(tenantId: string) {
  return `${tenantRoot(tenantId)}/licensing/current`;
}

export function tenantBrandingDoc(tenantId: string) {
  return `${tenantRoot(tenantId)}/branding/current`;
}
