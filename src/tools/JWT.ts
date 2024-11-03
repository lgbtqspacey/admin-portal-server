import { NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export default class JWT {
    /**
     * Generates a signed token with a payload with 30 minutes expiration.
     *
     * @param {string} userId uuid of the user.
     * @returns {string} the signed token.
     */
    public static readonly generate = (userId: string): string => {
        const payload = {
            userId: userId,
            iat: Date.now() / 1000,
            exp: Math.floor(Date.now() / 1000) + (60 * 30)
        }

        const signedToken = jwt.sign(payload, process.env.JWT_SECRET as string, { algorithm: 'HS256' })

        return signedToken
    }

    /**
     * Verifies a token and returns the payload if it is valid.
     *
     * @param {string} token Bearer token to verify.
     * @param next Express next function.
     * @returns {jwt.JwtPayload | boolean} the payload if the token is valid, false otherwise.
     */
    public static readonly verify = (token: string, next: NextFunction): jwt.JwtPayload | boolean => {
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload
            return payload
        } catch (error) {
            next(error)
            return false
        }
    }
}
