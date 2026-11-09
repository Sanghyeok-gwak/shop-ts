import express from "express"
import pg from 'pg'
import cors from 'cors'

// app 객체 생성
const app = express();

// 클라우드 컴에 배포
// process.env는 실행 환경의 환경변수가 객체 형태로 들어있음
const PORT = process.env.PORT || 8000;

//cors(Cross-Origin Resource Sharing, 교차출처 리소스 공유)
// 브라우저가 보안상의 이유로 api 요청을 차단 방지 라이브러리
// CLIENT_URL - 환경변수에 배포된 프런트 주소를 넣음
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
}))

// postgreSQL 연결 설정
/*const db = new pg.Client({
    host: "localhost",
    user: "jsuser",
    password: "pwjs",
    database: "jsdb"
});*/

// pg.Pool: 연결을 여러 개 관리하고, 끊어진 연결은 자동으로 다시 만듬
const db = process.env.DATABASE_URL 
            ? new pg.Pool({
                connectionString: process.env.DATABASE_URL,
                ssl: { rejectUnauthorized: false}
            })
            : new pg.Pool({
                host: "localhost",
                user: "jsuser",
                password: "pwjs",
                database: "jsdb"
            });

// 쉬고 있는 연결에서 오류가 나도 서버가 종료되지 않도록 처리
db.on("error", (err) => {
    console.log("PostgreSQL 연결 오류!! ", err);
})

// PostgreSQL에 연결 확인
// "SELECT 1" - 테스트용 쿼리
db.query("SELECT 1", (err) => {
    if(err){
        console.log("PostgreSQL 연결 오류!!", err);
        return;
    }
    console.log("PostgreSQL 연결 성공!!");
})

// 기본 라우트 설정
app.get('/', (req, res) => {
    res.send("<h1>API 서버와 DB 연동</h1>")
})

// 상품 목록 조회
// db.query(sql, 데이터, 콜백함수)
app.get("/api/products", (req, res) => {
    // 최신 등록 순으로 내림 차순
    const sql = "SELECT * FROM product ORDER BY created_at DESC";
    db.query(sql, (err, result) => {  // results -> result로 변경
        if(err){
            console.log("상품 조회 오류!! ", err);
            res.send("상품 조회 중 오류 발생!!");
            return;
        }
        // res.json(results); //json 형태로 응답(전체 정보 출력)
        res.json(result.rows);
    });
});

// 본문 요청 파싱
app.use(express.json());

// 상품 등록
app.post("/api/products", (req, res) => {
    const {productName, price, description} = req.body; // 요청한 속성 데이터
    const sql = "INSERT INTO product(product_name, price, description) "
         + "VALUES ($1, $2, $3)";
    db.query(sql, [productName, price, description], (err) => {
        if(err){
            console.log("상품 조회 오류!! ", err);
            res.send("상품 조회 중 오류 발생!!");
            return;
        }
        res.send("상품 등록 완료!!");
    } );
})

// 상품 상세 보기(1건)
app.get("/api/products/:id", (req, res) => {
    const productId = req.params.id;
    const sql = "SELECT * FROM product WHERE id = $1"
    db.query(sql, [productId], (err, result) => {
        if(err){
            console.log("상품 조회 에러: ", err);
            res.send("상품 조회 중 오류가 발생했습니다.");
            return;
        }
        res.json(result.rows[0]);  //1건(맨 앞)
    });
});

// 상품 삭제(1건)
// app.delete(경로, 콜백함수)
app.delete("/api/products/:id", (req, res) => {
    const productId = req.params.id;
    const sql = "DELETE FROM product WHERE id = $1";
    db.query(sql, [productId], (err) => {
        if(err){
            console.log("상품 조회 에러: ", err);
            res.send("상품 조회 중 오류가 발생했습니다.");
            return;
        }
        res.send("상품이 성공적으로 삭제되었습니다.");
    });
});

// 상품 수정
// app.put(경로, 콜백함수)
app.put("/api/products/:id", (req, res) => {
    // 수정하려면 이미 존재하는 상품(id)을 가져오기
    const productId = req.params.id;
    const {productName, price, description} = req.body; //수정된 데이터를 가져옴
    const sql = "UPDATE product SET product_name=$1, price=$2, "
            + "description=$3 WHERE id=$4";
    db.query(sql, [productName, price, description, productId], (err) => {
        if(err){
            console.log("상품 조회 에러: ", err);
            // 500: 코드 오류, 404: 페이지 없음, 200: 정상
            res.status(501).send("상품 조회 중 오류가 발생했습니다.");
            return;
        }
        res.status(200).send("상품이 성공적으로 수정되었습니다.");
    })
})

// 회원 API 개발(REST API)
// 이전 통신방식(get, post)
// REST API - get, post, put, delete
// 회원 목록
app.get("/api/users", (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, result) => {
        if(err){
            console.log("회원 조회 에러: ", err);
            // 500: 코드 오류, 404: 페이지 없음, 200: 정상
            res.send("회원 조회 중 오류가 발생했습니다.");
            return;
        }
        res.json(result.rows);  // 프런트(요청)에 반환
    })
});

// // 회원 가입
app.post("/api/users", (req, res) => {
    const {username, password, email} = req.body; //요청 본문의 데이터
    const sql = "insert into users(username, password, email) "
            + "values ($1, $2, $3)";
    db.query(sql, [username, password, email], (err) => {
        if(err){
            console.log("회원 가입 에러: ", err);
            res.send("회원 가입 중 오류가 발생했습니다.");
            return;
        }
        res.send("회원이 성공적으로 가입되었습니다.");
    });
});

// 회원 조회(로그인)
app.get("/api/users/:username", (req, res) => {
    const username = req.params.username; //요청한 아이디
    const sql = "SELECT * FROM users WHERE username = $1";
    db.query(sql, [username], (err, result) => {
        if(err){
            console.log("회원 조회 에러: ", err);
            res.send("회원 조회 중 오류가 발생했습니다.");
            return;
        }
        res.json(result.rows[0]);  //요청한 곳으로 반환(응답)
    });
})


// 서버 실행
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}에서 서버 실행중...`);
})