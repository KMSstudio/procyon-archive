# Procyon - Archive Project of the Department of Computer Science and Engineering, Seoul National University

## Purpose of Development

**Procyon** aims to resolve the imbalance in information sharing within the Department of Computer Science and Engineering at Seoul National University (SNUCSE) and to build a natural cycle of knowledge exchange between senior and junior students.  
Currently, even essential learning materials tend to be shared in a fragmented, personal manner within the department, which calls for an integrated platform to address this issue.

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication**: Google OAuth (Restricted to `@snu.ac.kr` domain, using NextAuth + JWT)
- **Database**: Firebase Firestore (For managing user data and metadata)
- **Storage**:
  - **Google Drive API**: Stores and provides original files for books, exams, and lecture materials
  - **AWS S3**: Stores book cover images and PDF files

## Main Features

### 1. Book Archive

- Upload and view textbooks and general reading materials in PDF format
- Supports cover images and additional formats like EPUB and MOBI
- Filter search using tags
- Admin page for selecting and registering cover/content files

### 2. Exam Archive

- Upload and view past exam papers organized by course
- Integrated with Google Drive for file management
- Sorted and structured based on file names

### 3. Lecture Material Archive

- Archive lecture notes, assignments, and project files
- Contributions from individual students are welcome
- Materials are categorized and filterable by type tags

## Page Structure

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/drive/book` | Book list and search |
| `/drive/exam` | Access to past exam papers |
| `/err/*` | Error page (invalid route) |
| `/thanks` | Credits for developers and contributors |

This project is dedicated to the **sustainable archiving of academic assets at SNUCSE**, and it aims to grow as an open platform where anyone can easily access and contribute.

---

# Procyon - ソウル大学コンピュータ工学科アーカイブプロジェクト

## 開発目的

**Procyon**は、ソウル大学コンピュータ工学科における情報共有の不均衡を解消し、先輩と後輩の間で自然な知識の循環を構築することを目的としています。  
現在、学部内では重要な学習資料ですら個人ベースで断片的に共有される傾向があり、この問題を解決するためには統合されたプラットフォームが必要とされてきました。

## 技術スタック

- **フレームワーク**: Next.js 14（App Router）
- **認証**: Google OAuth（@snu.ac.kr ドメイン限定、NextAuth + JWT）
- **データベース**: Firebase Firestore（ユーザー情報とメタデータ管理）
- **ストレージ**:
  - **Google Drive API**: 書籍・試験・資料の原本ファイル保存と提供
  - **AWS S3**: 書籍の表紙画像およびPDF資料保存

## 主な機能（Features）

### 1. 書籍アーカイブ

- 教科書や教養書のPDFアップロードと閲覧
- 表紙画像およびEPUB・MOBIなどのフォーマットにも対応
- タグによるフィルタ検索機能
- 管理者ページでの表紙・内容ファイルの選択および登録

### 2. 試験アーカイブ

- 学科別の過去試験問題をアップロードおよび閲覧可能
- Google Driveとの連携によりファイル管理
- ファイル名に基づいたソートと分類

### 3. 講義資料アーカイブ

- 講義ノート、課題、プロジェクト資料などの保存と共有
- 学生の個人資料もアップロード可能
- 種別タグによる分類とフィルタリング

## ページ構成

| パス | 内容 |
|------|------|
| `/` | トップページ |
| `/drive/book` | 書籍一覧と検索機能 |
| `/drive/exam` | 過去試験問題の閲覧 |
| `/err/*` | エラーページ（不正なパスへのアクセス） |
| `/thanks` | 開発者・貢献者紹介ページ |

このプロジェクトは、**SNUCSEの学術的資産の持続的なアーカイブ**を目的としており、誰でも簡単にアクセス・貢献できるオープンなプラットフォームとしての発展を目指しています。