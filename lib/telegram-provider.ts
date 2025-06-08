import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

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
  return {
    id: "telegram",
    name: "Telegram",
    type: "oauth",
    wellKnown: "https://oauth.telegram.org/.well-known/openid-configuration",
    authorization: {
      url: "https://oauth.telegram.org/auth",
      params: {
        bot_id: options.clientId,
        origin: process.env.NEXTAUTH_URL,
        return_to: `${process.env.NEXTAUTH_URL}/api/auth/callback/telegram`,
        request_access: "write",
      },
    },
    token: {
      url: "https://oauth.telegram.org/access_token",
      async request({ client, params, checks, provider }) {
        const response = await fetch(provider.token.url as string, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client_id: options.clientId,
            client_secret: options.clientSecret,
            code: params.code,
            grant_type: "authorization_code",
            redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/telegram`,
          }),
        });

        const tokens = await response.json();
        return { tokens };
      },
    },
    userinfo: {
      url: "https://api.telegram.org/bot{bot_token}/getMe",
      async request({ tokens, provider }) {
        const response = await fetch(
          `https://api.telegram.org/bot${options.clientSecret}/getMe`
        );
        const data = await response.json();
        
        if (!data.ok) {
          throw new Error("Failed to fetch user info from Telegram");
        }

        return {
          id: data.result.id.toString(),
          name: data.result.username,
          image: `https://t.me/${data.result.username}`,
        };
      },
    },
    profile(profile) {
      return {
        id: profile.id,
        name: profile.username || profile.first_name,
        email: null,
        image: profile.photo_url,
      };
    },
    options,
  };
} 
