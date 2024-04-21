export function neverError(
  message: string,
  token: never
) {
  return new Error(
    `${message}. ${token} should not exist`
  );
}