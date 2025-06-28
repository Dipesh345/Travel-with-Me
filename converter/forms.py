from django import forms

CURRENCY_CHOICES = [
    ('USD', 'US Dollar'),
    ('EUR', 'Euro'),
    ('INR', 'Indian Rupee'),
    ('GBP', 'British Pound'),
]

class CurrencyForm(forms.Form):
    amount = forms.FloatField(label="Amount", min_value=0)
    from_currency = forms.ChoiceField(choices=CURRENCY_CHOICES)
    to_currency = forms.ChoiceField(choices=CURRENCY_CHOICES)
