function sizing(b, offset = 2) {
  const unit = ['M', 'K', '', 'm', 'u', 'n'];
  let idx = offset - 2;
  if (b >= 1000000) {
    return [(b/1000000).toFixed(2), unit[idx]];
  }
  idx++;
  if (b >= 1000) {
    return [(b/1000).toFixed(2), unit[idx]];
  }
  idx++;
  if (b >= 1) {
    return [(b), unit[idx]];
  }
  idx++;
  return [(b*1000).toFixed(2), unit[idx]];
}

module.exports = {
  printBuildResult (result, buildTime) {
    console.log("\n\x1b[1;34m[Build Info]\x1b[0m");
    let sizelog = "";
    let totalSize = 0;
    Object.keys(result.metafile.outputs).forEach((outFile) => {
      const info = result.metafile.outputs[outFile];
      const [size, sizeU] = sizing(info.bytes)
      totalSize += info.bytes;
      sizelog += `    - ${outFile} ... \x1b[1;32m${size} ${sizeU === "" ? "byte" : sizeU+"B"}\x1b[0m` + "\n";
    })
    const [tsize, tunit] = sizing(totalSize)
    console.log(`\x1b[33m  ✔ Total bundle size\x1b[0m: ... \x1b[1;32m${tsize} ${tunit}B\x1b[0m`);
    console.log(sizelog)
    console.log(`\x1b[33m  ✔ Total bundle time\x1b[0m ... \x1b[1;32m${buildTime} msec\x1b[0m`);
  },

  spagoSays: (level) => (mes) => {
    const color = ((level) => {
      if (level === "error") return "31";
      else if (level === "warn") return "33";
      else if (level === "comment") return "32";
      return "34"; 
    })(level);

    return `\x1b[${color}m spago |\x1b[0m ` + mes
  },
}