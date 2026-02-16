import json

doc = "0123456789{\"a\":1}xxxxx"
# JSON starts at index 10. Ends at 18.
# expected raw_decode(doc, 10) -> ({'a':1}, 18)

try:
    decoder = json.JSONDecoder()
    obj, end = decoder.raw_decode(doc, 10)
    print(f"Start index: 10")
    print(f"End index return: {end}")
    print(f"Calculation 'start + end': {10 + end}")
    print(f"Character at end index: {doc[end] if end < len(doc) else 'EOF'}")
except Exception as e:
    print(e)
