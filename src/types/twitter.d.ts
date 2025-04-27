interface Twitter {
    widgets: {
      load: (element?: HTMLElement) => void;
    };
  }
  
  declare global {
    interface Window {
      twttr: Twitter;
    }
  }