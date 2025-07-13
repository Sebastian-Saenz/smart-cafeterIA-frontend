from flask import Flask, render_template, session
from config import Config
from routes.auth import auth_bp
from routes.client import client_bp
from flask_cors import CORS


config = Config()


def create_app():
    app = Flask(
        __name__,
        template_folder="templates",
        static_folder="static",
    )

    app.config.from_object(Config)

    CORS(app, origins="*", supports_credentials=True)

    # Registrar blueprints
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(client_bp, url_prefix="/client")

    @app.route("/")
    def index():
        return render_template("index.html")

    @app.context_processor
    def inject_user():
        user = session.get("user")
        email = None
        if user:
            email = user.get("email")
        return dict(user=user, user_email=email)

    return app


# if __name__ == "__main__":
#     app = create_app()
#     app.run(host="0.0.0.0", port=8888)

app = create_app()