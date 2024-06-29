import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from utils.emails.verifyAccount import template


templates={
    "verifyAccount":template
}

def sendEmail(email,subject,templateName,**kwargs):
    print(kwargs)
    html = templates[templateName]
    html=html.format(**kwargs)

    print(html)
    message = Mail(
        from_email=os.getenv('SENDGRID_API_EMAIL'),
        to_emails=email,
        subject=subject,
        html_content=html)
    
    try:
        sg = SendGridAPIClient(os.getenv('SENDGRID_API_KEY'))
        response = sg.send(message)
        return True
    except Exception as e:
        print(e.message)