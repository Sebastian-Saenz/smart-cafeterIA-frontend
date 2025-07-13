function oauthSignIn() {
  
  localStorage.removeItem('oauth_state');

  const google_client_id = document.querySelector('meta[name="google_client_id"]').content;
  const redirect_base = document.querySelector('meta[name="redirect-uri"]')
    .getAttribute('content');

  const state = 'random_' + Math.random().toString(36).substr(2);
  localStorage.setItem('oauth_state', state);
  console.log('🔐 Generado state desde oauthSignIn:', state);
  console.log('Guardado como: ', localStorage.getItem('oauth_state'))

  const params = {
    client_id: google_client_id,
    redirect_uri: redirect_base,
    response_type: 'code',
    scope: 'openid email profile',
    include_granted_scopes: 'true',
    state: state
  };

  const url = 'https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams(params);
  window.location = url;
}