import { MetaMaskInpageProvider,createExternalExtensionProvider } from "@metamask/providers";

declare global {
  interface Window{
    ethereum?:MetaMaskInpageProvider
  }
}