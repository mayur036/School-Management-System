import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/** Hash a plaintext password for storage. */
export const hashPassword = (plain) => bcrypt.hash(plain, SALT_ROUNDS);

/** Compare a plaintext password against a stored bcrypt hash. */
export const comparePassword = (plain, hash) => bcrypt.compare(plain, hash);
