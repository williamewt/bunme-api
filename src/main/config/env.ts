import 'dotenv/config'

export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '',
    clientSecret: process.env.FB_CLIENT_SECRET ?? '',
    tokenTest: process.env.FB_TOKEN_TEST ?? ''
  },
  googleApi: {
    clientId: process.env.GOOGLE_CLIENT_ID ?? '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    redirectUri: process.env.GOOGLE_REDIRECT_URI ?? '',
    codeTest: process.env.GOOGLE_CODE_TEST ?? ''
  },
  microsoftApi: {
    tokenTest: process.env.MICROSOFT_TOKEN_TEST ?? ''
  },
  port: process.env.PORT ?? 8080,
  bcryptSalt: parseInt(process.env.BCRYPT_SALT ?? '12'),
  jwtSecret: process.env.JWT_SECRET ?? ''
}
