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

# Firestore 초기화
db = firestore.client()
user_collection = db.collection("Procyon_User_DB")

# 줄마다 정리
def sanitize(text):
    return text.strip().replace('\u200b', '').replace('\ufffd', '') if isinstance(text, str) else ''

# CSV 파일 경로
csv_path = "aws-users.csv"

# 사용자 업로드
def upload_users():
    users = []
    with open(csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            email = sanitize(row.get("email", ""))
            if not email:
                continue

            data = {
                "isAdmin": row.get("isAdmin", "").lower() == "true",
                "lastAccessDate": sanitize(row.get("lastAccessDate", "")),
                "lastContributionDate": sanitize(row.get("lastContributionDate", "")),
                "studentMajor": sanitize(row.get("studentMajor", "")),
                "studentName": sanitize(row.get("studentName", "")),
                "studentPosition": sanitize(row.get("studentPosition", "")),
            }

            users.append((email, data))

    print(f"총 {len(users)}명의 사용자 업로드 시작")

    for email, data in users:
        try:
            user_collection.document(email).set(data, merge=True)
            print(f"업로드 완료: {email}")
        except Exception as e:
            print(f"오류 발생: {email}", e)

    print("모든 사용자 업로드 완료")

if __name__ == "__main__":
    upload_users()