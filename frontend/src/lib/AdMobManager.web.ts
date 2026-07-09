// Web stub for AdMob to prevent bundler crashes
export const mobileAds = null;
export const AdsConsent = null;
export const BannerAd = null;
export const BannerAdSize = {};
export const TestIds = {};
export const InterstitialAd = {
  createForAdRequest: () => ({
    load: () => {},
    show: () => {},
    addAdEventListener: () => (() => {}),
  })
};
export const AdEventType = {
  LOADED: 'loaded',
  ERROR: 'error',
  CLOSED: 'closed',
};
