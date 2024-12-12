/// A prefix to be added to the src path of resources (images, etc.) in order to correctly load them.
/// Production mode is when deploying the app to a server, github pages in our case.
export const SrcPrefix =
  import.meta.env.MODE === 'production' ? '/nftabu-app' : '';