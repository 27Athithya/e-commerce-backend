type EnvironmentVariables = Record<string, string | undefined>;

function parsePort(port: string | undefined): string {
  const parsedPort = Number(port ?? "3001");
  if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
    throw new Error("PORT must be a valid integer between 1 and 65535");
  }

  return String(parsedPort);
}

function validateOrigins(rawOrigins: string | undefined): string {
  const origins = (rawOrigins ?? "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (origins.length === 0) {
    throw new Error("CLIENT_ORIGIN must contain at least one origin");
  }

  for (const origin of origins) {
    try {
      const parsed = new URL(origin);
      if (!parsed.protocol.startsWith("http")) {
        throw new Error();
      }
    } catch {
      throw new Error(`CLIENT_ORIGIN has invalid URL: ${origin}`);
    }
  }

  return origins.join(",");
}

export function validateEnv(env: EnvironmentVariables) {
  if (!env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required");
  }

  const clientOrigin = env.CLIENT_ORIGIN ?? env.FRONTEND_URL;

  return {
    PORT: parsePort(env.PORT),
    CLIENT_ORIGIN: validateOrigins(clientOrigin),
    MONGODB_URI: env.MONGODB_URI,
  };
}
