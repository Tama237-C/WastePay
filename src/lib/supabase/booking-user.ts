type BookingAuthError = {
  code?: string;
  message: string;
};

type BookingAuthClient = {
  auth: {
    getSession: () => Promise<{
      data: { session: { user: { id: string } } | null };
      error: BookingAuthError | null;
    }>;
    getUser: () => Promise<{
      data: { user: { id: string } | null };
      error: BookingAuthError | null;
    }>;
  };
};

export async function getVerifiedBookingUserId(
  client: BookingAuthClient,
): Promise<{ userId: string | null; error: BookingAuthError | null }> {
  const {
    data: { session },
    error: sessionError,
  } = await client.auth.getSession();

  if (sessionError || !session) {
    return { userId: null, error: sessionError };
  }

  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  return {
    userId: error ? null : user?.id ?? null,
    error,
  };
}
