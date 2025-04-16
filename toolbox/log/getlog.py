import firebase_admin
from firebase_admin import credentials, firestore
import os
import json
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from .env.local in the project root
project_root = Path(__file__).resolve().parents[2]
load_dotenv(dotenv_path=project_root / ".env.local")

def get_text_logs():
    # Initialize Firebase Admin SDK
    service_account_info = json.loads(os.environ.get("FIREBASE_SERVICE_ACCOUNT", "{}"))
    cred = credentials.Certificate(service_account_info)
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)

    db = firestore.client()
    collection = os.environ["FIRE_DB_LOG_TABLE"]

    # Retrieve logs ordered by timestamp
    logs = db.collection(collection).order_by("timestamp").stream()

    result = []
    for entry in logs:
        data = entry.to_dict()
        if "강명석" in data.get("msg", ""): continue
        timestr = data.get("timestring", "UNKNOWN_TIME")
        logtype = data.get("type", "UNKNOWN")
        msg = data.get("msg", "")
        result.append(f"[{timestr}] {logtype}: {msg}")

    return result

if __name__ == "__main__":
    logs = get_text_logs()

    # Get current time and create filename
    now = datetime.now()
    filename = now.strftime("%Y-%m-%d-%H-%M") + ".log"

    # Save log file in the same directory as this script
    output_path = Path(__file__).resolve().parent / filename

    with open(output_path, "w", encoding="utf-8") as f:
        for line in logs:
            f.write(line + "\n")