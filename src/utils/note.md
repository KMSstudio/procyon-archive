# Utils

## 전체 요약 (파일별 역할)
| 파일 경로 | 역할 요약 |
|-----------|-----------|
| `book/delete.js` | 도서 삭제 처리. Firestore 및 관련 파일(S3, Drive) 정리 포함 |
| `book/driveUtils.js` | Google Drive 및 AWS S3와의 상호작용 기능 제공 |
| `book/modify.js` | 도서 정보 수정 처리 (cover, content 제외) |
| `book/regist.js` | 도서 등록 처리. UUID 생성부터 DB 등록까지 전체 흐름 수행 |
| `database/bookDB.js` | Firestore 기반 도서 데이터 처리 전반 (조회, 생성, 수정, 삭제) |
| `database/userDB.js` | Firestore 기반 사용자 데이터 처리 전반 (조회, 저장, 수정 등) |
| `drive/export.js` | Google Drive 파일 다운로드 처리 (Google Docs 변환 포함) |
| `drive/jebo.js` | 제보 업로드 처리. 폴더 생성, 파일 업로드, 설명 저장 수행 |
| `drive/show.js` | Google Drive 폴더의 파일 목록 조회 및 정렬 |
| `auth.js` | 세션 기반 사용자 정보 정리 및 반환 |

---

## 상세 설명 (함수 및 의존 관계 포함)

### `book/delete.js`
- import: `getDBBook`, `deleteDBBook`, `deleteS3File` (from `database/bookDB.js`), `deleteDriveFile` (from `book/driveUtils.js`)
- **deleteBook(bookId)**: 도서 정보를 Firestore에서 삭제하고, 관련된 파일을 S3 또는 Google Drive에서 함께 삭제합니다.

### `book/driveUtils.js`
- 사용 라이브러리: Google Drive API, AWS S3 SDK
- **getDriveFileId(filePath)**: Google Drive 경로에서 파일 ID를 조회합니다.
- **moveDriveFile(fileId, targetPath)**: Google Drive 내에서 파일의 위치를 이동시킵니다.
- **copyDriveFile(fileId, folder, fileName)**: Google Drive의 파일을 다운로드한 후, S3에 업로드합니다.
- **deleteDriveFile(fileUrl)**: Google Drive 파일을 휴지통으로 이동시킵니다.

### `book/modify.js`
- import: `updateDBBook` (from `database/bookDB.js`)
- **modifyBook(bookId, data)**: Firestore에 저장된 도서 데이터를 갱신합니다. 단, `cover`, `content` 필드는 제외됩니다.

### `book/regist.js`
- import: `createDBBook` (from `database/bookDB.js`), `moveDriveFile`, `copyDriveFile`, `getDriveFileId` (from `book/driveUtils.js`)
- **registerBook(bookData)**: 
  - UUID 생성
  - Google Drive에서 커버/콘텐츠 파일의 ID 획득
  - S3 업로드 및 Google Drive 파일 이동 처리
  - Firestore에 도서 정보 등록 수행

### `database/bookDB.js`
- Firebase Firestore 기반
- **getDBBook(bookId)**: 특정 ID에 해당하는 도서 정보를 반환합니다. (캐시 적용)
- **getAllDBBooks()**: 전체 도서 목록을 조회합니다. (캐시 적용)
- **createDBBook(bookData)**: Firestore에 새로운 도서 엔트리를 생성합니다.
- **updateDBBook(bookId, updateData)**: 도서 정보를 수정합니다. (`cover`, `content` 필드는 제외)
- **deleteDBBook(bookId)**: 해당 도서를 Firestore에서 삭제합니다.

### `database/userDB.js`
- Firebase Firestore 기반
- **fetchUser(email)**: 이메일 기반 사용자 정보 조회 (캐시 적용)
- **isUserExist(email)**: 사용자가 존재하는지 여부 확인
- **saveUser(email, data)**: 사용자 정보를 저장합니다. (이전 데이터와 다를 때만 저장)
- **updateUserAccess(email, data)**: 마지막 접속일 또는 학번/전공 등의 사용자 정보 갱신
- **fetchAllUser()**: 전체 사용자 목록을 Firestore에서 가져옵니다.

### `drive/export.js`
- 사용 라이브러리: Google Drive API
- **exportDriveFile(fileId)**: Google Docs 포맷은 변환 후 다운로드, 일반 파일은 직접 다운로드 스트림을 반환합니다.

### `drive/jebo.js`
- 사용 라이브러리: Google Drive API
- **jeboFile(reportName, description, files)**: 
  - Google Drive에 `jebo/{reportName}` 경로로 폴더 생성
  - 설명 텍스트 파일(config.txt) 업로드
  - 다수의 파일 업로드 처리

### `drive/show.js`
- 사용 라이브러리: Google Drive API
- **getDriveFiles(folderPath)**: 주어진 폴더 경로 내의 파일 목록을 조회하며, 폴더 우선/이름 순으로 정렬합니다.

### `auth.js`
- import: `fetchUser` (from `database/userDB.js`)
- **getUserInfo(session)**: 세션 객체를 통해 사용자 이메일, 관리자 여부, 마지막 접속일, 사용자 프로필 정보를 구성하여 반환합니다.