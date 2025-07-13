function oauthSignIn() {
  const redirect_base = document.querySelector('meta[name="redirect-uri"]')
    .getAttribute('content');

  localStorage.removeItem('oauth_state');

  const state = 'random_' + Math.random().toString(36).substr(2);
  console.log('🔐 Generado state desde oauthSignIn:', state);
  localStorage.setItem('oauth_state', state);

  const params = {
    client_id: '401510539727-kmju5p4gsbitskfkvu6q4cmr2a0ht3ng.apps.googleusercontent.com',
    redirect_uri: redirect_base,
    response_type: 'code',
    scope: 'openid email profile',
    include_granted_scopes: 'true',
    state: state
  };
  // Guarda el state para verificar luego
  localStorage.setItem('oauth_state', params.state);

  const url = 'https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams(params);
  window.location = url;
}