declare global {
  interface BigInt {
    toJSON(): number;
  }
}

export {};
