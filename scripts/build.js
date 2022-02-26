const esbuild = require('esbuild');
const path = require('path');
const { sassPlugin } = require('esbuild-sass-plugin');
const { htmlPlugin } = require('@craftamap/esbuild-plugin-html');
const { readFile, rm } = require('fs/promises');
const { printBuildResult } = require('./build-utils');
const dayjs = require('dayjs');
const { existsSync } = require('fs');
const dotenv = require('dotenv');

const $rootDir = path.resolve(__dirname, '..');

dotenv.config({ path: path.join($rootDir, '.env') });

const buildEnv = process.env.BUILD_ENV;

async function build () {
  if (existsSync(path.join($rootDir, `dist/${buildEnv}`))) {
    await rm(path.join($rootDir, `dist/${buildEnv}`), { recursive: true, force: true })
  }
  
  const htmlTemplate = await readFile(path.join($rootDir, 'app/index.template.html'));
  const from = dayjs().valueOf();

  const result = await esbuild.build({
    absWorkingDir: $rootDir,
    nodePaths: [process.env.BUILD_SPAGO_OUTPUT],
    bundle: true,
    minify: true,
    entryPoints: ['app/js/index.js'],
    outdir: `dist/${buildEnv}`,
    entryNames: '[name].[hash]',
    metafile: true,
    publicPath: process.env.BUILD_PUBLIC_PATH,
    plugins: [
      sassPlugin(),
      htmlPlugin({
        files: [
          {
            filename: 'index.html',
            entryPoints: ['app/js/index.js', 'app/css/index.sass'],
            htmlTemplate,
          }
        ]
      })
    ]
  });
  printBuildResult(result, dayjs().valueOf() - from);
}

/** entry point */
(async () => {
  try {
    await build();
  }
  catch (err) {
    console.error(err);
    console.log("\n\x1b[31m[ERROR]\x1b[0m Failed to bundle app");
    process.exit(1);
  }
})();