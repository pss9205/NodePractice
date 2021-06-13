# Node JS Practice #2 - WEB API Server(NodeBird-API)

From `Node.js 교과서`

### 스스로 해보기 항목

1. GET Follower/Following API - [커밋 링크](https://github.com/pss9205/NodePractice/pull/17/commits/98164f9b2d5cf744265c2f418b643827c15d82fb)

- `following/my`와 `follower/my`로 추가
- getFollowings와 getFollowers를 통해 목록 가져옴
- attributes와 joinTableAttributes를 사용하여 정보 제한

2. 도메인간 API Limit 제한 다르게 하기 - [커밋 링크](https://github.com/pss9205/NodePractice/pull/17/commits/d352999529f1ba57231b9572f7ff57def5b2e0f8)

- free와 paid 두개의 APILimiter 생성
- 미들웨어에서 domain 조회 후 타입에 따라 APILimiter 다르게 리턴

3. Frontend 와 Server Secret 다르게 하기 - [커밋 링크](https://github.com/pss9205/NodePractice/pull/18/commits/3a66d725c901b327aaec8b0d438026d173242733)

- Domain에 frontSecret 추가
- /token API에는 frontSecret 사용하도록 수정
- 기존 서버용 키와 다른 점을 잘 모르겠음.
