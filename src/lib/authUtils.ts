const JWT_PAYLOAD_DELIMITER = ".";

export const authCookieNames = {
	accessToken: "accessToken",
	refreshToken: "refreshToken",
	sessionToken: "sessionToken",
} as const;

type JwtPayload = {
	exp?: number;
};

const base64UrlDecode = (value: string) => {
	const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
	const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

	return Buffer.from(padded, "base64");
};

const parseJwtPayload = (token: string): JwtPayload | null => {
	const [, encodedPayload] = token.split(JWT_PAYLOAD_DELIMITER);

	if (!encodedPayload) {
		return null;
	}

	try {
		return JSON.parse(base64UrlDecode(encodedPayload).toString("utf8")) as JwtPayload;
	} catch {
		return null;
	}
};

export const getJwtMaxAgeInSeconds = (token: string) => {
	const payload = parseJwtPayload(token);

	if (!payload?.exp) {
		return undefined;
	}

	const remainingSeconds = payload.exp - Math.floor(Date.now() / 1000);

	return remainingSeconds > 0 ? remainingSeconds : undefined;
};

export const buildAuthErrorMessage = (message: unknown, fallbackMessage: string) => {
	if (typeof message === "string" && message.trim()) {
		return message;
	}

	return fallbackMessage;
};
