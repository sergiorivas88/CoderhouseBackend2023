
export default {
    env: process.env.NODE_ENV || 'dev',
    url: process.env.WEB_URL,
    port: process.env.PORT,
    db: {
        URI: process.env.URI,
        URI_DEV: process.env.URIDEV
    },
    jwtSecret: process.env.JWT_SECRET,
    cookieSecret: process.env.COOKIE_SECRET,
    sessionSecret: process.env.SESSION_SECRET,
    adminData: {
        adminMail: process.env.ADMIN_EMAIL,
        adminPass: process.env.ADMIN_PASSWORD
    },
    github: {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    },
    nodemailer: {
        pass: process.env.EMAIL_PASS,
        email: process.env.EMAIL
    }
}