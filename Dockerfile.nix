{ pkgs ? import <nixpkgs> {}}:
let
  inherit ((pkgs.callPackage ./nix/node-comp.nix {}).args) name version;
  app = import ./default.nix { inherit pkgs; };
in
  pkgs.dockerTools.buildImage {
    inherit name;
    tag = version;
    contents = app;
  }