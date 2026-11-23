export function getStaffPasswordValidationError(
  password: string,
  confirmation: string,
): string | null {
  if (password.length < 12) {
    return "Your new password must contain at least 12 characters.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Your new password must contain at least one uppercase letter.";
  }

  if (!/[a-z]/.test(password)) {
    return "Your new password must contain at least one lowercase letter.";
  }

  if (!/[0-9]/.test(password)) {
    return "Your new password must contain at least one number.";
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Your new password must contain at least one symbol.";
  }

  if (password !== confirmation) {
    return "The two password entries do not match.";
  }

  return null;
}
