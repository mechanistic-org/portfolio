import os

path = r"C:\Program Files\Upscayl\resources\models"
try:
    files = os.listdir(path)
    for f in files:
        print(f)
except Exception as e:
    print(f"Error: {e}")
