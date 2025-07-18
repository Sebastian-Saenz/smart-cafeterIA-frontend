
(function () {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const stateOut = localStorage.getItem('oauth_state');

    console.log({ code, state, stateOut });

    if (code && state === stateOut) {
        localStorage.removeItem('oauth_state');

        fetch('/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, state: state })
        })
            .then(res => res.json())
            .then(data => {
                console.log('Tokens recibidos:', data);
                window.history.replaceState({}, document.title, '/');
                window.location = '/';
            });
    } else {
        console.error('Codigo o state invlido');
    }
})();
