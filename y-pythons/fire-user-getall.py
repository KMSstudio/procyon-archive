import firebase_admin
from firebase_admin import credentials, firestore
import os

import csv
import json
from dotenv import load_dotenv
from pathlib import Path

# 上の階層にある .env.local ファイルを読み込む
project_root = Path(__file__).resolve().parents[1]
load_dotenv(dotenv_path=project_root / ".env.local")

# Firebase Admin を初期化
service_account_info = json.loads(os.environ.get("FIREBASE_SERVICE_ACCOUNT", "{}"))
if not firebase_admin._apps:
    cred = credentials.Certificate(service_account_info)
    firebase_admin.initialize_app(cred)

# Firestore クライアントを取得
db = firestore.client()
collection_name = os.environ.get("AWS_DB_USER_TABLE")

# Firestore からすべてのユーザーデータを取得する関数
def get_all_users():
    docs = db.collection(collection_name).stream()
    users = []
    for doc in docs:
        data = doc.to_dict()
        data["email"] = doc.id  # ドキュメントIDを email として追加
        users.append(data)
    return users

# データを CSV ファイルとして保存する関数
def save_to_csv(data, filename="procyon-users.csv"):
    if not data:
        print("保存するデータがありません。")
        return

    # このスクリプトと同じディレクトリにファイルを保存
    current_dir = Path(__file__).resolve().parent
    filepath = current_dir / filename

    # すべてのキー（カラム名）を収集
    all_keys = set()
    for item in data:
        all_keys.update(item.keys())
    all_keys = sorted(all_keys)

    # CSV ファイルに書き込む
    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=all_keys)
        writer.writeheader()
        for item in data:
            writer.writerow(item)

    print(f"{len(data)}名のユーザーデータを {filepath} に保存しました。")

# メイン処理
if __name__ == "__main__":
    users = get_all_users()
    save_to_csv(users)