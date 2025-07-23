// Типы определены локально, чтобы избежать ошибки импорта
export interface OAuthConfig<T> {
  id: string;
  name: string;
  type: string;
  version?: string;
  scope?: string;
  params?: Record<string, any>;
  accessTokenUrl?: string;
  requestTokenUrl?: string;
  authorizationUrl?: string;
  profileUrl?: string;
  profile?: (profile: T) => any;
  clientId?: string;
  clientSecret?: string;
  protection?: string;
}
export interface OAuthUserConfig<T> {
  clientId: string;
  clientSecret: string;
  profile?: (profile: T) => any;
}

export interface TelegramProfile {
  id: string;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export default function TelegramProvider<P extends TelegramProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  const baseUrl = 'https://fruity-forks-greet.loca.lt';
  
  return {
    id: "telegram",
    name: "Telegram",
    type: "oauth",
    authorizationUrl: "https://oauth.telegram.org/auth",
    profile(profile) {
      return {
        id: profile.id,
        name: profile.username || profile.first_name,
        email: null,
        image: profile.photo_url,
      };
    },
  };
} 
