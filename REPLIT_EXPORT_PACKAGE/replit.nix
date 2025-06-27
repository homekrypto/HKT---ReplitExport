{ pkgs }: {
  deps = [
    pkgs.nodejs-20_x
    pkgs.postgresql
    pkgs.openssl
    pkgs.pkg-config
    pkgs.python3
    pkgs.gcc
    pkgs.gnumake
  ];
}