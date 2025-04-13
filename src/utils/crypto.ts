import { stringToBytes, keccak256 } from "viem";

const hashString = (input: string): `0x${string}` => {
  const bytes = stringToBytes(input);
  // Hash the byte array using keccak256
  const hash = keccak256(bytes);
  return hash;
};

export { hashString };
