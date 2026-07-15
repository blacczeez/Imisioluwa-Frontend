export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { registerAll } = await import('./lib/server/bootstrap');
    registerAll();
  }
}
