# Procyon DB Schema Documentation

이 문서는 Procyon 시스템에서 사용되는 css 파일의 작성 방식을 개략적으로 정의하고자 작성되었습니다.  
문서 최신화: 2025-04-21

---

## 1. 전체 구조

모든 페이지는 다음 두 가지 구조 중 하나를 기본으로 사용합니다:

### (1) `.container` 구조
페이지 콘텐츠를 중앙 정렬하며, 너비를 제한합니다:

```html
<div class="main-container">
  <NavBar />
  <div class="container">
    <!-- 페이지 본문 -->
  </div>
</div>
```

- `width: 80%`, `max-width: 800px`
- 일반적인 정보 페이지, 문서 페이지 등에 사용

### (2) `.content-container` 구조
전체 화면을 넓게 사용하는 구조로, Sidebar가 함께 배치됩니다:

```html
<div class="main-container">
  <NavBar />
  <div class="content-container">
    <Sidebar />
    <main class="main-content">
      <!-- 페이지 본문 -->
    </main>
  </div>
</div>
```

- 파일 리스트, 관리자 페이지 등 양쪽 레이아웃이 필요한 경우 사용

`thanks` 페이지 등 일부는 `.container` 대신 `#thanks-container` 등의 id로 시작하기도 합니다.

## 2. 공통 요소

### `.main-container`
- 최상위 레이아웃 요소
- 배경색, 폰트, 색상 등 글로벌 스타일 적용
- 다크 테마 구성

### `.container`
- 중앙 정렬된 콘텐츠 박스
- `max-width: 800px`, `width: 80%`

### `.content-container`
- 콘텐츠와 사이드바를 가로로 배치
- 일반적으로 좌측 Sidebar, 우측 본문 영역

## 3. 각 페이지의 구조화 방식

각 페이지와 컴포넌트는 고유한 `id` 값을 가지는 최상위 요소로 시작하며, 해당 `id`를 기준으로 스타일이 정의됩니다.

예시:
```css
#file-list { ... }
#book-section { ... }
#user-section { ... }
```

내부 요소는 `class`로 세분화되며, SCSS-like 중첩 방식으로 관리합니다:

```css
#file-list {
  .file-item {
    a {
      :hover { text-decoration: underline; }
    }
  }
}
```

## 4. 스타일 구성 원칙

- 모든 색상은 다크 테마 기반 (`background: #000`, `color: white`)
- 반응형 디자인은 최대한 단순하게 유지 (고정 너비 기반)
- 불필요한 애니메이션, 외부 폰트 최소화
- `@font-face`를 통한 로컬 폰트(`D2Coding`) 사용
- Scrollbar 제거: `::-webkit-scrollbar { display: none; }`

---

# Style Structure Guide

## 1. Overall Structure

Each page follows one of the two base layout structures:

### (1) `.container` structure
A centered layout with limited width, commonly used for content-based pages:

```html
<div class="main-container">
  <NavBar />
  <div class="container">
    <!-- Page content -->
  </div>
</div>
```

- `width: 80%`, `max-width: 800px`
- Used in general information or text-based pages

### (2) `.content-container` structure
A full-width layout that allows horizontal placement of a sidebar and main content:

```html
<div class="main-container">
  <NavBar />
  <div class="content-container">
    <Sidebar />
    <main class="main-content">
      <!-- Page content -->
    </main>
  </div>
</div>
```

- Used for file views, admin pages, and dashboard-style pages

- Some pages (e.g., the `thanks` page) use custom IDs like `#thanks-container` instead of the `.container` class.

## 2. Common Elements

### `.main-container`
- Top-level layout wrapper
- Applies global styles like dark background, font, and color
- Base of the dark theme

### `.container`
- Centered content area
- Max width of 800px and 80% width

### `.content-container`
- Horizontally structured layout for Sidebar and main content
- Sidebar on the left, main content on the right

## 3. Page Structure Convention

Each page or component starts with a top-level element with a unique `id`. Styles are defined using that id.

Examples:
```css
#file-list { ... }
#book-section { ... }
#user-section { ... }
```

Nested structure uses class-based selectors, resembling SCSS style:

```css
#file-list {
  .file-item {
    a {
      :hover { text-decoration: underline; }
    }
  }
}
```

## 4. Style Principles

- All colors are based on a dark theme (`background: #000`, `color: white`)
- Responsive design is kept simple (fixed width-based)
- Avoid unnecessary animations or external fonts
- Uses local font (`D2Coding`) via `@font-face`
- Scrollbar hidden with: `::-webkit-scrollbar { display: none; }`