import { Request } from 'express';

interface UserPayload {
  email: string | undefined;
  sub: string;
  given_name: string | undefined;
  family_name: string | undefined;
}

interface GoogleRequestBody {
  token: string;
}

export interface GoogleAuthLogin extends Request<{}, {}, GoogleRequestBody> {
  user?: UserPayload;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}
