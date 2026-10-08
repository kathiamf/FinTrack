import { HttpError, handle, json, readBody, requireUser } from '../_shared/http.ts';
import { createConnectToken, getApiKey } from '../_shared/pluggy.ts';

Deno.serve(
  handle(async (req) => {
    const { user } = await requireUser(req);
    const body = await readBody(req);
    const redirect = body.redirect_uri;
    if (
      redirect !== undefined &&
      (typeof redirect !== 'string' || redirect.length > 300)
    ) {
      throw new HttpError(400, 'redirect_uri inválido.');
    }
    const apiKey = await getApiKey();
    const connectToken = await createConnectToken(apiKey, {
      clientUserId: user.id,
      ...(redirect ? { oauthRedirectUri: redirect } : {}),
    });
    return json({ connect_token: connectToken });
  }),
);
