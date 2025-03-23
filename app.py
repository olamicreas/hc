from flask import Flask, render_template, request, redirect
from flask_mail import Mail, Message
import os

# Load configuration from environment variables
app = Flask(__name__)

# Configure Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # cPanel mail server address
app.config['MAIL_PORT'] = 587  # Port for SSL (or 587 for TLS)
#app.config['MAIL_USERNAME'] = os.environ['smtp_email']
#app.config['MAIL_PASSWORD'] = os.environ['smtp_password']  # The password for booking@satoriselfcare.com
app.config['MAIL_DEFAULT_SENDER'] = app.config['MAIL_USERNAME']
app.config['MAIL_USE_TLS'] = True  # Use SSL instead of TLS
app.config['MAIL_USE_SSL'] = False

mail = Mail(app)

# App configurations
app.config['SECRET_KEY'] = 'SECRET_KEY'
app.config['UPLOADED_PHOTOS_DEST'] = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'static/images')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/service', methods=['POST', 'GET'])
def service():
    if request.method == 'POST':
        # Collect form data
        name = request.form.get('name')
        number = request.form.get('number')
        email = request.form.get('email')
        day = request.form.get('day')
        time = request.form.get('time')
        month = request.form.get('month')
        year = request.form.get('year')

        # Subject and recipient email
        sub = f'Booking Confirmation for {name}'
        rm = 'satoriselfcare@gmail.com'  # Replace with your admin or recipient email

        # Render HTML body with template and form data
        html_body = render_template('cmail.html', name=name, day=day, month=month, year=year, time=time)

        try:
            # Create the email message
            msg = Message(subject=sub, sender=os.environ['smtp_email'], recipients=[email,rm])
            msg.html = html_body  # Set the HTML body of the email
            
            # Send the email
            mail.send(msg)

            return render_template('suc.html')  # Success page
        except Exception as e:
            return f'Failed to book appointment: {str(e)}'  # Return error message if email fails to send
    
    return render_template('service.html')  # Render the service page if GET request


@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/test')
def test():
    return render_template('test.html')

if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)
