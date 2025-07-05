export const fetcher = async (url: string) => {
  if (url.includes("undefined")) return new Promise((resolve) => resolve(null));
  return fetch(url).then((res) => res.json());
};
