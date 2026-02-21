FROM mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm

ARG RUST_TOOLCHAIN=1.91.1

# deps comuns
RUN apt-get update && apt-get install -y --no-install-recommends \
  build-essential \
  curl \
  git \
  ca-certificates \
  pkg-config \
  && rm -rf /var/lib/apt/lists/*

# Rust no usuário node (evita permissão zoada)
USER node
ENV HOME=/home/node
ENV CARGO_HOME=/home/node/.cargo
ENV RUSTUP_HOME=/home/node/.rustup
ENV PATH="/home/node/.cargo/bin:${PATH}"

RUN curl https://sh.rustup.rs -sSf | sh -s -- -y --default-toolchain ${RUST_TOOLCHAIN} \
  && cargo --version && rustc --version

RUN cargo install wasm-pack

WORKDIR /home/app