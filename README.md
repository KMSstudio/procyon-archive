# procyon - SNUCSEアーカイブプロジェクト

## 開発目的
Procyonは、ソウル大学コンピュータ学科内の情報共有の不均衡を解決し、先輩後輩間の近しいネットワークを構築することを目的としています。

学部内では、必須の学習資料でさえ個人単位で断片的に共有されることが多く、この問題を解決するために統合的なプラットフォームが必要だと考えました。

また、他大学のように強い結びつきを持つ学術コミュニティを目指し、先輩が後輩を自然に支援し、後輩もまた次世代のために知識を残せるような循環的な文化を定着させることを願っています。
すくなくとも、学業や研究に必要な資料の共有は、より活発に行われるべきだと考えています。そのために、このプラットフォームが活性化することを期待しています。

## 機能及び技術スタック
### 機能
#### 1. 書籍アーカイブ
- 教科書や専門書、一般書籍のPDFファイルを提供。
- 書籍の表米画像およびPDF以外のフォーマット (EPUB, MOBI など) に対応。

#### 2. 試験アーカイブ
- 過去の試験問題を保存し、共有。
- 科目ごとに整理され、検索機能を提供。

#### 3. 資料アーカイブ
- 講義ノートや授業関連資料を収集・管理。
- 学生のノートやスライド、プロジェクト資料なども保存可能。

### 技術スタック
- **フレームワーク:** Next.js (App Router)
- **認証:** Google OAuth (@snu.ac.kr ドメイン限定, Next-Auth, JWTセッション管理)
- **データベース:** AWS DynamoDB (ユーザー情報・書籍情報管理)
- **ストレージ:** Google Drive API (コンテンツファイルの保存・提供)
- **ストレージ:** AWS S3 (書籍の表米画像およびPDF以外の書籍コンテンツの保存)

---

#  
# procyon - SNUCSE Archive Project

## Purpose of Development
Procyon aims to eliminate the imbalance in information sharing within the Department of Computer Science and Engineering at Seoul National University and establish a closer network among students.

Currently, even essential learning materials are often shared in a fragmented manner on an individual basis, highlighting the need for an integrated platform to address this issue.

Additionally, we aspire to build an academic community with strong connections, similar to other universities, where senior students naturally support juniors, and juniors, in turn, contribute knowledge for the next generation. At the very least, sharing essential academic and research materials should be more active, and we hope this platform will serve as a catalyst for fostering such a culture.

## Features and Technology Stack
### Features
#### 1. Book Archive
- Provides PDF files of textbooks, specialized books, and general reading materials.
- Supports book cover images and non-PDF formats (EPUB, MOBI, etc.).

#### 2. Exam Archive
- Stores and shares past exam papers.
- Organized by course with search functionality.

#### 3. Material Archive
- Collects and manages lecture notes and course-related materials.
- Supports saving student notes, slides, and project materials.

### Technology Stack
- **Framework:** Next.js (App Router)
- **Authentication:** Google OAuth (Restricted to @snu.ac.kr domain, Next-Auth, JWT-based sessions)
- **Database:** AWS DynamoDB (For managing user and book information)
- **Storage:** Google Drive API (For storing and providing content files)
- **Storage:** AWS S3 (For storing book cover images and non-PDF book content)