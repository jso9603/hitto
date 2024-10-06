export {};

declare global {
  interface Window {
    Kakao: any;
    adsbygoogle: any;
  }

  interface Navigator {
    share?: (data?: { title?: string; text?: string; url?: string }) => Promise<void>;
  }
}