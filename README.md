# Origins

### Dependencies

- Node + NPM
- Ruby + Sass

### Setup

Install development dependencies for the Gruntfile:

```bash
npm install
```

Start working:

```bash
grunt work
```

### Testing

To run the tests, simply do:

```bash
grunt test
```

### Distribution

```bash
grunt release
```

- Bumps the version to the final, e.g. `1.0.0-beta` to `1.0.0`
- Tags a release
- Freshly compiles and optimizes code
- Creates zip and tarball binaries
- Prints instructions to push and upload it to GitHub
- Bumps the patch version, e.g. `1.0.0` to `1.0.1-beta`

### Development

##### Steps for adding a page

A page is a view that can be navigated to and is shown in the `origins.app.main` region.

- Create a new module under `src/js/origins/pages`
- Add the module to the `src/js/origins/pages.js` dependency array
- Create a template under `src/templates/pages`
- Add the template name to `src/js/origins/templates.js` dependency array
- Add route and handler to `src/js/origins/router.js`

##### Steps for adding a model/collection

- Create a new module under `src/js/origins/models`
- Add the module to the `src/js/origins/models.js` dependency array
