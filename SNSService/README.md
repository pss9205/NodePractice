# Node JS Pracie #1 - SNS Service

From `Node.js 교과서`

### Using

- Sequelize
- Nunjucks
- Express
- morgan
- multer
- dotenv
- passport

### 스스로 해보기 항목

1. 팔로잉 끊기 - [커밋 링크](https://github.com/pss9205/NodePractice/commit/a16c6364c1bc145ad57ad56cb3c2ce373ca9f39a#diff-4fa0a6789ad12d096bbaadce87caa64c63e9be651dfca979a67923a83d82185f)

- 내 프로필의 팔로잉 목록에서 언팔로우 가능하도록 구현
- 각 유저 이름 옆에 언팔로우 버튼 추가
- user객체에 제공되는 getFollowings와 removeFollowings를 통해 언팔로우 처리

2. 프로필 변경하기 - [커밋 링크](https://github.com/pss9205/NodePractice/commit/d756973fdd1cf40ed0680271448f0fb18ec36612#diff-4fa0a6789ad12d096bbaadce87caa64c63e9be651dfca979a67923a83d82185f)

- 변경 가능한 정보는 닉네임으로 한정(이메일은 아이디이기 때문)
- 변경 버튼 누르면 닉네임 입력 받고, 이를 parameter로 넘겨줌
- sequelize update 메소드를 통해 새로운 닉네임으로 DB 저장

3. 좋아요 및 좋아요 취소 지원 - [커밋 링크](https://github.com/pss9205/NodePractice/commit/61c89e59b4a4ccf3050f1b1d1ecd30e6278c8a9a#diff-4fa0a6789ad12d096bbaadce87caa64c63e9be651dfca979a67923a83d82185f)

- 좋아요 버튼 추가. 좋아요한 상태면 취소 버튼 출력
- User와 Post사이의 새로운 관계 추가 필요(PostLikes)
- post router에 /like, /dislike 처리 추가. post 객체의 addlikes와 removelikes를 통해 좋아요/취소를 처리

4. 게시글 삭제 - [커밋 링크](https://github.com/pss9205/NodePractice/commit/b14c1caeda21a3d42ad7d3e6df6078f212ae360a#diff-4fa0a6789ad12d096bbaadce87caa64c63e9be651dfca979a67923a83d82185f)

- 게시글 삭제 버튼 추가. 내 글에서만 보이도록 처리
- sequelize destory를 사용해서 게시글 제거

5. deserializeUser 캐싱 - [커밋 링크](https://github.com/pss9205/NodePractice/commit/61c89e59b4a4ccf3050f1b1d1ecd30e6278c8a9a#diff-4fa0a6789ad12d096bbaadce87caa64c63e9be651dfca979a67923a83d82185f)

- 캐시 저장을 위한 객체 추가 생성
- 첫 deserialize 단계에서 캐싱
- 사용자 관련 정보가 업데이트 된 경우(eg> 닉네임이 바뀐 경우, 좋아요한 글이 추가된 경우) dirty flag 설정
- 캐시 데이터 조회시 dirty여부 확인. dirty상태인 경우 DB에서 새로 조회
