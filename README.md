# npm-project-website

---

**This project is currently in pre-alpha stage.**

This is a tool to generate a static web site from your npm project, to show off things like your README file,
API documentation, test reports, etc.

_By [Brian Mearns](https://github.com/mearns)_

## Development

### Development Cycle

Start a dev server to serve the generated site files:

```console
$ npm run start

> npm-project-website@0.1.0 start /Users/bmearns/sandbox/personal/npm-project-website
> http-server public

Starting up http-server, serving public
Available on:
  http://127.0.0.1:8080
  http://192.168.1.173:8080
  http://10.100.5.22:8080
Hit CTRL-C to stop the server
```

Leave that running, and in a new shell, do this to build the project and generate the static site files:

```console
$ npm run compile && npm run -s run
...
Copied logo file: public/resources/logo.png
Generated page: public/index.html
```

And view the site at http://127.0.0.1:8080/

### Build

```console
$ npm run compile
```

Will compile typescript files into `dist/` and compile the webpack bundles for each page into `public/script/$PAGE_NAME.js`.

### Generate Site

Assumes you have built the project as above.

```console
npm run run
```
