const FIREBASE_AUTH_ERRORS = {
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/user-not-found': 'Invalid email or password.',
  'auth/wrong-password': 'Invalid email or password.',
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/too-many-requests': 'Too many attempts. Try again later.',
  'auth/network-request-failed':
    'Network error. Check your connection and try again.',
}

export function getFirebaseAuthErrorMessage(error) {
  if (!error?.code) {
    return 'Sign in failed. Please try again.'
  }

  return FIREBASE_AUTH_ERRORS[error.code] ?? 'Sign in failed. Please try again.'
}
