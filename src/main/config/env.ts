export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '962950074392514',
    clientSecret: process.env.FB_CLIENT_SECRET ?? '486a8df296d74bdf7d07adfa53b852ac'
  },
  port: process.env.PORT ?? 8080,
  jwtSecret: process.env.JWT_SECRET ?? 'luhgsafviugav384'
}
