from flask import (
    Blueprint,
    request,
    current_app,
    jsonify,
    render_template,
    session,
    redirect,
    url_for,
)
from google_auth_oauthlib.flow import Flow
import google.oauth2.credentials
import googleapiclient.discovery

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.route("/google", methods=["POST"])
def google_auth():
    data = request.get_json()
    code = data.get("code")
    state_in = data.get("state")
    
    if not code or not state_in:
        return jsonify({"error": "No code o state"}), 400

    session["oauth_state"] = state_in

    # 1. Creamos el dict client_config a partir de nuestro config
    client_config = {
        "web": {
            "client_id": current_app.config["GOOGLE_CLIENT_ID"],
            "client_secret": current_app.config["GOOGLE_CLIENT_SECRET"],
            "redirect_uris": [current_app.config["REDIRECT_URI"]],
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
        }
    }

    #2. Inicializamos Flow desde el client_config
    flow = Flow.from_client_config(
        client_config,
        scopes=current_app.config["SCOPES"]
    )
    flow.redirect_uri = current_app.config["REDIRECT_URI"]

    if session.get("oauth_state") != state_in:
        return jsonify({"error": "state no coincide"}), 400

    # 3. fetch_token
    flow.fetch_token(code=code)
    creds = flow.credentials

    # 4. Construimos el servicio OAuth2 y pedimos el perfil
    oauth2 = googleapiclient.discovery.build("oauth2", "v2", credentials=creds)
    info = oauth2.userinfo().get().execute()

    # 5. Guardamos credenciales y user-info en sesión
    session["credentials"] = {
        "token": creds.token,
        "refresh_token": creds.refresh_token,
        "token_uri": creds.token_uri,
        "client_id": creds.client_id,
        "client_secret": creds.client_secret,
        "scopes": creds.scopes,
    }
    session["user"] = {
        "email": info.get("email"),
        "name": info.get("name"),
        "picture": info.get("picture"),
    }

    return jsonify(
        {
            "token": creds.token,
            "refresh_token": creds.refresh_token,
            "expires_in": creds.expiry.timestamp(),
            "user": session["user"],
        }
    )

@auth_bp.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("index"))
