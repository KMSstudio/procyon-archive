import firebase_admin
from firebase_admin import credentials, firestore
import os

import csv
import json
from dotenv import load_dotenv
from pathlib import Path

# Load .env.local from parent directory
project_root = Path(__file__).resolve().parents[1]
load_dotenv(dotenv_path=project_root / ".env.local")

# Firebase Admin を初期化
service_account_info = json.loads(os.environ.get("FIREBASE_SERVICE_ACCOUNT", "{}"))
if not firebase_admin._apps:
    cred = credentials.Certificate(service_account_info)
    firebase_admin.initialize_app(cred)

# Firestore クライアントを取得
db = firestore.client()
collection_name = os.environ.get("FIRE_DB_BOOK_TABLE")

# Get all book documents from Firestore
def get_all_books():
    books = []
    docs = db.collection(collection_name).stream()
    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id
        books.append(data)
    return books

# Save book data to CSV
def save_to_csv(data, filename="procyon-books.csv"):
    if not data:
        print("No data to save.")
        return

    current_dir = Path(__file__).resolve().parent
    filepath = current_dir / filename

    all_keys = set()
    for item in data:
        all_keys.update(item.keys())
    all_keys = sorted(all_keys)

    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=all_keys)
        writer.writeheader()
        for item in data:
            writer.writerow(item)

    print(f"{len(data)} books saved to {filepath}")

# Main
if __name__ == "__main__":
    books = get_all_books()
    save_to_csv(books)