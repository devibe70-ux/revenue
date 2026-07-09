// Native implementation of AdMob
import mobileAdsInternal, { 
  AdsConsent as AdsConsentInternal, 
  BannerAd as BannerAdInternal, 
  BannerAdSize as BannerAdSizeInternal, 
  TestIds as TestIdsInternal,
  InterstitialAd as InterstitialAdInternal,
  AdEventType as AdEventTypeInternal
} from 'react-native-google-mobile-ads';

export const mobileAds = mobileAdsInternal;
export const AdsConsent = AdsConsentInternal;
export const BannerAd = BannerAdInternal;
export const BannerAdSize = BannerAdSizeInternal;
export const TestIds = TestIdsInternal;
export const InterstitialAd = InterstitialAdInternal;
export const AdEventType = AdEventTypeInternal;
