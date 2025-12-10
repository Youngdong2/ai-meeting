# Contributing Guide

## 브랜치 네이밍 규칙

브랜치명 끝에 항상 이슈 번호를 포함합니다.

### 형식

```
<type>/<description>-#<issue-number>
```

### Type

- `feature/` : 새로운 기능 개발
- `fix/` : 버그 수정
- `refactor/` : 코드 리팩토링
- `docs/` : 문서 작업
- `style/` : 스타일/UI 수정
- `test/` : 테스트 관련

### 예시

```
feature/ui-foundation-#1
feature/login-#2
fix/auth-bug-#3
refactor/api-structure-#4
```

### 규칙

1. 브랜치명은 소문자와 하이픈(`-`)만 사용
2. 이슈 번호는 항상 맨 뒤에 `-#숫자` 형식으로 위치
3. 설명은 간결하고 명확하게 작성
