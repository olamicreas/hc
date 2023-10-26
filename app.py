from flask import Flask, render_template, request, flash, redirect, url_for, session, abort, jsonify, send_file
import os
import requests
from flask_mail import Mail, Message
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, validators, Form, TextAreaField
from wtforms.validators import DataRequired, Length, EqualTo
basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)



 





app.config["DEBUG"] = True


app.config["SQLALCHEMY_POOL_RECYCLE"] = 299
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'SECRET_KEY'
app.config['UPLOADED_PHOTOS_DEST'] = os.path.join(basedir, 'static/images')



class Phrase(Form):
    phrase = TextAreaField("", validators=[DataRequired(message='Input first_name')])

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/services')
def services():
    return render_template('service.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')



if __name__ == '__main__':
    app.run(host="localhost", port='5000', debug=True)