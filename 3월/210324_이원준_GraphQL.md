# GraphQL



### 1. GraphQL이란?

- 페이스북에서 만든 언어로 쿼리 언어이지만 같은 쿼리 언어인 sql과는 쓰이는 방식의 차이가 매우 큽니다.
- sql의 경우 주로 backend에서 db에 저장된 데이터를 가져오기 위해 사용하지만 gql의 경우 클라이언트가 서버로 부터 데이터를 효율적으로 가져오는 것이 목적입니다.
- 서버로 부터 데이터를 가져온다는 점에서 같은 쿼리언어인 sql 보다는 REST API와 비슷한 역할을 합니다.



### 2. REST API와 차이점

- 엔드포인트

  - REST API의 경우 한개의 엔드포인트에서 한개의 작업만을 처리하기 때문에 여러개의 엔드포인트가 존재합니다.
  - gql의 경우 모든 작업을 한개의 엔드포인트에서 처리합니다.

  ![img](210324_이원준_GraphQL.assets/graphql-mobile-api.png)

- UnderFetching/ OverFetching

  - REST API의 경우 이미 요청에 대한 응답이 정해져 있기 때문에 필요한 정보보다 더 많거나 필요없는 정보를 가져오는 경우가 있습니다.
  - gql의 경우 필요한 정보만 클라이언트에서 요청이 가능해서 필요한 정보만 가져올 수 있습니다.
  - 하지만, 고정된 크기의 요청이 많을 때는 RestAPI 보다 요청량이 많을 수 있습니다. 

- 통신 방식?

  - REST API의 경우 GET, POST, PATCH, PUT, DELETE 의 방식이 존재합니다.
  - gql의 경우 query(GET에 대응), mutaion(POST, PATCH, PUT, DELETE) 만 존재합니다.

- 그외 차이점

  - 단순 text의 경우 문제가 없으나 file 전송의 경우 gql의 경우 base64로 인코딩 과정을 거치는등 별도의 처리가 필요합니다.
  - 



### 3. 사용 예시

- 서버

  ```gql
  type Query {
    users: [User]
    user(id: ID): User
    limits: [Limit]
    limit(UserId: ID): Limit
    paymentsByUser(userId: ID): [Payment]
  }
  
  type User {
  	id: ID!
  	name: String!
  	sex: SEX!
  	birthDay: String!
  	phoneNumber: String!
  }
  
  type Limit {
  	id: ID!
  	UserId: ID
  	max: Int!
  	amount: Int
  	user: User
  }
  
  type Payment {
  	id: ID!
  	limit: Limit!
  	user: User!
  	pg: PaymentGateway!
  	productName: String!
  	amount: Int!
  	ref: String
  	createdAt: String!
  	updatedAt: String!
  }
  ```

  

- 클라이언트

  ```gql
  {
    paymentsByUser(userId: 10) {
      id
      amount
    }
  }
  
  {
    paymentsByUser(userId: 10) {
      id
      amount
      user {
        name
        phoneNumber
      }
    }
  }
  ```

  

### 3. 개인적의견

- 단순히 데이터를 가져와서 보여주는 경우 쓸데 없는 컬럼을 제외하고 필요한 컬럼을 한번에 가져올 수 있다는 점은 네트워크 사용량과 콜백 지옥을 해결하는데 크게 도움이 될 것 같다.

- 하지만 데이터를 변형해야 하는 경우 서버단에서 그에 대한 함수를 작성하고 클라이언트에서 mutation에 어떤 함수가 있는지 인자를 알아야 한다는 점에서 endpoint를 알아야 하는 REST API와 어떤 mutaion이 있는지 알아야 하는 gql 이 생산성 차이가 있는지 의문이다.



### 4. 참고자료

- https://graphql-kr.github.io/
- https://graphql.org/
- https://tech.kakao.com/2019/08/01/graphql-basic/
- https://jongbeom-dev.tistory.com/184?category=902825
- https://www.holaxprogramming.com/2018/01/20/graphql-vs-restful-api/
- https://hoony-gunputer.tistory.com/entry/Graphql