import { Request, Response } from 'express';

export const getTokenFromCookie = (req: Request) => {
  const cookies = req.headers.cookie?.split('; ');
  if (!cookies?.length) return null;

  const tokenCookie = cookies.find((cookie) => cookie.startsWith('jwt'));

  if (!tokenCookie) return null;

  return decodeURIComponent(tokenCookie.split('=')[1]);
};

export const deleteCookie = (res: Response) => {
  res.clearCookie('jwt', {
    path: '/',
    httpOnly: true,
    secure: false,
    sameSite: 'strict' as const,
  });
};
