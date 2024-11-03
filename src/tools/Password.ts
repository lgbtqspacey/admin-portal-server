import crypto from 'crypto'

class Password {
    /**
     * Create a hashed password from a plain password
     *
     * @param {string} password the plain password
     * @returns {string} the hashed password
     */
    public static readonly encrypt = (password: string): string => {
        const salt = crypto.createHash('sha256').update('16').digest('hex')
        const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex')
        return hash
    }

    /**
     * Validate a plain password against a hashed password
     *
     * @param password the plain password
     * @param hashed the hashed password from the database
     * @returns {boolean} if the password is valid
     */
    public static readonly validate = (password: string, hashed: string): boolean => {
        const hash = this.encrypt(password)

        if (hashed === hash) {
            return true
        } else {
            return false
        }
    }
}

export default Password
