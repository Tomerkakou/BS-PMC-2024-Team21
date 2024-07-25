
from be.models.Token import TokenTypeEnum


def test_token_email(admin,token_email):
    assert token_email.user==admin
    assert token_email.type==TokenTypeEnum.VerifyEmail
    assert token_email in admin.tokens

def test_token_password(admin,token_password):
    assert token_password.user==admin
    assert token_password.type==TokenTypeEnum.ResetPassword
    assert token_password in admin.tokens

def test_tokens_id(token_email,token_password):
    assert token_email.token!=token_password.token