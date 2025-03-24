import boto3
import csv
import os
from dotenv import load_dotenv
from pathlib import Path

# Load .env.local from parent directory
project_root = Path(__file__).resolve().parents[1]
load_dotenv(dotenv_path=project_root / ".env.local")

# AWS 설정
dynamodb = boto3.resource(
    'dynamodb',
    region_name=os.getenv("AWS_PRCY_REGION"),
    aws_access_key_id=os.getenv("AWS_PRCY_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("AWS_PRCY_SECRET_KEY")
)

TABLE_NAME = os.getenv("AWS_DB_BOOK_TABLE")
table = dynamodb.Table(TABLE_NAME)

# DynamoDB에서 모든 책 데이터 가져오기
def get_all_books():
    response = table.scan()
    data = response['Items']

    while 'LastEvaluatedKey' in response:
        response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        data.extend(response['Items'])

    return data

# CSV로 저장
def save_to_csv(data, filename="aws-books.csv"):
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

# 메인 실행
if __name__ == "__main__":
    books = get_all_books()
    save_to_csv(books)