export {}

declare global {
  interface Window {
    Kakao: any
    LoginChannel: any
  }

  interface Navigator {
    share?: (data?: {
      title?: string
      text?: string
      url?: string
    }) => Promise<void>
  }
}
