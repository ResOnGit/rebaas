export const rebaasKeys = {
  status: (projectRef: string | undefined) => ['projects', projectRef, 'rebaas-status'] as const,
  home: (projectRef: string | undefined) => ['projects', projectRef, 'rebaas-home'] as const,
}
