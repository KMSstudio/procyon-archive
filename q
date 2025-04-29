[33mb903c93[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mdevelop[m[33m)[m docs: public/image/lnk 이미지 파일들을 .avif 로 업데이트. (.webp 없음)
[33mb58fe63[m feat: code가 영역을 벗어날 경우, x-scrollable 하게 하고 너비가 넓어지지 않도록 수정
[33me62cdf6[m markdown.css 개선
[33mbb4101c[m[33m ([m[1;33mtag: [m[1;33mv0.7.5[m[33m, [m[1;31morigin/develop[m[33m)[m 0.7.5
[33ma8b9aca[m update to 0.7.5
[33mf8735e3[m docs: TODO.md 업데이트
[33mafc602f[m docs: MarkdownView.js 이름을 MarkdownViewClient로 변경
[33mcc32f93[m feat: MarkdownView를 정식 component로 만들고 MarkdownViewServer를 추가, 기본적인 style 태그를 markdown.css에 작성. 경로는 @/styles/components/view/markdown.css
[33m6963cc3[m chore: jeboconsole의 emptymessage의 생상을 회색으로 변경, 중앙 정렬
[33m6997d58[m feat: D2Coding font를 woff2 format으로 변경하여 적용
[33m6e3e0ea[m feat: 파일 아이콘 이미지와 공통 이미지를 .avif, .webp로 변경
[33me2331c5[m feat: robots.txt, sitemap.xml 파일 추가
[33meacdb41[m fix: thanks 페이지에서 로고 색상 변경에 transition 0.3s ease가 적요오디지 않았던 문제 해결
[33mf597bb0[m chore: minor design update at FileList
[33m640a131[m feat: mixpanel을 추가. main 페이지, drive/book 페이지, drive/[...path] 페이지에 우선 적용
[33mfddf825[m fix: bugfix for 0.7.4 release
[33mcb43e92[m[33m ([m[1;33mtag: [m[1;33mv0.7.4[m[33m)[m 0.7.4
[33m0084c5a[m update display version to 0.7.4
[33m9a17f91[m 임시 배포를 위한 기본 내용 세팅
[33m109f1cb[m chore: textlist.css 파일에 있더 불필요한 공백 삭제
[33m7b98305[m Merge branch 'develop' of https://github.com/KMSstudio/procyon-archive into develop
[33m1351356[m chore: board-config.json 변경, textlist.css에서 글 hover의 영역 정의 변경
[33m5935759[m feat: text(board)의 메인 페이지 제작 및 config 파일 변경
[33m763630b[m docs: conv2webp.py, conv2avif.py 주석 추가
[33md74c323[m docs: 로고 이미지 .avif, .webp 사용하도록 변경
[33m91cfd5a[m feat: userlist에서 유저 목록 조회 시 user의 prestige 권한 여부 확인 가능 기능 추가
[33m6c6cf99[m Merge pull request #13 from KMSstudio/master
[33m6622900[m[33m ([m[1;31morigin/master[m[33m, [m[1;31morigin/HEAD[m[33m, [m[1;32mmaster[m[33m)[m feat: userDB에 prestige (필드는 isPrestige) 항목 추가, book 블락 검사
[33m39b6b19[m fix: bugfix
[33m5a435b3[m Merge pull request #12 from KMSstudio/develop
[33m3da69b4[m fix: 버그 수정
[33m4418c52[m Merge pull request #11 from KMSstudio/develop
[33m7f70351[m feat: admin이 아닌 모든 유저에 대해, drive/book blocking
[33mdcfea53[m feat: 기초적인 text list 페이지  제작
[33me5c4a64[m docs: 개발자 페이지 openGraph의 마이너한 수정
[33m66d7f2b[m docs: 개발자 페이지의 openGraph 수정
[33m36822ab[m struct: config 파일에서 config 성격이 옅은 contributor/developer, tag/extention 데이터를 people 폴더, view 폴더로 이동
[33m7847dd2[m chore: User who does not login 기록하는 과정에서 괄호가 이중으로 표기되는 문제 수정
[33me3e1dc4[m docs: update TODO.md
[33m9df5d81[m Merge pull request #10 from KMSstudio/develop
[33m47b7900[m :erge branch 'develop' of https://github.com/KMSstudio/procyon-archive into develop
[33m93a0f54[m style: css style flatten
[33mf6c4302[m Merge pull request #9 from KMSstudio/master
[33m661f6b7[m feat: check is test envinorment and do not check user login when it is on test env
[33mb1f8f48[m Merge pull request #8 from KMSstudio/hotfix
[33m1673dde[m[33m ([m[1;31morigin/hotfix[m[33m)[m correct behavior:bahavior typo
[33md770d8f[m Merge branch 'master' of https://github.com/KMSstudio/procyon-archive into develop
[33m0fbfc4b[m docs: write TODO.md
[33me8a18d0[m Merge pull request #7 from KMSstudio/develop
[33m68785f0[m[33m ([m[1;33mtag: [m[1;33mv0.7.3[m[33m)[m 0.7.3
[33m15e88a6[m update to 0.7.3
[33mf9a910a[m text/modify에서 google drive api의 update를 사용하는 것을 drive/text.js로 이동
[33mc9823c8[m docs: logger를 더 규격화하고 styleguide를 작성
[33md4ee2c3[m chore: git log 방식을 변경. bahavior, query 중심.
[33mcf5e703[m refactor: 메인 페이지, thanks 페이지, drive 페이지 3종 .css 파일 개선
[33ma66edff[m chore: log 메세지 일렬화
[33m83749f1[m Merge pull request #6 from KMSstudio/develop
[33meee855a[m[33m ([m[1;33mtag: [m[1;33mv0.7.2[m[33m)[m 0.7.2
[33m600801e[m update version notation to 0.7.2
[33md54c3a0[m feat: 수정 버튼을 글 안쪽으로 변경. 글 하단에 수정 버튼과 뒤로가기 버튼이 있음
[33m54172c7[m chore: pagelist에서 수정 버튼이 뜨는 은 only 작성일로 변경
[33md781a44[m chore: toolbox/database 계열 python 파일에서 environment 파일 위치 재설정
[33mcd0b905[m docs: 디자인 업데이트
[33m301dd9f[m docs: 배경화면 X자 빨간색으로 수정
[33ma78786a[m docs: 배경화면을 대비 화면으로 변경
[33m49cb1bb[m feat: 폰트 디자인은 D2coding으로 변경
[33m3b2a773[m docs: utils/database에 schema.md 작성. DB 스키마 관련 문서
[33m6151129[m feat: 게시판 기능 추가, 게시판 수정 기능을 명문화 한 후 수정 되었을 시 text/archived 로 수정 전 글이 가도록 수정
[33m24308a9[m feat: 각종 page.js와 route.js에 board-config.json 반영
[33m76385f8[m fix: log 확인 탭에서 log가 최대 1000개만 출력되는 문제 해결
[33m83fddad[m 0.7.1
[33m4b8e88d[m Merge pull request #5 from KMSstudio/master
[33m9e9807a[m Merge branch 'develop' into master
[33ma1a2122[m Merge pull request #4 from KMSstudio/hotfix
[33mf89b1e3[m push fixed version
[33m578a7af[m change jeboFile run at background
[33m9f29103[m 0750
[33md0cde7b[m add runtime = nodejs
[33me658273[m add more console log
[33mccb53b5[m consle log
[33m0b22928[m console log at route.js
[33m16da852[m Revert "0.7.1"
[33m1c75b54[m test log
[33mfd42067[m console log at route.js
[33m55bf1fe[m add console.log at jeboFile
[33m627d2e6[m Merge pull request 0.7.1 from KMSstudio/develop
[33m30aec97[m[33m ([m[1;33mtag: [m[1;33mv0.7.1[m[33m)[m 0.7.1
[33madd0d73[m 0.7.1
[33m0f12ff9[m feat: 게시판 view 페이지가 driveId가 아닌 pageId를 받도록 설정
[33mac6d507[m feat: 글 수정 기능 정식 추가, 글 수정 페이지 제작
[33m615fad7[m docs: 메타데이터 추가 작성
[33mf457266[m chore: 메인 페이지 description 변경
[33me503685[m docs: modify/[pageId]/page.js 추가
[33m1dabb6c[m feat: pagelist.js에 수정 버튼 추가
[33m9bd7ced[m chore: import 문단 스타일 통일화
[33mbe6f2d4[m feat: @/app/text/[boardName]/layout.js에서 config에 없는 board 요청에 대해 redirect. page.js에서 board의 name 대신 config 파일에 기재된 displayName을 표시
[33mf53df85[m docs: README.md 언어 순서를 jp/en으로 변경
[33m1554b58[m docs: 메인 페이지 description 변경
[33m8c6fb92[m fix: 메타데이터 추가
[33ma18024f[m docs: board-config.json 파일 추가
[33mcd23e4a[m docs: todo.md 수정
[33mec1d24f[m docs: profile-list.json 파일을 현재 상황에 맞도록 developer-list.json으로 이름변경, configManager.js 파일 삭제
[33m2b370a0[m delete: 임시 게시판 .md 저장용 data 폴더 삭제
[33m47bb117[m docs: README.md의 언어 순서를 eng/jap   ㄱ
[33m940b371[m docs: 파일리스트 항목의 제보 바로가기 항목 아이콘 변경
[33mfd90f24[m struct: text의 layout.js 이동
[33meed2280[m FileList에 /drive/jebo로 이동하는 링크 삽입
[33mfb7d6d7[m fix: deleteS3File 함수가 없는 문제 수정
[33m28d05bb[m branch 'develop'
[33m1ea2019[m[33m ([m[1;33mtag: [m[1;33mv0.7.0[m[33m)[m 0.7.0
[33m990ddac[m 0.7.0
[33mae769c4[m Merge branch 'develop'
[33me4db8a0[m feat: drive/jebo에서 닉네임 기록 기능 개발
[33m44caed4[m fix: text/[boardName]/view/[pageId] 에서 컨텐즈 중앙정렬.
[33m8494e96[m feat: write console 지다인 업데이트
[33mc7e0b77[m feat: test db에 개싱 추가. environment variable TTL_TEXT_DB 사용
[33m8bbf5b1[m feat: 글쓰기 페이지 디자인 업데이트. 업데이트 중 문제 발생하여 중단
[33m1c8a18c[m chore: border-radius: 0px 항목을 명문화
[33m13c0c9f[m fix: jeboconsole에서 입력 받스의 vorder-radius: 4px 항목을 삭제 - 0px로 설정
[33m72b9515[m feat: 게시판에서 글 작성시 프리뷰가 보이는 기능 추가. /api/text/markdown을 활용. POST를 사용하나 사용법이 유별나니 주의
[33m92145cf[m fix: @/app/text/[boardName]/page.js 에서 PageList를 컴포넌트화
[33md1f1bac[m feat: @/app/api/log/(download/route.js|flush/route.js)에서 유저가 admin인지 확인
[33m91a5e5c[m chore: 디자인 업데이트. @/app/text/[boardName]/page.js에서 디자인 업데이트
[33ma0a0dea[m chore: 메인 page.js에서 update user access 'date' 도입
[33mf253100[m chore: 메인 page.js 에서 사용하지 않는 Util import 제거: Update User Access
[33mecfebfd[m Merge branch 'develop'
[33md81f4d2[m fix: 로그 기록이 출력되지 않는 버그 해결: const 문제
[33m4877538[m Merge branch 'master' of https://github.com/KMSstudio/procyon-archive into develop
[33m8d80987[m Merge branch 'develop'
[33ma0eb680[m feat: @/app/test/layout.js 작성
[33m8b7380b[m Merge pull request #2 from KMSstudio/develop
[33ma9d054c[m chore: modify package-lock.json
[33mb8343b3[m feat: 공지글 작성을 위한 board 기능 추가. 디자인 X
[33mf469509[m chore: .girignore 업데이트
[33m9d8c321[m delete: 크롤러 접근 허용을 다시 막음. 1. Client Component가 주 컨텐트고, 2. 도서 업로드가 검색되봐야 좋은 꼴 못 봄
[33m6324f72[m getUser를 getUserv2로 업데이트 및 updateUserAccess > updateUserAccessDate 로 기능 개선
[33meab52ed[m feat: drive/layout.js에서, 브라우저 크롤러의 접속을 허용 - 허용 리스트는 layout.js의 allowedBots 참조
[33m4e68c9e[m feat: 파일 제보 시 제보자 이메일 정보를 함께 수신하도록 설정
[33mc362b46[m chore: getBuffer() 스타일 변경
[33me85db3d[m fix: 로그 다운로드 시 최대 크기가 제한되어있던 문제 해결
[33m5373cea[m chore: 파일 업로드 용량 메세지 추가
[33m0bf88f9[m fix: 로그를 남길 때, 강명석이라는 문자열이 포함된다면 로그를 남기지 않음
[33m343f103[m docs: toolbox .gitignore 수정
[33mda75c35[m docs: todo.md 수정
[33mf21810e[m docs: layout.js의 head에 icon 추가: /image/opengraph/favicon.png
[33mf49677d[m docs: head에 favicon 추가. /image/opengraph/favicon.png
[33m49223b7[m 0.6.6
[33m878247b[m 0.6.6
[33m8a5514a[m docs: 25-1 시험기간 기념 이벤트
[33m8c1e301[m .girignore 최신화, document 폴더를 프로젝트 폴더 내로 이동
[33mc3eb60a[m feat: api/drive/export/[fileid] 에서 유저 로그인 검사를 추가.
[33m12ba486[m docs: y-pythons 폴더를 toolbox로 remane
[33m7190e64[m delete: 사용되지 않는 아이콘 파일 삭제
[33m71f0c06[m chore: book upload 섹션에 사용되는 분류되지 않은 x-sign.png 이미지 분류
[33m1e08057[m chore: sidebar에 사용되는 아이콘 이미지를 묶어 /image/ico/sidebar 폴더에 분류
[33m78234b1[m chore: admin/user 섹션의 이미지 아이콘 폴더 이름을 admin/user/section으로 번경
[33m1218c8a[m chore: sidebar의 프로필 이미지 위치를 /profile/main.png로 조정
[33ma18c9b1[m gitcommit.bat를 gitcommit.master.bat로 수정
[33m02b03fd[m docs: favicon.png 위치를 /image/opengraph/favicon.png로 수정
[33m71da254[m git add .
[33m190a089[m fix: 배너 이미지를 erin.png로 변경
[33m520de51[m docs: openGraph 배너 이미지 중앙 정렬 변경, erin 이미지 추가
[33mc2cde47[m feat: OG 추가, openGraph 사용하여 사이트 제목, 설명, 이미지 추가. 이미지는 /public/image/banner.png에 위치
[33mcff0205[m docs: admin 제보 섹션에 들어갈 이미지 파일 추가
[33m413528c[m 0.6.5
[33m30d70b2[m fix: admin 메인 페이지에서 제보 관련 import 삭제
[33m16a2cfb[m 0.6.4
[33me3589bf[m fix: @/app/admin/page.js에서 jebo 삭제
[33m889d05c[m feat: gitcommit.dev.bat 추가
[33m5434694[m @/app/components/admin/logsection.js 주석 스타일 통일
[33m8cdd131[m feat: 로그 다운로드 및 버퍼(DB) flush 기능 추가
[33m812df29[m feat: 유저 jwt에 version 관리 기능 추가. version이 같은 토큰만 유효한 갓으로 간주.
[33mf1b818e[m feat: downlaod 에서 로그 기록 시 파일 이름이 기록되도록 변경. 단, 이 경우, api/export/fileid?name=${name} 형식의 name 입력을 요구함
[33m6bb0624[m 메인 페이지에서 로그인을 하지 않은 유저가 있을 시에도 로그 기록
[33ma0afcb8[m fix: 메인 페이지에서 유저 정보 업데이트 중지, 로그 최신화
[33m96e4d19[m fix: 에브리타임 브라우저 에러 페이지에서의 url 복사가 procyon-omega로 되어있던 것을 수정
[33mc09e174[m fix: thanks.js에 버전 0.6.4 최신화
[33m9d1a650[m fix: 로그 메세지 한글화 및 최신화
[33m4092694[m fix: /drive/book 페이지에 개발자 한국어로 작성
[33med6afec[m fix: 개발자 소개 페이지에 로깅 추가
[33m9fce855[m fix: update log message as Korean
[33m9caac96[m fix: drive/[...path]/page.js 로그 시스템 개선
[33m825fc52[m fix: logsection 페이지에서 스크롤이 화면을 벗어나는 문제 해결
[33mb6600e8[m fix: timestamp 계산할 시 UTC 고려하여 +09:00 하도록 변경
[33mbd8099d[m logger.js firebase로 마이그레이션
[33m91bda95[m delete: logger.js flush schedule 삭제
[33m6985ef2[m feat: admin에 log section 추가
[33m5e9faae[m delete: drive/logger.js 삭제
[33mdc4c4c7[m chore: logger.js에 있던 오타 revise
[33mfb8011e[m refactor: logger.js에서 gdrive 업로그 기능 삭제, schedulaFlush를 private로 변경
[33mc1de0ab[m chore: @/app/admin/page.js 복사, 상단 주석 수정
[33m8295d13[m feat: jebosection.js 작성. 해당 섹션은 /admin/user 에서 보임
[33m3b39936[m docs: todo.md 업데이트
[33md3805e9[m fix: api/log/route.js 에서 수동으로 로그 추출 가능하게 설정
[33m8e25fc3[m delete: vercel.json 롤백
[33m0064303[m feat: gitcommit.bat이 git push origin master 또한 함께 수행하도록 변경
[33md2ce933[m fix: correct type cron to crons
[33mcf56bd3[m feat: vercel 환경에서의 scheduling을 위해 cron 활용. 이에 따라 api/logger/(hourly/daily) 추가
[33m403be9d[m fix: 제보 제출 후 로그 기록시 에러가 뜨던 문제 해결
[33mded0b5f[m style: utils/auth.js 조금 더 compact하게 수정
[33m910af4a[m refactor: Add logger.js to page.js, route.js file
[33m8fbc99a[m logger.js에 테스트 코드 작성. hour interval의 interval을 환경변수 LOGGER_HOUT_INTERVAL로 설정할 수 있도록 변경
[33md6cc26a[m feat: @/utils/logger.js 사용하여 기본적인 로깅 기능 작성
[33m2f919bd[m refactor: @/utils/Auth.js의 getUser 함수 적용
[33m17ad9d6[m feat: @/utils/auth.js에 getUser() 함수, getUserv2() 함수 추가. 기존 getUserInfo(session) 함수는 유지
[33mb8c4dad[m create logger (but is not tested yet)
[33m7d72823[m chore: gitcommit.bat에서 자동 git push 기능 제거
[33m46dd01b[m[33m ([m[1;33mtag: [m[1;33mv0.6.3[m[33m)[m 0.6.3
[33m61bbbe6[m chore: page.js에 버전 최신화 (0.6.3)
[33m41a0197[m docs: README.md 구분선 일부 삭제
[33ma716c5a[m chore: execute.dev.bat와 gitcommit.bat 파일 수정
[33m01501b0[m chore: 소스  파일 상단에 @ 기반 파일 주소 추가l
[33ma8c7afe[m chore: y-pythons/fire-user-getall.py에 lastAccessDate 기준 내림차순 정렬 적용
[33mbfb2755[m docs: README.md 새롭게 작성, todo.md 업데이트
[33m93e96cd[m[33m ([m[1;33mtag: [m[1;33mv0.6.2[m[33m)[m 0.6.2
[33mb2d94b3[m relocate style folder from @/app/style to @/style
[33m2d2b03a[m[33m ([m[1;33mtag: [m[1;33mv0.6.1[m[33m)[m 0.6.1
[33me0514bc[m update README.md, add markdown file for utils/ functions
[33m4adca04[m config/navConstant update
[33ma7d610a[m 파일 업로드 최대 용량 수정하고 업로드 progress 확인할 수 있게 함
[33m228fd5e[m /api/jebo/upload에서 /api/drive/jebo/upload로 api 경로 수정
[33m6309400[m jeboconsole.css 디자인 업데이트 - 마진 조절
[33me33ad20[m[33m ([m[1;33mtag: [m[1;33mv0.6.0[m[33m)[m 0.6.0
[33mbc56620[m 제보창 콘솔 components/JeboConsole.js로 분리
[33m532ba18[m components/unique를 components/admin으로 이동
[33m99b417a[m unique/bookregister.css를 console/bookresiger.css로 이동
[33maeccaa1[m 파일 제보 기능 추가
[33mff9e876[m minor update
[33m56845ac[m minor update
[33m0fd41d8[m[33m ([m[1;33mtag: [m[1;33mv0.5.4[m[33m)[m 0.5.4
[33m4d36bfc[m update env value to migrate firebase
[33m4950d7a[m update thanks.js
[33m9da544d[m HOTFIX
[33m8785498[m[33m ([m[1;33mtag: [m[1;33mv0.5.3[m[33m)[m 0.5.3
[33mcb539e6[m HOTFIX
[33me076490[m use .env at DB name
[33m8b693fc[m[33m ([m[1;33mtag: [m[1;33mv0.5.2[m[33m)[m 0.5.2
[33m99788b5[m refine y-pythons: left two necessary python files
[33m7c301b9[m[33m ([m[1;33mtag: [m[1;33mv0.5.1[m[33m)[m 0.5.1
[33mde9a435[m migrate bookDB.js to firebase
[33m564e61f[m[33m ([m[1;33mtag: [m[1;33mv0.5.0[m[33m)[m 0.5.0
[33mbab3bed[m migrate userDB.js firebase
[33me2975c4[m update gitignore
[33m2ff3984[m mu0.4.13
[33mbba4579[m mu0.4.13
[33m137b6c4[m mu0.4.13
[33maf42a31[m minor update at 0.4.13
[33m9b85946[m minor update at 0.4.13
[33me2e48bb[m minot update at 0.4.13
[33mf84e4b7[m[33m ([m[1;33mtag: [m[1;33mv0.4.13[m[33m)[m 0.4.13
[33m4c19312[m update drive/book page to show inform message at top, update UX at admin/book
[33md1bc75c[m[33m ([m[1;33mtag: [m[1;33mv0.4.12[m[33m)[m 0.4.12
[33mb65d4f4[m Add logic to get all user data from AWS dynamo db
[33mc67768b[m relocate @/utils/bookDB, @/utils/userDB
[33mc398435[m fir bug at userDB - remove minute, second access data
[33m5810671[m design update
[33m813a157[m add feature: block non student users
[33m94cf923[m[33m ([m[1;33mtag: [m[1;33mv0.4.11[m[33m)[m 0.4.11
[33m11c24f0[m move showtag.bat to \z-batches\tagshow.bat
[33m973bd96[m[33m ([m[1;33mtag: [m[1;33mv0.4.10[m[33m)[m 0.4.10
[33m28affef[m update userDB to record user access time, update user section minorly
[33mb410aae[m update userDB to save user position, major
[33mb0bbceb[m update todo.md
[33mb9d0fe4[m update Chache TTL to use env.local at @/utils/bookDB.js, remove unuser cover, content data from BookRegisterConsole at @/app/components/unique/BookMdfSection.js, update < > button ui at @/app/styles/components/unique/bookmdfsection.css
[33mb591ed4[m TODO.md update
[33m9e35c34[m[33m ([m[1;33mtag: [m[1;33mv0.4.9[m[33m)[m 0.4.9
[33m9b9921f[m add @snu.ac.kr block
[33m54d52da[m[33m ([m[1;33mtag: [m[1;33mv0.4.8[m[33m)[m 0.4.8
[33m6523cda[m 0.4.8
[33m1b39837[m[33m ([m[1;33mtag: [m[1;33mv0.4.7[m[33m)[m 0.4.7
[33m4ed1108[m 프로필 정보 업데이트
[33m00aa628[m everytime 링크 핸들러 업데이트
[33m1233f41[m @/utils/bookDB.js에 chache 기능 추가
[33m4bce5ce[m 자료기증 업데이트
[33m4038f7a[m[33m ([m[1;33mtag: [m[1;33m0.4.7[m[33m)[m Tag 검색 버그 수정 및 middleware matcher 수정
[33m496505e[m fix module path error at @/src/app/drive/book/no-login.js
[33m520ae1a[m update middleware to applied alal path
[33mcf8ecf4[m[33m ([m[1;33mtag: [m[1;33mv0.4.6[m[33m)[m 0.4.6
[33m688e140[m kakao, everytime browser 대응
[33m528deca[m /login 폴더 /err/login으로 이동, /err/browser 신설
[33me403d4a[m make userBrowserAgent log
[33md866ccb[m fix config at middleware
[33m953b9c1[m[33m ([m[1;33mtag: [m[1;33mv0.4.5[m[33m)[m 0.4.5
[33me835187[m 접속 마지막 기록이 업데이트 되지 않는 버그 수정, 미들웨어 추가
[33m177c202[m[33m ([m[1;33mtag: [m[1;33mv0.4.4[m[33m)[m 0.4.4
[33m5ea58dc[m 0.4.4
[33m7297d83[m /drive/book 에서 검색 문제 완전 해결
[33m93a825a[m[33m ([m[1;33mtag: [m[1;33mv0.4.3[m[33m)[m 0.4.3
[33m412c99d[m 파일 구조 업데이트
[33m3495338[m[33m ([m[1;33mtag: [m[1;33mv0.4.2[m[33m)[m 0.4.2
[33m3a1c0e7[m book검색시 focus 해제 되는 버그 수정 2
[33m6129035[m book검색시 focus 해제 되는 버그 수정 - 영문
[33m41d690c[m[33m ([m[1;33mtag: [m[1;33mv0.4.1[m[33m)[m 0.4.1
[33m65894f9[m 상수 수정, 프로필 이름 수정
[33mc2e47a6[m[33m ([m[1;33mtag: [m[1;33mv0.4.0[m[33m)[m 0.4.0
[33m52c70b8[m add book modify, book delete feature
[33mef350b2[m book modify, delete UI 구현
[33m5d31476[m 만약 유저가 이미 가입되어 있다면, @snu.ac.kr, SNUCSE 검사를 생략
[33m6b46862[m Update Login Date more frequently: at app/layout.js, app/drive/layout.js
[33mc527c87[m[33m ([m[1;33mtag: [m[1;33mv0.3.3[m[33m)[m 0.3.3
[33m3d63ac9[m update README.md and make index.js a little reactive
[33mf01794f[m minor update
[33mf0c8144[m[33m ([m[1;33mtag: [m[1;33mv0.3.2[m[33m)[m 0.3.2
[33m56a901f[m hidden 태그가 보이지 않도록 수정
[33m4cdad5e[m booklist에서 오른쪽 여백이 남던 문제 해결
[33m54a948f[m booklist에서 오른쪽 여백이 남던 문제 해결
[33mdf6bf1d[m[33m ([m[1;33mtag: [m[1;33mv0.3.1[m[33m)[m 0.3.1
[33meffad7b[m bugfix: book registration eror in public environment
[33m3a3e4a0[m[33m ([m[1;33mtag: [m[1;33mv0.3.0[m[33m)[m 0.3.0
[33meba1f16[m procyon 0.3.0
[33mec02091[m new list
[33m02145f4[m remove /api/drive/show/route.js
[33m7e8ed6c[m update name of the procyon
[33m2801fb7[m update TODO.md
[33mba558a0[m minor design changes
[33m812ff18[m remove tag DB
[33m98a4e9d[m update regist.js logic
[33m2775c16[m update comments in front of file
[33m428b730[m update design
[33m558d2d1[m update admin/section file names
[33m7778a5f[m move google api credention file to .local.env
[33m22f5f13[m update .env.local
[33m51b70ac[m minor update
[33m43acc28[m minor update
[33m742cb66[m update tag design
[33m68c7532[m initial booklist search section
[33m4f400c4[m make layout at drive/
[33m151d7c0[m add login error page
[33mf97c519[m remove delay at folder click (in filelist)
[33m3af7a77[m minor design update
[33m02dacaf[m booklist.css
[33mb9ce285[m update filelist design
[33m3d22376[m update navConstants, filelist.css
[33m8b474a7[m design improvement
[33me80df1b[m move booklist.css into /styles/components/list
[33m67b6e29[m initial drive/book page
[33m930ee4b[m update DB structure and regist data flow
[33m4872f24[m design improvement
[33m1c5b045[m design improvement
[33m7e2ec27[m minor update
[33m1b73d51[m regist book into AWS S3, AWS Dynamo DB, Google Drive Book/cover(content). Initial version
[33m7599878[m book register console
[33ma997d1b[m admin book section 1
[33mad64f02[m construct utils/drive to improve accessibility
[33mb60f60f[m update README
[33m74b99bc[m user search & seperate user section as client component
[33m19a03f3[m make admin page (initial)
[33m4693d44[m mak route.js to use jwt
[33m76c1c34[m refine css locations
[33mb1a7ec7[m userDB to dynamoDB
[33m32adcaf[m minor update
[33mdb5423f[m add comments
[33m56df8fc[m make download dynamic
[33m762962c[m refectoring FileList
[33m82cf149[m thanks pagie
[33maa3f394[m minor update
[33mf04f460[m add comments at top
[33m241ccf4[m upload other logo image
[33m3aff36c[m upload logo ar navbar
[33m3963f37[m minor change
[33mf922506[m add css to drive/[...path]/page.js (for back-link)
[33m6e69638[m make back path at /drive/
[33mac3b301[m make server SSR
[33mcbff13a[m sort content is folder>file, a>z
[33m429fb84[m update api url
[33m3eb0bf6[m design update
[33m77986ee[m refine api path: const/nav, const/ext
[33m231a35b[m design and improve filesystem
[33mc79765f[m rename: ReferenceFileLIst > FileList
[33ma4a770f[m basic file download system
[33m768c7fd[m user admin check (hardcoded in user\info\route.js )
[33m8475529[m upload favicon
[33m8b9b827[m Imporve Oauth: use Login/Logout Button to Login/Logout directly
[33medef982[m simple Google OAuth2 with next-auth
[33mc79cbc9[m design update
[33m2858d0e[m delete ButtonList - Merge to Main Page
[33m28d06f1[m update write constant
[33m09e249a[m write todo
[33m36b7000[m delete decoration line at sidebar link section and make color animation when mouse overed to link
[33m2b2e082[m add brace at README.md 『Procyon』
[33m168d93d[m weite README.md
[33ma908e79[m remote add
[33meb539f1[m first commit. make main page
