const express = require("express");
const MongoClient = require("mongodb").MongoClient;
//데이터베이스의 데이터 입력,출력을 위한 함수명령어 불러들이는 작업
const app = express();
const port = 3000;

//ejs 태그를 사용하기 위한 세팅
app.set("view engine","ejs");
//사용자가 입력한 데이터값을 주소로 통해서 전달되는 것을 변환(parsing)
app.use(express.urlencoded({extended: true}));
app.use(express.json()) 
//css/img/js(정적인 파일)사용하려면 이코드를 작성!
app.use(express.static('public'));

let db; //데이터베이스 연결을 위한 변수세팅(변수의 이름은 자유롭게 지어도 됨)

MongoClient.connect("mongodb+srv://khp2337:cogktkfkd8214@cluster0.kjr1egt.mongodb.net/?retryWrites=true&w=majority",function(err,result){
    //에러가 발생했을경우 메세지 출력(선택사항)
    if(err) { return console.log(err); }

    //위에서 만든 db변수에 최종연결 ()안에는 mongodb atlas 사이트에서 생성한 데이터베이스 이름
    db = result.db("board_final");

    //db연결이 제대로 됬다면 서버실행
    app.listen(port,function(){
        console.log("서버연결 성공");
    });

});


app.get("/",function(req,res){
    res.render("index.ejs");
});


//회원가입 페이지 화면으로 가기위한 경로요청
app.get("/join",(req,res)=>{
    res.render("join.ejs");
})

//회원가입 데이터 db에 저장 요청
app.post("/joindb",(req,res)=>{
    // 아이디 -> memberid:아이디입력한거
    // 비밀번호 -> memberpass:비밀번호입력한거

    db.collection("members").findOne({memberid:req.body.memberid},(err,member)=>{
        //찾은 데이터값이 존재할 때 -> 중복된 아이디가 있음
        if(member){
            //자바스크립트 구문을 삽입할 때도 사용가능
            res.send("<script> alert('이미 가입된 아이디입니다'); location.href='/join'; </script>")
        }
        else{
            db.collection("count").findOne({name:"회원"},(err,result)=>{
                db.collection("members").insertOne({
                    memberno:result.memberCount,
                    memberid:req.body.memberid,
                    memberpass:req.body.memberpass
                },(err)=>{
                    db.collection("count").updateOne({name:"회원"},{$inc:{memberCount:1}},(err)=>{
                        res.send("<script>alert('회원가입 완료'); location.href='/login' </script>")
                    })
                })

            });
        }
    })
})


//로그인 화면페이지 경로요청
app.get("/login",(req,res)=>{
    res.render("login.ejs")
})


//로그인 처리 요청경로
app.post("/logincheck",(req,res)=>{

    res.redirect("/"); //로그인 성공시 메인페이지로 이동

})

//로그아웃 처리 요청경로
app.get("/logout",(req,res)=>{
    //로그아웃 함수 적용후 메인페이지로 이동

})





