require('dotenv').config()

const pkg = require('./package'),
{ Nuxt, Builder }   = require('nuxt'),
config              = require('./nuxt.config.js'),
https               = require('https'),
fs                  = require('fs'),
port                = process.env.NUXT_PORT,
isProd              = (process.env.NODE_ENV === 'production'),
nuxt                = new Nuxt(config);
options             = {
  key: fs.readFileSync(process.env.CERT_KEY_PATH, "utf8"),
  cert: fs.readFileSync(process.env.CERT_CRT_PATH, "utf8")
},
envMsg              = config.dev ? 'Development' : 'Production',
devUrl              = `https://dhcp-cityhall-xxx-xxx.bloomington.in.gov`,
dividerMsg          = `🛠️\xa0\xa0⛓️\xa0\xa0👩‍💻\xa0🔮\xa0👨‍💻\xa0⛓️\xa0\xa0🛠️`,
dividerStars        = `★\xa0\xa0`,
starRepeatCount     = 22;

config.dev          = !isProd;

// Build only in dev mode with hot-reloading
if (config.dev) {
  new Builder(nuxt).build()
  .then(listen)
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
} else { listen() }

function listen() {
  https
  .createServer(options, nuxt.render)
  .listen(port);

  console.log(`\n\n${dividerMsg}\n`
            + `${dividerStars.repeat(starRepeatCount)}\n`
            + `App:  ${pkg.prettyName}\n`
            + `Env:  ${envMsg}\n`
            + `Who:  ${pkg.company}\n`
            + `Repo: ${pkg.repository.url}\n`
            + `Url:  ${devUrl}:${port}`
            + `\n${dividerStars.repeat(starRepeatCount)}\n`
            + `${dividerMsg}\n\n`);
}