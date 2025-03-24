import firebase_admin
from firebase_admin import credentials, firestore
import csv
import json
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env.local from parent directory
project_root = Path(__file__).resolve().parents[1]
load_dotenv(dotenv_path=project_root / ".env.local")

# Initialize Firebase
service_account_info = json.loads(os.environ.get("FIREBASE_SERVICE_ACCOUNT", "{}"))
if not firebase_admin._apps:
    cred = credentials.Certificate(service_account_info)
    firebase_admin.initialize_app(cred)

db = firestore.client()
collection_name = "Procyon_Book_DB"

# Upload books from CSV to Firestore
def upload_books_from_csv(csv_filename="aws-books.csv"):
    current_dir = Path(__file__).resolve().parent
    filepath = current_dir / csv_filename

    if not filepath.exists():
        print(f"File not found: {filepath}")
        return

    with open(filepath, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        count = 0
        for row in reader:
            book_id = row.get("id")
            if not book_id:
                print("Skipped row with no 'id'")
                continue

            # Clean up empty strings to None
            cleaned_data = {
                key: (value if value.strip() != "" else None)
                for key, value in row.items()
            }

            try:
                db.collection(collection_name).document(book_id).set(cleaned_data)
                count += 1
            except Exception as e:
                print(f"Error uploading book ID {book_id}: {e}")

        print(f"{count} books uploaded to Firestore collection '{collection_name}'")

# Main
if __name__ == "__main__":
    upload_books_from_csv()