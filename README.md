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