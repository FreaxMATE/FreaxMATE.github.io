{
  description = "Personal website: pandoc + make";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs, ... }:
  let
    system = "x86_64-linux";
    pkgs = import nixpkgs { inherit system; };
  in {
    devShells."${system}".default = pkgs.mkShell {
      packages = with pkgs; [
        pandoc
        gnumake
        nodejs
        python3
        texliveMedium   # lualatex, tcolorbox, microtype, fontspec
      ];
    };
  };
}
