# procyon - SNUCSEアーカイブプロジェクト

## 概要
『Procyon』は、SNUCSEコミュニティのための学術資料を保存・提供するアーカイブプロジェクトです。  
Next.jsを用いて構築され、以下の3つの主要機能を備えています。

### 1. **書籍アーカイブ**
- 教科書や一般書籍のPDFファイルを提供。

### 2. **試験アーカイブ**
- 過去の試験問題を保存し、共有。

### 3. **資料アーカイブ**
- 講義ノートやその他の授業関連資料を収集。

## 認証
- Googleアカウントによるログインが可能。
- `@snu.ac.kr` ドメインのメールアドレスを持つユーザーのみ登録可能。
- 認証には **Next-Auth** を使用し、セッション管理には **JWTトークン** を採用。

## 使用技術
- **フレームワーク:** Next.js (App Router)
- **認証:** Google OAuth (`@snu.ac.kr` ドメイン限定, Next-Auth, JWTセッション管理)
- **データベース:** AWS DynamoDB（ユーザー情報・書籍情報管理）
- **ストレージ:** Google Drive API（コンテンツファイルの保存・提供）

---

# procyon - SNUCSE Archive Project

## Overview
Procyon is an archive project designed to store and provide various academic resources for the SNUCSE community.  
This project is built using Next.js and consists of three main functionalities:

### 1. **Book Archive**
- Provides PDF files of textbooks and general books related to the curriculum.

### 2. **Exam Archive**
- Stores and shares past exam papers for various courses.

### 3. **Material Archive**
- Contains lecture notes and other course-related materials.

## Authentication
- Users can log in via Google accounts.
- Only users with `@snu.ac.kr` email addresses are allowed to register.
- Authentication is handled using **Next-Auth**, with **JWT tokens** for session management.

## Technologies Used
- **Framework:** Next.js (App Router)
- **Authentication:** Google OAuth (Restricted to `@snu.ac.kr` domain, Next-Auth, JWT-based sessions)
- **Database:** AWS DynamoDB (For managing user and book information)
- **Storage:** Google Drive API (For storing and providing content files)