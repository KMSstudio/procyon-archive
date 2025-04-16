# Procyon DB Schema Documentation

이 문서는 Procyon 시스템에서 사용되는 주요 Firestore 기반 데이터베이스 스키마를 정의하기 위해 작성되었습니다.  
문서 최신화: 2025-04-17 

---

## Procyon_Page_DB

Procyon의 게시글 텍스트 데이터베이스입니다. 사용자가 업로드한 마크다운 파일의 메타데이터를 Firestore에 저장합니다.  
마크다운 파일을 Google Drive에 저장되며, Google Drive에 업로드된 해당 파일의 id를 driveId로 기록합니다.

### JSON Schema
```json
{
  "id": "string",
  "title": "string",
  "uploaderEmail": "string",
  "uploaderName": "string",
  "lastModifyerEmail": "string",
  "lastModifyerName": "string",
  "driveId": "string",
  "createDate": "string (ISO)"
}
```

### Fields
| 필드명              | 타입    | 설명 |
|---------------------|---------|------|
| `id`                | string  | 고유 ID. UUID 기반으로 생성되며 12자리. |
| `title`             | string  | 게시글 제목 |
| `uploaderEmail`     | string  | 작성자 이메일 |
| `uploaderName`      | string  | 작성자 이름 |
| `lastModifyerEmail` | string  | 마지막 수정자 이메일 |
| `lastModifyerName`  | string  | 마지막 수정자 이름 |
| `driveId`           | string  | Google Drive 내 마크다운 파일 ID |
| `createDate`        | string  | 생성 시각 (ISO 8601) |

---

## 2. Procyon_Log_DB

로그 메시지를 기록하는 Firestore 컬렉션입니다. 내부 로그 기록 시스템이 사용합니다.

### JSON Schema
```json
{
  "timestamp": "number",
  "timestring": "string (ISO)",
  "type": "string",
  "msg": "string"
}
```

### Fields
| 필드명       | 타입     | 설명 |
|--------------|----------|------|
| `timestamp`  | number   | 로그 발생 시간의 UNIX timestamp (ms) |
| `timestring` | string   | ISO 포맷의 시간 문자열 |
| `type`       | string   | 로그 종류 (예: LOG, INFO, ERROR) |
| `msg`        | string   | 로그 메시지 내용 |

---

## Procyon_User_DB

사용자 정보를 저장하는 Firestore 컬렉션입니다. 로그인 시 자동 생성/갱신됩니다.

### JSON Schema
```json
{
  "email": "string",
  "lastAccessDate": "string (YYYY-MM-DD HH)",
  "lastContributionDate": "string (YYYY-MM-DD HH)",
  "isAdmin": "boolean",
  "studentName": "string",
  "studentPosition": "string",
  "studentMajor": "string"
}
```

### Fields
| 필드명               | 타입     | 설명 |
|----------------------|----------|------|
| `email`              | string   | 사용자 이메일 (문서 ID로도 사용됨) |
| `lastAccessDate`     | string   | 마지막 접속 시각 (한국시간 기준, 시간 단위까지) |
| `lastContributionDate` | string | 마지막 기여 시각 |
| `isAdmin`            | boolean  | 관리자 여부 |
| `studentName`        | string   | 학생 이름 |
| `studentPosition`    | string   | 직책 |
| `studentMajor`       | string   | 학과명 |

---

## Procyon_Book_DB

도서 메타데이터를 저장하는 Firestore 기반 컬렉션입니다. 표지는 AWS S3, 본문은 Google Drive에 저장되며, 그 위치 정보를 포함합니다. 표지를 AWS S3에 저장하는 이유는, 이미지의 url 값을 얻어야 하기 때문입니다. Google Drive는 이미지의 url을 제공하고 있지 않습니다.

### JSON Schema
```json
{
  "id": "string",
  "title": "string",
  "edition": "string",
  "author": "string",
  "cover": "string",
  "content": "string",
  "coverFileName": "string",
  "contentFileName": "string",
  "tags": "string[]",
  "mainTags": "string[]",
  "createdAt": "string (ISO)"
}
```

### FIelds
| 필드명           | 타입      | 설명 |
|------------------|-----------|------|
| `id`             | string    | 도서 고유 ID (UUID 12자리) |
| `title`          | string    | 도서 제목 |
| `edition`        | string    | 판본 (예: 3rd Edition) |
| `author`         | string    | 저자 이름 |
| `cover`          | string    | AWS S3에 저장된 표지 이미지 URL |
| `content`        | string    | Google Drive에 저장된 도서 본문 URL |
| `coverFileName`  | string    | 표지 파일 이름 (`{id}.ext`) |
| `contentFileName`| string    | 본문 파일 이름 (`{id}.ext`) |
| `tags`           | string[]  | 사용자 정의 태그 리스트 |
| `mainTags`       | string[]  | 주요 태그 (coreTag.json 기준) |
| `createdAt`      | string    | 등록 시각 (KST, ISO 8601) |


---

Written By Sinsiw in Procyon