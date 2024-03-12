{
  description = "mkdocs";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-23.11";
  };

  outputs = { self , nixpkgs ,... }:
  let
    system = "x86_64-linux";
  in {
    devShells."${system}".default =
    let
      pkgs = import nixpkgs {
        inherit system;
      };
    in pkgs.mkShell {
      #LD_LIBRARY_PATH = "${pkgs.stdenv.cc.cc.lib}/lib";
      packages = with pkgs; [
        go
        hugo
      ];
    };
  };
}
