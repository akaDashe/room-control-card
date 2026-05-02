// Suppress the registration banner logged at module load time
console.info = () => {};

// Tell Lit that the dev-mode warning has already been issued so it doesn't
// repeat it on every test file that imports a Lit component.
(globalThis as any).litIssuedWarnings ??= new Set();
(globalThis as any).litIssuedWarnings.add("dev-mode");
