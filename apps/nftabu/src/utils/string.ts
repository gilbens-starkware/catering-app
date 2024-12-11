/// A function to create a displayable address string. For example, "0x1234...5678".
export const truncateAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
