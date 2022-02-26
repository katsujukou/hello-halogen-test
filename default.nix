{ pkgs ? import <nixpkgs> {} }:

let
  nodejs = pkgs.nodejs-16_x;
  nodeComps = pkgs.callPackage ./nix/node-composit.nix {};
  easyPS = import ./nix/easy-purescript.nix { inherit pkgs; };
  spagoPkgs = import ./nix/spago-packages.nix { inherit pkgs; };
  gitignore = (import ./nix/gitignore.nix { inherit pkgs; }).gitignoreSource;
  src = gitignore ./.;
in
  pkgs.stdenv.mkDerivation {
    pname = nodeComps.args.name;
    version = nodeComps.args.version;

    inherit src;

    buildInputs = [
      easyPS.purs-0_14_5
      easyPS.zephyr
      spagoPkgs.installSpagoStyle
      spagoPkgs.buildSpagoStyle
      nodejs
    ];

    BUILD_ENV="prod";
    BUILD_SPAGO_OUTPUT="dce-output";
    BUILD_PUBLIC_PATH="/";

    unpackPhase = ''
      cp -ra $src/* ./
      ln -s ${nodeComps.shell.nodeDependencies}/lib/node_modules ./node_modules
      install-spago-style
    '';

    buildPhase = ''
      export PATH="${nodeComps.shell.nodeDependencies}/bin:$PATH"
      build-spago-style "src/**/*.purs" --codegen corefn
      zephyr -f Main.main
      node scripts/build.js
    '';

    installPhase = ''
      mkdir -p $out/var/www
      cp -r dist/prod/* $out/var/www/
    '';
  }