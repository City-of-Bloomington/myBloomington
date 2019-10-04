require('dotenv').config()

const pkg = require('./package'),
{ Nuxt, Builder }   = require('nuxt'),
config              = require('./nuxt.config.js'),
https               = require('http'),
fs                  = require('fs'),
port                = process.env.NUXT_PORT,
isProd              = (process.env.NODE_ENV === 'production'),
nuxt                = new Nuxt(config);
envMsg              = config.dev ? 'Development' : 'Production',
devUrl              = `https://bloomington.in.gov/adambloomington`,
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
  .createServer(nuxt.render)
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