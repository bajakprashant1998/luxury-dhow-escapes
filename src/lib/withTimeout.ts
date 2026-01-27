export async function withTimeout<T>(
  promise: PromiseLike<T>,
  ms = 5000,
  message = "Request timed out",
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), ms);
  });

  try {
    // Supabase query builders are PromiseLike (thenables), not real Promises.
    // Promise.resolve() safely wraps them into a real Promise so race/timeout works.
    const resolved = Promise.resolve(promise);
    return await Promise.race([resolved, timeoutPromise]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}
