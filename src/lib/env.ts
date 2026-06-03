import z from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url("NEXT_PUBLIC_API_BASE_URL must be a valid URL"),
  NEXT_PUBLIC_APP_NAME: z.string().min(1, "NEXT_PUBLIC_APP_NAME is required"),
  NEXT_PUBLIC_APP_ORIGIN: z.string().url("NEXT_PUBLIC_APP_ORIGIN must be a valid URL").optional(),
  NEXT_PUBLIC_IIMGBB_KEY: z.string().min(1, "NEXT_PUBLIC_IIMGBB_KEY is required"),
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().optional(),
});

const serverEnvSchema = z.object({
  JWT_ACCESS_SECRET: z.string().min(1, "JWT_ACCESS_SECRET is required"),
  JWT_REFRESH_SECRET: z.string().min(1, "JWT_REFRESH_SECRET is required"),
  BASE_API_URL: z.string().url("BASE_API_URL must be a valid URL"),
  IIMGBB_KEY: z.string().min(1, "IIMGBB_KEY is required"),
});

const formatEnvErrors = (issues: { path: PropertyKey[]; message: string }[]) => {
  return issues
    .map((issue) => `${issue.path.map((segment) => String(segment)).join(".")}: ${issue.message}`)
    .join("\n");
};

const parsedPublic = publicEnvSchema.safeParse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_ORIGIN: process.env.NEXT_PUBLIC_APP_ORIGIN,
  NEXT_PUBLIC_IIMGBB_KEY: process.env.NEXT_PUBLIC_IIMGBB_KEY,
});

if (!parsedPublic.success) {
  const formattedErrors = formatEnvErrors(parsedPublic.error.issues);
  throw new Error(`Invalid public environment variables:\n${formattedErrors}`);
}

export const publicEnv = parsedPublic.data;

type ServerEnv = z.infer<typeof serverEnvSchema>;
let cachedServerEnv: ServerEnv | null = null;

export const getServerEnv = (): ServerEnv => {
  if (cachedServerEnv) {
    return cachedServerEnv;
  }

  const parsedServer = serverEnvSchema.safeParse({
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  BASE_API_URL: process.env.BASE_API_URL,
  IIMGBB_KEY: process.env.IIMGBB_KEY,
  });

  if (!parsedServer.success) {
    const formattedErrors = formatEnvErrors(parsedServer.error.issues);
    throw new Error(`Invalid server environment variables:\n${formattedErrors}`);
  }

  cachedServerEnv = parsedServer.data;
  return cachedServerEnv;
};

// Backward-compatible alias for client-safe values.
export const env = publicEnv;
