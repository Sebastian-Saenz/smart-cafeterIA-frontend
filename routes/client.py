import os
from flask import Blueprint, request, jsonify, render_template
from pathlib import Path

client_bp = Blueprint("client", __name__)

@client_bp.route("/escribenos", methods=["GET"])
def escribenos():
    return render_template("escribenos.html")
