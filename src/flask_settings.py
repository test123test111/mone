#!/usr/bin/env python
#encoding=utf-8
import os
os.environ['DJANGO_SETTING_MODULE']='models.zz.settings'
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "models.zz.settings")
from views.worksheet import *
from views.release_apply import *
from views.user import *
from flask import Flask
def create_app():
    app = Flask(__name__, static_url_path='/static')
    app.secret_key = 'super secret string'
    app.register_blueprint(user, url_prefix='')
    app.register_blueprint(worksheet, url_prefix='/worksheet')
    app.register_blueprint(release_apply, url_prefix='/release_apply')
    return app