import { OAuth2Client } from 'google-auth-library';

import { env } from './env.js';

// Single OAuth2 client used to verify Google ID tokens (audience = our client id).
export const googleClient = new OAuth2Client(env.google.clientId);

export default googleClient;
