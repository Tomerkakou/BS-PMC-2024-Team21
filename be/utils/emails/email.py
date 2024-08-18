from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from be.utils.emails import verifyAccount,resetPassword,grades_report
from flask import current_app

LOGO_IMAGE = "https://i.ibb.co/1vfq37z/logo.png" 

templates={
    "verifyAccount":verifyAccount.template,
    "resetPassword":resetPassword.template,
    'grades_report':grades_report.template
}

def sendEmail(email,subject,templateName,attachment=None,**kwargs):
    html = templates[templateName]
    kwargs["LOGO_IMAGE"]=LOGO_IMAGE
    kwargs["FRONT_URL"]=current_app.config['FRONT_URL']
    html=html.format(**kwargs)

    message = Mail(
        from_email=current_app.config['SENDGRID_API_EMAIL'],
        to_emails=email,
        subject=subject,
        html_content=html,
    )

    if attachment is not None:
        message.attachment = attachment

    try:
        sg = SendGridAPIClient(current_app.config['SENDGRID_API_KEY'])
        response = sg.send(message)
        return True
    except Exception as e:
        print(e)

