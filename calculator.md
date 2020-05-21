# Node.js 사용자 정의 모듈을 활용한 계산기 만들기. 
## 1. 모듈이란? 
### 1.  정의: 독립된 기능을 갖는 함수 or 파일들의 모임.
### 2. 사용하는 이유: 관리해야하는 프로젝트의 크기가 커질수록 절차 지향으로 모든 기능들을 한 파일에 써내려 가는 것보다, 기능 별로 함수를 만들어 함수 모듈을 호출하는 방식으로 프로그래밍을 하면 유지 보수가 수월해진다. (로봇 예시 참고)
### 3. 사용법: module.exports 또는 exports 객체를 통해 정의하고 외부로 공개한다. 그리고 공개된 모듈은 require 함수를 사용하여 임포트한다.


## 2. 계산기 만들기
### 1. 프론트 
* 구성: 1) 두 개 값들을 입력할 수 있는 칸 2) +, -, *, / 버튼 
* 사용법: 숫자 1, 2 값을 입력하고 원하는 계산 방식에 해당하는 버튼을 누르면 서버에 콘솔로 결과 값이 찍힌다. 

```html
<!DOCTYPE html>
<html>
<head>
    <link rel='stylesheet' href='/stylesheets/style.css'/>
</head>
<body>
<p><%= title %></p>
<form action="/" method="post">
    
    <label for="fname">숫자1:</label>
    <input type="number" name="number1"><br><br>
    <label for="fname">숫자2:</label>
    <input type="number" name="number2"><br><br>
    

        <input type="submit" value="+" name ="operator">

        <input type="submit" value="-" name ="operator">

        <input type="submit" value="*" name ="operator">

        <input type="submit" value="/" name ="operator">


</form>
</body>
</html>

```
* 1) form - post method로 값을 받아온다. 
* 2) 계산 방식에 대한 submit 버튼을 만들고, name을 'operator'로 통일한다. 추후 name을 기준으로 value 값 차이를 판단하여, 다른 함수 모듈을 사용하는 조건문을 만들 것이다. 


### 2. 백 - 첫번째
* 우선, 기본적인 서버 연결, view engine, get으로 앞서 만든 ejs 파일 렌더링 하기를 해준다. 
* 과정상, 사용자 모듈을 먼저 만든 후 백 마무리 코드를 적을 예정이다. 
```javascript
const express = require('express')
const app = express()
const port = 3600
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

app.set('view engine','ejs')
app.set('views','./views')


app.get('/',function(req,res){
    res.render('board',{title:'계산기'})
})


```

### 3. 사용자 정의 모듈 만들기
  
```javascript
module.exports.sum = function(req){
    try{
        a = Number(req.body.number1)
        b = Number(req.body.number2) 

        //number로 안바꾸면 string으로 받아와서 숫자 계산이 안되므로 number로 바꿔서 계산해준다.  서버단에서 console.log (typeof req.body.number1) > string이 찍히는 것을 보고 모듈 수정함. 
        return a + b;
    }
    catch(err){
        console.log(err)
    }
};

// try, catch 사용 권장. 

module.exports.sub = function(req){
    try{
        a = Number(req.body.number1)
        b = Number(req.body.number2) 
        return a - b;
    }
    catch(err){
        console.log(err)
    }
};

module.exports.mul = function(req){
    try{
        a = Number(req.body.number1)
        b = Number(req.body.number2) 
        return a * b;
    }
    catch(err){
        console.log(err)
    }
};

module.exports.div = function(req){
    try{
        a = Number(req.body.number1)    
        b = Number(req.body.number2) 
        return a / b;
    }
    catch(err){
        console.log(err)
    }
};
```
* 1) calculator.js를 모듈로 불러와서, sum, sub, mul, div 계산을 할 수 있도록 한다.
* 2) sum, sub, mul, div을 각각 다른 모듈 파일로 만들지 않고 calculator 모듈 안에서 다르게 처리할 수 있도록 module.exports.'계산방식이름' 형식으로 만든다. 
* 3) 서버단에서 최대한 간결한 코드를 사용할 수 있도록, 모듈 안에서 req 값을 parse하여 원하는 값을 받을 수 있도록 함수를 구성하였다. 

### 4. 백 - 마무리
* 앞서 만든 백-첫번째 코드에 백-마무리 코드를 추가해준다. 
```javascript
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:true}));



var cal = require('./calculator');

app.post('/',function(req,res){

    // console.log('function(req):',req)
    if (req.body.operator == '+') {
        console.log('sum :', cal.sum(req)) // +와 , 차이 
    } else if (req.body.operator == '-') {
        console.log('sub :', cal.sub(req))
    } else if (req.body.operator == '/') {
        console.log('div :', cal.div(req))
    } else if (req.body.operator == '*') {
        console.log('mul :', cal.mul(req))
    } else {
        console.error();
    }

    // console.log('sum: ' ,cal.sum(req))
    // console.log('type:', typeof req.body.number1)
    res.redirect("/")
});
```
* 1) require를 사용하여 cal 변수에 calculator.js 모듈을 불러온다. 
* 2) post 형식으로 '/' 경로에 접근할 경우, if문을 통해 원하는 모듈을 사용할 수 있도록 하는 조건문을 만든다. 

### 5. 계산기 완성
* 브라우저: <br> ![캡처1](image/캡처1.png)
* 결과값 (더하기 계산 예시): <br> ![캡처2](image/캡처2.png)
