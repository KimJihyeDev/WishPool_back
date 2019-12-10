var express = require('express');
var router = express.Router();
const bcrypt =require('bcrypt');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('./middlewares'); 

var User = require('../schemas/user');

router.get('/', (req,res,next)=>{
  User.find({})
  .then((users) => {
    res.json(users);
  })
  .catch((err) => {
    console.error(err);
    next(err);
  });
});  

// 회원가입
// 가입하자마자 로그인 되도록 처리
router.post('/entry',(req,res,next)=> {
  // 기존에 가입된 회원인지 확인(나중에 처리)


  // 단방향 해쉬 암호화(해독불가)
  const hash = bcrypt.hashSync(req.body.password,12);
  
  // 미가입 상태일 경우 신규회원 가입 처리
  const user = new User({

    userName:req.body.userName,
    userId:req.body.userId,
    password:hash,
    email:req.body.email,
    phone:req.body.phone,
    nickName:req.body.nickName,
    birth:req.body.birth, 
    entryType:req.body.entryType,

  });
  user.save()
    .then(function(result){
      console.log(result);

      // 회원 가입과 동시에 로그인하게끔 처리
      const token = jwt.sign({
        userId:user.userId,
      },process.env.JWT_SECRET,{
        expiresIn: '1d',
        issuer:'wishlist'
      });

      
      return res.json({ code:200, result:token});
    })
    .catch(function (err) {
      console.error(err);
      next(err); 
    });
});


//(혜은) 회원가입 테스트용
router.post('/temp', async (req,res, next)=>{
  console.log(req.body);
  let user = new User(req.body);
  try {
      await user.save();
      res.json({
        code: 200,
        msg: '회원 저장성공',
    })
  } catch (e) {
      console.error(e);
      next(e);
  }
});

// 로그인 처리
router.post('/login',(req,res,next)=>{
  
  User.findOne({userId:req.body.userId,userState:true},function(err,user){
    // 에러발생 처리
      if(err){
        console.error('에러발생');
        next(err);
      }
    // 일치하는 사용자가 있을 경우
      if(user){
        const comparePwd = bcrypt.compareSync(req.body.password,user.password);
          if(comparePwd){
            
            const token = jwt.sign({
              userId:user.userId,
            },process.env.JWT_SECRET,{
              expiresIn: '1d',
              issuer:'wishlist'
            });

            console.log(token);
            return res.json({ code:200, result:token});
            
          }else{
            console.log('불일치' + comparePwd);
            return res.json({code:500,message:'암호가 일치하지 않습니다'});
          }
        
        // 일치하는 사용자가 없을 경우
      }else if(!user){
        console.log('미등록 사용자');
        return res.json({code:500,message:'등록된 사용자가 아닙니다'});
      }
    })
});


//(혜은) 회원 프로필정보 조회
router.get('/profile/:id', async(req,res,next)=>{
  const { id } = req.params;
  try{
    let user = await User.findOne({_id:id});
    if(user){
      res.json({
        code: 200,
        msg: '일치하는 사용자프로필을 찾았습니다.',
        user
      })
    }else{
      res.json({
        code: 503,
        msg: '일치하는 사용자가 없습니다.',
      })
    }
  }catch(e){
    console.error(e);
    next(e);
  }
    
})

// 회원 정보 조회
router.get('/profile',verifyToken,(req,res)=>{
  const userId = req.decoded.userId;

    User.findOne({
      userId:userId
    },(err,user)=>{
      if(err){
        console.error('에러발생');
        return res.status(500).json({code:500,message:'서버에러'});
      }

      if(user){
        console.log(user);
        return res.json({code:200,result:user});
      }else{
        return res.json({code:500,message:'유효하지 않은 회원입니다'});
      }
    })
} )

//modify:id
//itemModify.vue에서 변경된 내용 DB에 수정반영하기
router.patch('/profile/modify/:id', async function(req, res, next){
  const { id } = req.params;
  const user = req.body;
  console.log('here', user);
  try{
      //findByIdAndUpdate는 조건식 주지 않고, id값만 첫번재 파라미터로 주면, 해당 객체를 반환해준다.
      const newUser = await User.findByIdAndUpdate(id, user, {new: true}).exec();
      //new:true를 설정해야 업데이트 된 객체를 반환
      //설정하지 않으면 업데이트 되기 전의 객체를 반환
      if(newUser){
        
      console.log('there', newUser);
        res.status(201).json({
          code: 200,
          msg: '회원 프로필 정보 수정 성공',
          newUser
        });
      }else{
        res.json({
          code: 500,
          msg: '회원 프로필 정보 수정 실패'
        })
      }
  }catch(e){
      console.error(e);
      next(e);
  }
});

// 로그아웃
router.get('/logout',verifyToken,(req,res)=>{
  console.log(req.decoded);
  const userId = req.decoded.userId;

    User.findOne({
      userId:userId
    },(err,user)=>{
      
      if(err){
        console.error('에러발생');
        return res.status(500).json({code:500,message:'서버에러'});
      }
      // 토큰 삭제 전 유효시간을 0으로 처리
      const token = jwt.sign({userId:userId},process.env.JWT_SECRET,{
        expiresIn: 0,
        issuer:'wishlist'
      });
      
      return res.json({code:200,result:token});
    })
  }
)

// 캐시 재발급(로그인 상태 유지를 선택했을 시)




// 비밀번호 수정




// 회원탈퇴
router.get('/deleteAccount',verifyToken,(req,res)=>{
  const userId = req.decoded.userId;

    User.findOne({
      userId:userId
    },(err,user)=>{
      
      if(err){
        console.error('에러발생');
        return res.status(500).json({code:500,message:'서버에러'});
      }
      // 회원 탈퇴전 토큰의 유효시간을 0으로 처리
      const token = jwt.sign({userId:userId},process.env.JWT_SECRET,{
        expiresIn: 0,
        issuer:'wishlist'
      });
      
      return res.json({code:200,result:token});
    })
  }
)




module.exports = router;