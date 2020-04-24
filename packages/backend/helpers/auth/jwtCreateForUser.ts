import { sign } from 'jsonwebtoken';

import { JwtEnv } from '../../constants/env/Jwt';


/**
 * Creates new JWT token for authenticated access for given userId
 * @param userId - id of the user logging in
 */
export const jwtCreateForUser = (userId: number): string => sign(String(userId), JwtEnv.JWT_SECRET);
