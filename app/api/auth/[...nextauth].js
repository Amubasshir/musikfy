import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import fetch from 'node-fetch';

const scopes = [
  'user-read-email',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-read-currently-playing',
  'user-modify-playback-state',
].join(',');

const params = {
  scope: scopes,
};

const LOGIN_URL =
  'https://accounts.spotify.com/authorize?' +
  new URLSearchParams(params).toString();

async function refreshAccessToken(token) {
  //  ! refreshing access token
  const params = new URLSearchParams(params);
  params.append('grand_type', 'refresh_token');
  params.append('refresh_token', token.refreshToken);
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization:
        'Basic ' +
        new Buffer.from(
          process.env.SPOTIFY_CLIENT_ID +
            ':' +
            process.env.SPOTIFY_CLIENT_SECRET
        ).toString('base64'),
    },
    body: params,
  });
  const data = await response.json();
  return {
    accessToken: data.access_token,
    token_type: 'Bearer',
    scope: 'user-read-private user-read-email',
    accessTokenExpires: Date.now() + data.expires_in * 1000,
    refresh_token: data.refresh_token ?? token.refreshToken,
  };
}
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at;
        return token;
      }

      if (Date.now() < token.accessTokenExpires * 1000) {
        return token;
      }
      return refreshAccessToken(token);
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

export default NextAuth(authOptions);
