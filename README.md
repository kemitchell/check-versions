check-versions
==============

[![npm version](https://img.shields.io/npm/v/check-versions.svg)](https://www.npmjs.com/package/check-versions)
[![build status](https://img.shields.io/travis/kemitchell/check-versions.svg)](http://travis-ci.org/kemitchell/check-versions)

Ensure consistent version metadata across JavaScript package managers.


```bash
npm --global install check-versions
check-versions --help

cd YOUR_PACKAGE
check-versions
```

For specific projects, you may wish to

```bash
npm install --save-dev check-version
```

and add `&& check-version` to `scripts.test` in `package.json`.

License
-------

See [the license file in this repository](./LICENSE.md).
