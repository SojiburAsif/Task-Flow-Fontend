import crypto from "node:crypto"

type JwtPayload = Record<string, unknown> & {
	exp?: number
	role?: string
	email?: string
	name?: string
}

type VerifyResult<T> =
	| { success: true; data: T }
	| { success: false; data: null }

const base64UrlDecode = (value: string) => {
	const normalized = value.replace(/-/g, "+").replace(/_/g, "/")
	const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")
	return Buffer.from(padded, "base64")
}

const timingSafeEqualString = (left: string, right: string) => {
	const leftBuffer = Buffer.from(left)
	const rightBuffer = Buffer.from(right)

	if (leftBuffer.length !== rightBuffer.length) {
		return false
	}

	return crypto.timingSafeEqual(leftBuffer, rightBuffer)
}

function verifyToken<T extends JwtPayload>(token: string, secret: string): VerifyResult<T> {
	try {
		const [encodedHeader, encodedPayload, encodedSignature] = token.split(".")

		if (!encodedHeader || !encodedPayload || !encodedSignature) {
			return { success: false, data: null }
		}

		const header = JSON.parse(base64UrlDecode(encodedHeader).toString("utf8")) as { alg?: string }
		if (header.alg !== "HS256") {
			return { success: false, data: null }
		}

		const expectedSignature = crypto
			.createHmac("sha256", secret)
			.update(`${encodedHeader}.${encodedPayload}`)
			.digest("base64")
			.replace(/\+/g, "-")
			.replace(/\//g, "_")
			.replace(/=+$/g, "")

		if (!timingSafeEqualString(encodedSignature, expectedSignature)) {
			return { success: false, data: null }
		}

		const payload = JSON.parse(base64UrlDecode(encodedPayload).toString("utf8")) as T
		if (typeof payload.exp === "number" && payload.exp * 1000 < Date.now()) {
			return { success: false, data: null }
		}

		return { success: true, data: payload }
	} catch {
		return { success: false, data: null }
	}
}

export const jwtUtils = {
	verifyToken,
}
