import boto3
import csv
import os
from dotenv import load_dotenv
from pathlib import Path

# カスタムパスの .env.local ファイルを読み込む
project_root = Path(__file__).resolve().parents[1]
load_dotenv(dotenv_path=project_root / ".env.local")

# AWS の設定
dynamodb = boto3.resource(
    'dynamodb',
    region_name=os.getenv("AWS_PRCY_REGION"),
    aws_access_key_id=os.getenv("AWS_PRCY_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("AWS_PRCY_SECRET_KEY")
)

# テーブル名
TABLE_NAME = os.getenv("AWS_DB_USER_TABLE")
table = dynamodb.Table(TABLE_NAME)

# 全ユーザーデータを DynamoDB から取得する関数
def get_all_users():
    response = table.scan()
    data = response['Items']

    while 'LastEvaluatedKey' in response:
        response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        data.extend(response['Items'])

    return data

# データを CSV ファイルとして保存する関数
def save_to_csv(data, filename="aws-users.csv"):
    if not data:
        print("保存するデータがありません。")
        return
    
    # このスクリプトと同じディレクトリに保存する
    current_dir = Path(__file__).resolve().parent
    filepath = current_dir / filename

    all_keys = set()
    for item in data:
        all_keys.update(item.keys())
    all_keys = sorted(all_keys)

    with open(filepath, "w", newline='', encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=all_keys)
        writer.writeheader()
        for item in data:
            writer.writerow(item)

    print(f"{len(data)} 件のユーザーデータを {filepath} に保存しました。")

# メイン処理
if __name__ == "__main__":
    users = get_all_users()
    save_to_csv(users)