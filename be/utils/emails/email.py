import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from utils.emails import verifyAccount,resetPassword

LOGO_IMAGE = "https://i.ibb.co/wzMsZts/image-1.png" 

FRONT_URL=os.getenv("FRONT_URL")

templates={
    "verifyAccount":verifyAccount.template,
    "resetPassword":resetPassword.template
}

def sendEmail(email,subject,templateName,**kwargs):
    html = templates[templateName]
    kwargs["LOGO_IMAGE"]=LOGO_IMAGE
    kwargs["FRONT_URL"]=FRONT_URL
    html=html.format(**kwargs)

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

