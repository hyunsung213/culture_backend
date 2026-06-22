# 이응 메인 백엔드 (`ieung-main-backend`)

`이응; AI 기반 한국어 표현 튜터링 서비스`의 메인 백엔드 서버입니다.

이 서버는 문화어휘/학습 데이터 관리, 사용자 문장 저장, Feedback Server 연동 및 결과 저장을 담당합니다.  
문장 분석 자체는 별도 AI 서버(Feedback Server)에서 수행합니다.

## 기술 스택

- Node.js
- Express
- TypeScript
- PostgreSQL
- Sequelize ORM
- dotenv
- cors
- axios
- JWT(HS256)

## 프로젝트 구조

```txt
ieung-main-backend/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── middlewares/
│   ├── seed/
│   └── types/
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## 설치 방법

```bash
npm install
```

## `.env` 설정 방법

`.env.example`을 복사해 `.env` 파일을 생성하고 값을 채워주세요.

```env
PORT=4000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=ieung_db
DB_USER=postgres
DB_PASSWORD=password
DB_DIALECT=postgres

LLM_SERVER_URL=http://localhost:8080

FRONTEND_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

JWT_SECRET=change-this-to-a-long-random-secret
JWT_EXPIRES_IN_SECONDS=604800
PASSWORD_RESET_EXPIRES_IN_SECONDS=600
```

`FRONTEND_ORIGINS`는 CORS에서 허용할 프론트엔드 origin 목록입니다. 쉼표로 여러 개를 넣을 수 있습니다.

```env
FRONTEND_ORIGINS=http://localhost:3000,https://your-frontend.onrender.com
```

## DB 연결 방법

1. PostgreSQL 실행
2. `DB_NAME`에 설정한 DB 생성 (예: `ieung_db`)
3. `.env` 값 입력
4. DB 연결과 테이블 동기화를 확인합니다.

```bash
npm run db:sync
```

`db:sync`는 `.env`의 DB 설정으로 접속한 뒤 Sequelize 모델을 동기화하고, 성공 시 동기화된 모델 목록을 출력합니다.
서버 실행 시에도 Sequelize가 자동으로 `sync`를 수행합니다.

## 개발 서버 실행 방법

```bash
npm run dev
```

실행 후 Health Check:

```http
GET http://localhost:4000/health
```

## Seed 실행 방법

서버 시작 시 단어 데이터가 비어 있으면 자동 seed 됩니다.  
수동으로 넣고 싶다면:

```bash
npm run seed
```

기본 단어 데이터는 30개 문화어휘를 포함합니다.

```txt
korean,type,partOfSpeech,difficulty,tags,sortOrder,cultureNote
정,word,명사,intermediate,관계|감정|시간,1,한국 문화에서 인간관계와 시간의 축적을 설명하는 대표 정서어
...
흥겹다,word,형용사,intermediate,감정|분위기|문화,30,흥이 나고 즐거운 분위기를 나타내는 표현
```

## 인증

로그인/회원가입은 JWT Bearer 인증을 사용합니다. 회원가입 시 입력받는 퀴즈 문제와 정답은 비밀번호 재설정 용도입니다.  
비밀번호와 퀴즈 정답은 평문으로 저장하지 않고 해시로 저장하므로, 비밀번호 찾기는 기존 비밀번호 조회가 아니라 새 비밀번호 재설정 방식으로 동작합니다.

인증이 필요한 요청은 아래 헤더를 포함해야 합니다.

```http
Authorization: Bearer {accessToken}
```

현재 보호되는 라우트는 `/api/auth/me`, `/api/saved-expressions/*`, `/api/learning-logs/*`입니다.  
`/feedback`과 `/api/feedback`은 토큰이 있으면 사용자 문장으로 연결하고, 없으면 비로그인 문장으로 저장합니다.

## API 요청/응답 명세

모든 응답의 시간 값은 ISO 8601 문자열입니다. 사용자별 API는 JWT 토큰의 사용자 기준으로 동작합니다.

### 공통 에러 응답

```json
{
  "success": false,
  "message": "wordId is required",
  "error": "development 환경에서만 stack trace가 포함됩니다."
}
```

### `POST /api/auth/register`

아이디, 비밀번호, 비밀번호 재설정용 퀴즈 문제/정답으로 회원가입합니다.

요청 body:

```json
{
  "loginId": "ieung_user",
  "password": "password123",
  "quizQuestion": "가장 좋아하는 한국어 단어는?",
  "quizAnswer": "정"
}
```

응답 `201`:

```json
{
  "accessToken": "jwt-token",
  "tokenType": "Bearer",
  "expiresIn": 604800,
  "user": {
    "id": "user-uuid",
    "loginId": "ieung_user",
    "email": null,
    "name": "ieung_user",
    "nativeLanguage": null,
    "koreanLevel": "intermediate",
    "createdAt": "2026-06-06T00:00:00.000Z",
    "updatedAt": "2026-06-06T00:00:00.000Z"
  }
}
```

에러:

```json
{
  "success": false,
  "message": "loginId already exists"
}
```

### `POST /api/auth/login`

아이디와 비밀번호로 로그인하고 JWT를 발급합니다.

요청 body:

```json
{
  "loginId": "ieung_user",
  "password": "password123"
}
```

응답 `200`:

```json
{
  "accessToken": "jwt-token",
  "tokenType": "Bearer",
  "expiresIn": 604800,
  "user": {
    "id": "user-uuid",
    "loginId": "ieung_user",
    "email": null,
    "name": "ieung_user",
    "nativeLanguage": null,
    "koreanLevel": "intermediate",
    "createdAt": "2026-06-06T00:00:00.000Z",
    "updatedAt": "2026-06-06T00:00:00.000Z"
  }
}
```

에러:

```json
{
  "success": false,
  "message": "Invalid loginId or password"
}
```

### `GET /api/auth/me`

현재 JWT 사용자 정보를 반환합니다.

요청 header:

```http
Authorization: Bearer {accessToken}
```

응답 `200`:

```json
{
  "user": {
    "id": "user-uuid",
    "loginId": "ieung_user",
    "email": null,
    "name": "ieung_user",
    "nativeLanguage": null,
    "koreanLevel": "intermediate",
    "createdAt": "2026-06-06T00:00:00.000Z",
    "updatedAt": "2026-06-06T00:00:00.000Z"
  }
}
```

에러:

```json
{
  "success": false,
  "message": "Authorization bearer token is required"
}
```

### `POST /api/auth/password/question`

비밀번호 재설정 전에 사용자의 퀴즈 문제를 조회합니다.

요청 body:

```json
{
  "loginId": "ieung_user"
}
```

응답 `200`:

```json
{
  "loginId": "ieung_user",
  "quizQuestion": "가장 좋아하는 한국어 단어는?"
}
```

### `POST /api/auth/password/verify`

퀴즈 정답을 확인합니다. 정답이 맞으면 비밀번호 수정 단계에서 사용할 짧은 만료 시간의 `resetToken`을 발급합니다.

요청 body:

```json
{
  "loginId": "ieung_user",
  "quizAnswer": "정"
}
```

응답 `200`:

```json
{
  "verified": true,
  "resetToken": "password-reset-jwt-token",
  "expiresIn": 600
}
```

에러:

```json
{
  "success": false,
  "message": "Invalid loginId or quizAnswer"
}
```

### `POST /api/auth/password/reset`

답변 확인 단계에서 받은 `resetToken`으로 새 비밀번호를 설정합니다.

요청 body:

```json
{
  "resetToken": "password-reset-jwt-token",
  "newPassword": "newPassword123"
}
```

응답 `200`:

```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

에러:

```json
{
  "success": false,
  "message": "Invalid or expired password reset token"
}
```

### `GET /health`

서버 상태를 확인합니다.

응답 `200`:

```json
{
  "status": "ok",
  "message": "Ieung main backend is running"
}
```

### `GET /llmHealth`

백엔드가 8080 포트의 LLM 서버에 연결할 수 있는지 확인합니다. 기본 대상은 `LLM_SERVER_URL`이며, 설정하지 않으면 `http://localhost:8080`으로 요청합니다.

응답 `200`:

```json
{
  "status": "ok",
  "connected": true,
  "llmServerUrl": "http://localhost:8080",
  "llmStatusCode": 200,
  "responseTimeMs": 12
}
```

응답 `503`:

```json
{
  "status": "error",
  "connected": false,
  "llmServerUrl": "http://localhost:8080",
  "message": "LLM server is not reachable",
  "responseTimeMs": 3004
}
```

### `GET /api/words`

활성화된 문화어휘 전체 목록을 `sortOrder` 오름차순으로 반환합니다. 관리/상세 목록이 필요할 때 사용합니다.

응답 `200`:

```json
[
  {
    "id": "word-uuid",
    "korean": "정",
    "type": "word",
    "partOfSpeech": "명사",
    "romanization": "정",
    "englishTitle": "정",
    "shortMeaningKo": "한국 문화에서 인간관계와 시간의 축적을 설명하는 대표 정서어",
    "shortMeaningEn": "",
    "usageTip": "관계, 감정, 시간",
    "difficulty": "intermediate",
    "tags": ["관계", "감정", "시간"],
    "sortOrder": 1,
    "cultureNote": "한국 문화에서 인간관계와 시간의 축적을 설명하는 대표 정서어",
    "createdAt": "2026-06-02T00:00:00.000Z",
    "updatedAt": "2026-06-02T00:00:00.000Z"
  }
]
```

### `GET /api/words/summary`

프론트의 전체 단어 카드/목록 화면에서 쓰기 좋은 가벼운 목록을 반환합니다. 30개 단어를 한 번에 보여줄 때 이 API를 사용합니다.

응답 `200`:

```json
[
  {
    "id": "word-uuid",
    "korean": "정",
    "type": "word",
    "partOfSpeech": "명사",
    "romanization": "Jeong",
    "englishTitle": "Affection / Attachment",
    "shortMeaningKo": "무엇을 느껴서 생기는 마음.",
    "shortMeaningEn": "A feeling that arises from experiencing something.",
    "difficulty": "intermediate",
    "tags": ["관계", "감정", "시간"],
    "sortOrder": 1
  }
]
```

### `GET /api/words/today`

사용자 학습 진행도에 맞춰 오늘의 단어를 반환합니다. 단어는 `sortOrder` 순서대로 제공되며, 사용자가 현재 단어를 `/api/learning-logs/complete`로 완료하면 다음 순서 단어가 오늘의 단어가 됩니다.

요청 header:

```http
Authorization: Bearer {accessToken}
```

토큰이 없으면 첫 번째 활성 단어를 반환합니다.

응답 `200`:

```json
{
  "word": {
    "id": "word-uuid",
    "korean": "눈치",
    "type": "word",
    "partOfSpeech": "명사",
    "romanization": "nunchi",
    "englishTitle": "Social awareness / Reading the room",
    "shortMeaningKo": "다른 사람의 마음이나 생각, 태도 등을 살피는 태도.",
    "shortMeaningEn": "The ability to read another person's mind, thoughts, attitude, or the situation.",
    "usageTip": "상대방의 반응이나 분위기를 조심스럽게 살필 때 사용합니다.",
    "difficulty": "intermediate",
    "tags": ["관계", "상황판단", "사회생활"],
    "sortOrder": 2,
    "cultureNote": "상대의 마음과 상황을 읽는 한국어 대화 문화와 연결된 표현",
    "examples": [
      {
        "id": "example-uuid",
        "exampleKo": "그는 눈치가 빨라서 분위기를 금방 파악했다.",
        "exampleEn": "He was quick to read the room and understood the atmosphere right away.",
        "exampleType": "spoken"
      }
    ],
    "patterns": []
  },
  "progress": {
    "totalWords": 30,
    "completedWords": 1,
    "currentOrder": 2,
    "allCompleted": false
  }
}
```

모든 단어를 완료한 경우:

```json
{
  "word": null,
  "progress": {
    "totalWords": 30,
    "completedWords": 30,
    "currentOrder": null,
    "allCompleted": true
  }
}
```

프론트 적용 흐름:

1. 홈/오늘의 단어 화면 진입 시 `GET /api/words/today`를 호출합니다.
2. 학습 완료 버튼을 누르면 `POST /api/learning-logs/complete`에 현재 `word.id`를 보냅니다.
3. 완료 요청 성공 후 `GET /api/words/today`를 다시 호출하면 다음 `sortOrder` 단어가 내려옵니다.
4. 전체 30개 목록 화면에서는 `GET /api/words/summary`를 호출해 `korean`, `romanization`, `englishTitle`, `shortMeaningKo`, `shortMeaningEn`을 카드에 표시합니다.

### `GET /api/words/:wordId`

특정 문화어휘 상세 정보를 반환합니다.

응답 `200`:

```json
{
  "id": "word-uuid",
  "korean": "서운하다",
  "type": "word",
  "partOfSpeech": "형용사",
  "romanization": "서운하다",
  "englishTitle": "서운하다",
  "shortMeaningKo": "관계 속 기대가 충족되지 않았을 때 느끼는 감정을 나타내는 표현",
  "shortMeaningEn": "",
  "fullMeaningKo": "관계 속 기대가 충족되지 않았을 때 느끼는 감정을 나타내는 표현",
  "fullMeaningEn": "",
  "usageTip": "감정, 관계, 기대",
  "difficulty": "intermediate",
  "tags": ["감정", "관계", "기대"],
  "sortOrder": 3,
  "cultureNote": "관계 속 기대가 충족되지 않았을 때 느끼는 감정을 나타내는 표현",
  "isActive": true,
  "createdAt": "2026-06-02T00:00:00.000Z",
  "updatedAt": "2026-06-02T00:00:00.000Z",
  "examples": [],
  "patterns": []
}
```

에러:

```json
{
  "success": false,
  "message": "Word not found"
}
```

### `POST /feedback`

프론트에서 사용자가 작성한 문장을 보내면, 백엔드는 문장을 저장하고 Flask 검증 서버에 분석을 요청한 뒤 결과를 DB에 저장합니다. 프론트 응답은 Flask 검증 서버 양식과 거의 동일하게 반환합니다.

`POST /api/feedback`도 같은 요청/응답 형식을 지원하는 호환 라우트입니다.

요청 body:

```json
{
  "wordId": "uuid",
  "sentence": "친구가 연락을 안 해서 서운했어요."
}
```

백엔드가 LLM/Flask 검증 서버로 보내는 요청:

```http
POST {LLM_SERVER_URL}/feedback
```

```json
{
  "sentence": "친구가 연락을 안 해서 서운했어요."
}
```

응답 `201`:

```json
{
  "original_sentence": "친구가 연락을 안 해서 서운했어요.",
  "target_word": "서운하다",
  "grammar": {
    "correct": true,
    "reason": "[한국어기초사전] ... [우리말샘] ...",
    "suggestion": null
  },
  "meaning": {
    "correct": true,
    "reason": "[한국어기초사전] ... [우리말샘] ...",
    "suggestion": null
  },
  "tpo": {
    "best_fit": "반격식",
    "reason": "[모두의 말뭉치] ...",
    "공적": "...",
    "사적": "...",
    "반격식": "..."
  },
  "summary": "문장과 단어 의미가 자연스럽게 연결됩니다.",
  "meta": {
    "user_sentence_id": "uuid",
    "feedback_result_id": "uuid",
    "request_id": "uuid",
    "score": null,
    "feedback_server_version": "unknown"
  }
}
```

프론트가 주로 사용하는 필드는 Flask 검증 서버 응답과 동일하게 `original_sentence`, `target_word`, `grammar`, `meaning`, `tpo`, `summary`입니다.  
백엔드 저장 추적에 필요한 값은 `meta`에만 추가됩니다.

에러:

```json
{
  "success": false,
  "message": "sentence is required"
}
```

### `POST /api/saved-expressions`

검증 결과에서 사용자가 보관하고 싶은 표현을 저장합니다.

요청 header:

```http
Authorization: Bearer {accessToken}
```

요청 body:

```json
{
  "wordId": "word-uuid",
  "userSentenceId": "user-sentence-uuid",
  "feedbackResultId": "feedback-result-uuid",
  "savedExpression": "친구가 연락을 안 해서 서운했어요.",
  "memo": "관계에서 기대가 어긋난 상황에 쓰기"
}
```

응답 `201`:

```json
{
  "id": "saved-expression-uuid",
  "userId": "user-uuid",
  "wordId": "word-uuid",
  "userSentenceId": "user-sentence-uuid",
  "feedbackResultId": "feedback-result-uuid",
  "originalSentence": "친구가 연락을 안 해서 서운했어요.",
  "savedExpression": "친구가 연락을 안 해서 서운했어요.",
  "memo": "관계에서 기대가 어긋난 상황에 쓰기",
  "createdAt": "2026-06-02T00:00:00.000Z",
  "updatedAt": "2026-06-02T00:00:00.000Z"
}
```

필수값:

- `userSentenceId`
- `savedExpression`

에러:

```json
{
  "success": false,
  "message": "userSentenceId is required"
}
```

### `GET /api/saved-expressions/me`

현재 사용자 기준 저장 표현 목록을 최신순으로 반환합니다.

요청 header:

```http
Authorization: Bearer {accessToken}
```

응답 `200`:

```json
[
  {
    "id": "saved-expression-uuid",
    "userId": "user-uuid",
    "wordId": "word-uuid",
    "userSentenceId": "user-sentence-uuid",
    "feedbackResultId": "feedback-result-uuid",
    "originalSentence": "친구가 연락을 안 해서 서운했어요.",
    "savedExpression": "친구가 연락을 안 해서 서운했어요.",
    "memo": "관계에서 기대가 어긋난 상황에 쓰기",
    "createdAt": "2026-06-02T00:00:00.000Z",
    "updatedAt": "2026-06-02T00:00:00.000Z",
    "word": {
      "id": "word-uuid",
      "korean": "서운하다",
      "romanization": "서운하다",
      "englishTitle": "서운하다",
      "shortMeaningKo": "관계 속 기대가 충족되지 않았을 때 느끼는 감정을 나타내는 표현",
      "shortMeaningEn": ""
    }
  }
]
```

### `POST /api/learning-logs/start`

사용자가 특정 문화어휘 학습을 시작한 기록을 저장합니다.

요청 header:

```http
Authorization: Bearer {accessToken}
```

요청 body:

```json
{
  "wordId": "word-uuid"
}
```

응답 `201`:

```json
{
  "id": "learning-log-uuid",
  "userId": "user-uuid",
  "wordId": "word-uuid",
  "status": "started",
  "completedAt": null,
  "createdAt": "2026-06-02T00:00:00.000Z",
  "updatedAt": "2026-06-02T00:00:00.000Z"
}
```

### `POST /api/learning-logs/complete`

사용자가 특정 문화어휘 학습을 완료한 기록을 저장합니다.

요청 header:

```http
Authorization: Bearer {accessToken}
```

요청 body:

```json
{
  "wordId": "word-uuid"
}
```

응답 `201`:

```json
{
  "id": "learning-log-uuid",
  "userId": "user-uuid",
  "wordId": "word-uuid",
  "status": "completed",
  "completedAt": "2026-06-02T00:00:00.000Z",
  "createdAt": "2026-06-02T00:00:00.000Z",
  "updatedAt": "2026-06-02T00:00:00.000Z"
}
```

에러:

```json
{
  "success": false,
  "message": "wordId is required"
}
```

### `GET /api/learning-logs/me`

현재 사용자 기준 학습 기록을 최신순으로 반환합니다.

요청 header:

```http
Authorization: Bearer {accessToken}
```

응답 `200`:

```json
[
  {
    "id": "learning-log-uuid",
    "userId": "user-uuid",
    "wordId": "word-uuid",
    "status": "completed",
    "completedAt": "2026-06-02T00:00:00.000Z",
    "createdAt": "2026-06-02T00:00:00.000Z",
    "updatedAt": "2026-06-02T00:00:00.000Z",
    "word": {
      "id": "word-uuid",
      "korean": "정",
      "romanization": "정",
      "englishTitle": "정",
      "shortMeaningKo": "한국 문화에서 인간관계와 시간의 축적을 설명하는 대표 정서어",
      "shortMeaningEn": ""
    }
  }
]
```

### `DELETE /api/learning-logs/me`

현재 사용자 기준 학습 기록을 모두 삭제하고 오늘의 단어 진행도를 처음으로 되돌립니다. 삭제 후 `GET /api/words/today`를 다시 호출하면 첫 번째 단어부터 반환됩니다.

요청 header:

```http
Authorization: Bearer {accessToken}
```

요청 body는 없습니다.

응답 `200`:

```json
{
  "success": true,
  "deletedCount": 30,
  "message": "Learning progress has been reset"
}
```

프론트 요청 예시:

```ts
await fetch(`${API_BASE_URL}/api/learning-logs/me`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${accessToken}`
  }
});

const todayWordResponse = await fetch(`${API_BASE_URL}/api/words/today`, {
  headers: {
    Authorization: `Bearer ${accessToken}`
  }
});
const todayWord = await todayWordResponse.json();
```
## Feedback Server 연동 방식

메인 백엔드는 아래 주소로 분석 요청을 전달합니다.

```http
POST {LLM_SERVER_URL}/feedback
```

Feedback Server 응답은 아래 형태를 우선 지원합니다.

```json
{
  "original_sentence": "...",
  "targetWord": "...",
  "grammar": {
    "correct": true,
    "reason": "[한국어기초사전] ... [우리말샘] ...",
    "suggestion": null
  },
  "meaning": {
    "correct": true,
    "reason": "[한국어기초사전] ... [우리말샘] ...",
    "suggestion": null
  },
  "tpo": {
    "best_fit": "반격식",
    "reason": "[모두의 말뭉치] ...",
    "공적": "...",
    "사적": "...",
    "반격식": "..."
  },
  "summary": "..."
}
```

`grammar`, `meaning`, `tpo`는 각각 JSONB 컬럼에 원형에 가깝게 저장되고, 전체 응답은 `rawResponse`에도 함께 저장됩니다.

요청 전 처리:

1. Word/예문/패턴 조회
2. `UserSentence` 저장
3. Feedback Server 호출
4. 응답 결과를 `FeedbackResult`에 저장
5. 프론트엔드 응답 형식으로 반환

## Feedback Server 장애 시 fallback

Feedback Server가 꺼져 있거나 네트워크/타임아웃 오류가 나도 메인 서버는 정상 동작합니다.

- 기본 fallback 피드백 생성
- fallback 결과도 `FeedbackResult` 테이블에 저장
- 프론트엔드에는 fallback 응답 반환

따라서 분석 서버 장애가 있어도 사용자 문장과 피드백 결과 기록 흐름은 유지됩니다.
