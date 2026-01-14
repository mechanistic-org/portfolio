import os

base_path = r"D:\GitHub\eriknorris-workspace\__WORKOUT_data_working-copy"
file_path = os.path.join(base_path, "PolarPersonalSettings.txt")

print(f"Checking: {file_path}")
if os.path.exists(file_path):
    print("File exists!")
    try:
        with open(file_path, "r", errors='ignore') as f:
            print(f.read(200))
    except Exception as e:
        print(f"Error reading: {e}")
else:
    print("File DOES NOT exist.")
    print("Listing dir:")
    try:
        print(os.listdir(base_path))
    except Exception as e:
        print(f"Error listing: {e}")
