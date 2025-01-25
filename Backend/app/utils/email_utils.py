import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Access environment variables
email_user = os.getenv("EMAIL_USER")
email_password = os.getenv("EMAIL_PASSWORD")

# Print environment variables for debugging
print(f"Email User: {email_user}")
print(f"Email Password: {email_password}")

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def send_email(recipient: str, subject: str, body: str):
    sender_email = os.getenv("EMAIL_USER")
    sender_password = os.getenv("EMAIL_PASSWORD")

    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = recipient
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.set_debuglevel(1)  # Enable debug logging
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, recipient, msg.as_string())
        logging.info(f"Email sent to {recipient}")
    except smtplib.SMTPAuthenticationError as auth_error:
        logging.error(f"Authentication failed for {recipient}: {auth_error}")
    except Exception as e:
        logging.error(f"Failed to send email to {recipient}: {str(e)}")

def generate_login_activity_email(name: str, login_time: str) -> str:
    """
    Generates the email body for login activity notifications.
    Args:
        name (str): The name of the user.
        login_time (str): The time of login.
    Returns:
        str: The email body.
    """
    return f"""
    Hi {name},

    This is a confirmation of your login activity on {login_time}.

    If you did not initiate this login, please reset your password immediately or contact our support team.

    Regards,
    One-stop Solution Application Team
    """

print("email_utils.py loaded")