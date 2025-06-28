from django.shortcuts import render
from .forms import CurrencyForm
import requests

API_KEY = 'your_api_key_here'  # use an API like exchangerate-api.com

def convert_currency(request):
    result = None
    if request.method == 'POST':
        form = CurrencyForm(request.POST)
        if form.is_valid():
            amount = form.cleaned_data['amount']
            from_currency = form.cleaned_data['from_currency']
            to_currency = form.cleaned_data['to_currency']
            url = f'https://v6.exchangerate-api.com/v6/{API_KEY}/pair/{from_currency}/{to_currency}/{amount}'
            response = requests.get(url)
            data = response.json()
            result = data.get('conversion_result', 'Error')
    else:
        form = CurrencyForm()
    
    return render(request, 'converter/index.html', {'form': form, 'result': result})
