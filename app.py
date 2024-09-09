from flask import Flask, render_template, request, flash, redirect, url_for, session, abort, jsonify, send_file
import os
import requests

from flask_mail import Mail, Message

basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
mail = Mail()
mail.init_app(app)



app.config["DEBUG"] = True


app.config["SQLALCHEMY_POOL_RECYCLE"] = 299
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'SECRET_KEY'
app.config['UPLOADED_PHOTOS_DEST'] = os.path.join(basedir, 'static/images')
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'olamicreas@gmail.com'
app.config['MAIL_PASSWORD'] = 'nsnqtozvdzltoqhh'
#os.environ['smtpp']
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_DEFAULT_SENDER'] = 'olamicreas@gmail.com'
mail = Mail(app)




app.config["DEBUG"] = True


app.config["SQLALCHEMY_POOL_RECYCLE"] = 299
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'SECRET_KEY'
app.config['UPLOADED_PHOTOS_DEST'] = os.path.join(basedir, 'static/images')




@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/service', methods={'POST', 'GET'})
def service():
    if request.method == 'POST':
        name = request.form.get('name')
        number = request.form.get('number')
        email = request.form.get('email')
        day = request.form.get('day')  # Receive selected day
        time = request.form.get('time')  # Receive selected time
        month = request.form.get('month')
        year = request.form.get('year')
        # Format the body of the email
        body = f"""
        Name: {name}
        Phone: {number}
        Email: {email}
        Appointment requested on {day}/{month}/{year} at {time}
        """

        # Send the email
        msg = Message(subject='Booking details', recipients=['satoriselfcare@gmail.com'], body=body)
        mail.send(msg)
        return render_template('suc.html')

    return render_template('service.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/test')
def test():
    return render_template('test.html')


if __name__ == '__main__':
    app.run(host="localhost", port='5000', debug=True)
