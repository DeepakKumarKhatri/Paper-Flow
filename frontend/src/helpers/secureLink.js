import { encryptLink } from "../helpers/hashing";
export const secureLink = (url) => {
  const securedLink = encryptLink(url);
  return securedLink;
};
