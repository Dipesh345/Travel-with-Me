from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests

API_KEY = 'your_actual_api_key_here'  # Replace with your real API key

@api_view(['POST'])
def convert_currency_api(request):
    amount = request.data.get('amount')
    from_currency = request.data.get('from_currency')
    to_currency = request.data.get('to_currency')

    if not all([amount, from_currency, to_currency]):
        return Response({'error': 'Missing required fields'}, status=400)

    try:
        url = f'https://v6.exchangerate-api.com/v6/{API_KEY}/pair/{from_currency}/{to_currency}/{amount}'
        response = requests.get(url)
        data = response.json()
        result = data.get('conversion_result')
        return Response({'result': result})
    except Exception as e:
        return Response({'error': str(e)}, status=500)
