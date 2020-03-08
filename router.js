/*
  1.返回搜索内容的所有书籍链接 ( 书名,作者,链接 )
  2.返回单本小说详情内容并做分页处理 ( 书名,作者,详情介绍,所有章节链接,小说封面, 最新章节, 最后更新时间 )
  3.返回单章内容 ( 章节名称,章节内容,上一章链接,下一章链接 )
  4.获取返回的小说阅读记录 ( 书名,小说链接,阅读章节记录 ) 
  5.返回书架内容 ( 阅读章节记录 )
  6.获取分类信息
  7.返回首页推荐详情
 */

const express = require('express')
const sycRequest = require('sync-request')
const cheerio = require('cheerio')
const novelList = require('./module/bookList.js')
const classify = require('./module/bookClassify.js')
const user = require('./module/user.js')
const fs = require('fs')
const iconv = require('iconv-lite')
const novelDetail = require('./module/bookDetail.js')
const superagent = require('superagent')

var router = express.Router()

//根据前端返回的历史记录(书名, 章节链接)查找对应的小说章节内容

//首次更新小说推荐次数
// router.get('/saveRecommend', function(req, res, next) {
//   try {
//     classify.find({}, function(err, data) {
//       if (err) {
//         next(err)
//       }
//       let newList = []
//       data.forEach((item, i) => {
//         item.recommendNum = 0
//         newList.push(item)
//       })
//       newList.forEach(ele => {
//         classify.updateOne(
//           {
//             bookName: ele.bookName
//           },
//           ele,
//           function(err) {
//             if (err) {
//               next(err)
//             }
//           }
//         )
//       })
//     })
//   } catch (error) {
//     fs.writeFile('./data/err.txt', error)
//   }
// })

//更新推荐次数
router.get('/saveRecommend', function(req, res, next) {
  try {
    let bookName = req.query.bookName
    classify.find({ bookName }, function(err, data) {
      if (err) {
        next(err)
      }
      let num = (data[0].recommendNum += 1)
      classify.updateOne(
        {
          bookName
        },
        {
          recommendNum: num
        },
        function(err, data) {
          if (err) {
            next(err)
          }
          res.status(200).json({
            code: 200,
            message: data
          })
        }
      )
    })
  } catch (error) {
    fs.writeFile('./data/err.txt', error)
  }
})
router.get('/getRecommendRank', function(req, res, next) {
  try {
    let page = req.query.page
    classify
      .find({})
      .skip(page * 20)
      .limit(20)
      .sort({ recommendNum: -1 })
      .exec(function(err, data) {
        if (err) {
          next(err)
        }
        res.status(200).json({
          code: 200,
          message: data
        })
      })
  } catch (error) {
    fs.writeFile('./data/err.txt', error)
  }
})
//更新收藏次数
router.get('/saveCollect', function(req, res, next) {
  try {
    let bookName = req.query.bookName
    classify.find({ bookName }, function(err, data) {
      if (err) {
        next(err)
      }
      let num = (data[0].collectNum += 1)
      classify.updateOne(
        {
          bookName
        },
        {
          collectNum: num
        },
        function(err, data) {
          if (err) {
            next(err)
          }
          res.status(200).json({
            code: 200,
            message: data
          })
        }
      )
    })
  } catch (error) {
    fs.writeFile('./data/err.txt', error)
  }
})
router.get('/getCollectRank', function(req, res, next) {
  try {
    let page = req.query.page
    classify
      .find({})
      .skip(page * 20)
      .limit(20)
      .sort({ collectNum: -1 })
      .exec(function(err, data) {
        if (err) {
          next(err)
        }
        res.status(200).json({
          code: 200,
          message: data
        })
      })
  } catch (error) {
    fs.writeFile('./data/err.txt', error)
  }
})
//更新点击次数
router.get('/saveClick', function(req, res, next) {
  try {
    // let clickNum = req.query.num
    let bookName = req.query.bookName
    classify.find({ bookName }, function(err, data) {
      if (err) {
        next(err)
      }
      let num = (data[0].clickNum += 1)
      classify.updateOne(
        {
          bookName
        },
        {
          clickNum: num
        },
        function(err, data) {
          if (err) {
            next(err)
          }
          res.status(200).json({
            code: 200,
            message: data
          })
        }
      )
    })
  } catch (error) {
    fs.writeFile('./data/err.txt', error)
  }
})
router.get('/getClickRank', function(req, res, next) {
  try {
    let page = req.query.page
    classify
      .find({})
      .skip(page * 20)
      .limit(20)
      .sort({ clickNum: -1 })
      .exec(function(err, data) {
        if (err) {
          next(err)
        }
        res.status(200).json({
          code: 200,
          message: data
        })
      })
  } catch (error) {
    fs.writeFile('./data/err.txt', error)
  }
})

//注册
router.post('/registe', function(req, res, next) {
  try {
    let body = req.body
    // console.log(req.body)
    user.findOne(
      {
        $or: [
          {
            email: body.email
          },
          {
            userName: body.userName
          }
        ]
      },
      function(err, data) {
        if (err) {
          next(err)
        }
        if (data) {
          //用户已存在
          return res.status(200).json({
            code: 1,
            message: 'Email or nickname already exists'
          })
        } else {
          new user(body).save(function(err, data) {
            if (err) {
              return res.status(500).json({
                err_code: 500,
                message: 'Server err'
              })
            }
            res.status(200).json({
              code: 200,
              message: 'ok'
            })
          })
        }
      }
    )
  } catch (error) {
    fs.writeFile('./data/err.txt', error)
  }
})
//登录
router.post('/login', function(req, res, next) {
  try {
    let body = req.body
    user.findOne(
      {
        email: body.email
      },
      function(err, data) {
        if (err) {
          next(err)
        }

        if (data && data.password == body.password) {
          //找到用户
          res.status(200).json({
            code: 200,
            message: 'ok'
          })
        } else {
          res.status(200).json({
            code: 500,
            message: '输入错误'
          })
        }
      }
    )
  } catch (error) {
    fs.writeFile('./data/err.txt', error)
  }
})

//返回主页推荐
router.get('/recommend', function(req, res, next) {
  try {
    let body = sycRequest('get', 'http://m.b5200.net/')
    let html = iconv.decode(body.getBody(), 'gb2312')

    let $ = cheerio.load(html, { decodeEntities: true })
    var list = []
    var classifyList = []
    $('.article .title>span>a').each(function() {
      classifyList.push({
        type: $(this).text()
      })
    })
    $('.block_img img').each(function(i, item) {
      classifyList[i].imgSrc = $(this).attr('src')
    })
    $('.block_txt h2 a').each(function(i, item) {
      classifyList[i].bookName = $(this).text()
    })
    $('.block_txt>p:nth-of-type(3) a').each(function(i, item) {
      classifyList[i].author = $(this).text()
    })
    $('.block_txt>p:nth-of-type(4) a').each(function(i, item) {
      classifyList[i].info = $(this).text()
    })
    $('.block ul li').each(function() {
      let novelType = $(this)
        .children('a:nth-of-type(1)')
        .text()
      let novelname = $(this)
        .children('a:nth-of-type(2)')
        .text()
      let novelAuthor = $(this)
        .children('a:nth-of-type(3)')
        .text()
      list.push({
        novelType,
        novelname,
        novelAuthor
      })
    })

    for (let i = 0; i < 5; i++) {
      if (i < 3) {
        classifyList[i].novelList = list.splice(0, 9)
      } else {
        classifyList[i].novelList = list.splice(0, 7)
      }
    }
    res.status(200).json({
      code: 200,
      message: classifyList
    })
  } catch (error) {
    fs.writeFile('./data/err.txt', error)
  }
})

//更新小说详情
router.post('/updateNovel', function(req, res, next) {
  try {
    let title = req.body.title
    classify.find(
      {
        bookName: title
      },
      function(err, data) {
        if (!err && data.length !== 0) {
          let href = data[0].bookHref
          superagent.get(href).end(function(err, data) {
            if (err) {
              next(err)
            }
            let $ = cheerio.load(data.text, { decodeEntities: true })
            let info = $('#intro>p:nth-of-type(2)').text()
            let lastTime = $('#info>p:nth-of-type(3)').text()
            let newChapter = $('#info>p:nth-of-type(4) a').text()
            let newChapterHref = $('#info>p:nth-of-type(4) a').attr('href')
            let imgSrc = $('#fmimg>img').attr('src')
            let chapterList = []
            $('.box_con>#list  a').each(function() {
              chapterList.push({
                chapter: $(this).text(),
                href: 'http://www.xbiquge.la' + $(this).attr('href')
              })
            })
            let firstHref = chapterList[0].href
            let newList = chapterList.slice(-10)
            let detail = {
              bookName,
              author,
              info,
              lastTime,
              newChapter,
              newChapterHref,
              imgSrc,
              newList,
              firstHref
            }
            updateDetail(detail)
            res.status(200).json({
              code: 200,
              message: detail,
              findType: 1
            })
          })
        }
      }
    )
  } catch (error) {
    fs.writeFile('./data/err.txt', error)
  }
})

//查找小说详情
router.post('/findNovel', function(req, res, next) {
  try {
    let title = req.body.title
    novelDetail.find(
      {
        bookName: title
      },
      function(err, data) {
        if (err) {
          next(err)
        }
        if (data.length !== 0) {
          res.status(200).json({
            code: 200,
            message: data[0],
            findType: 0
          })
        } else {
          classify.find(
            {
              bookName: title
            },
            function(err, data) {
              if (!err && data.length !== 0) {
                let bookName = data[0].bookName
                let author = data[0].author
                let href = data[0].bookHref
                superagent.get(href).end(function(err, data) {
                  if (err) {
                    next(err)
                  }
                  let $ = cheerio.load(data.text, { decodeEntities: true })
                  let info = $('#intro>p:nth-of-type(2)').text()
                  let lastTime = $('#info>p:nth-of-type(3)').text()
                  let newChapter = $('#info>p:nth-of-type(4) a').text()
                  let newChapterHref = $('#info>p:nth-of-type(4) a').attr(
                    'href'
                  )
                  let imgSrc = $('#fmimg>img').attr('src')
                  let chapterList = []
                  $('.box_con>#list  a').each(function() {
                    chapterList.push({
                      chapter: $(this).text(),
                      href: 'http://www.xbiquge.la' + $(this).attr('href')
                    })
                  })
                  let firstHref = chapterList[0].href
                  let newList = chapterList.slice(-10)
                  let detail = {
                    bookName,
                    author,
                    info,
                    lastTime,
                    newChapter,
                    newChapterHref,
                    imgSrc,
                    newList,
                    firstHref
                  }
                  updateDetail(detail)
                  res.status(200).json({
                    code: 200,
                    message: detail,
                    findType: 1
                  })
                })
              }
            }
          )
        }
      }
    )
  } catch (error) {
    fs.writeFile('./data/err.txt', error)
  }
})

function updateDetail(detail) {
  novelDetail.updateOne(
    {
      bookName: detail.bookName
    },
    detail,
    {
      upsert: true
    },
    function(err, data) {
      if (err) {
        next(err)
      }
    }
  )
}

//获取小说所有章节链接
router.post('/getAllChapter', function(req, res, next) {
  let name = req.body.name
  try {
    classify.find(
      {
        bookName: name
      },
      function(err, data) {
        if (!err && data.length !== 0) {
          let href = data[0].bookHref
          superagent.get(href).end(function(err, data) {
            if (err) {
              next(err)
            }
            let $ = cheerio.load(data.text, { decodeEntities: true })
            let chapterList = []
            $('.box_con>#list  a').each(function() {
              chapterList.push({
                chapter: $(this).text(),
                href: 'http://www.xbiquge.la' + $(this).attr('href')
              })
            })
            res.status(200).json({
              code: 200,
              message: chapterList
            })
          })
        }
      }
    )
  } catch (error) {}
})

//查找作者
router.get('/findAuthor', function(req, res, next) {
  let author = req.query.author
  try {
    classify.find(
      {
        author: author
      },
      function(err, data) {
        if (!err && data.length !== 0) {
          res.status(200).json({
            code: 200,
            message: data
          })
        }
      }
    )
  } catch (error) {
    fs.writeFile('./data/err.txt', error)
  }
})

//获取分类
/*
    "bookName" : "八方圣皇",
    "bookHref" : "http://www.xbiquge.la/45/45263/",
    "classifyType" : 1,  //玄幻: 1, 修真: 2, 都市: 3, 穿越: 4, 网游: 5, 科幻: 6, 其他: 7
    "author" : "酒与星河",
*/
router.get('/classify', function(req, res, next) {
  let type = req.query.type
  let page = req.query.page
  try {
    classify
      .find({
        classifyType: type
      })
      .skip(page * 30)
      .limit(30)
      .sort({ _id: 1 })
      .exec(function(err, data) {
        if (!err) {
          res.status(200).json({
            code: 200,
            message: data
          })
        }
      })
  } catch (error) {
    fs.writeFile('./data/err.txt', error)
  }
})

router.get('/', function(req, res, next) {
  novelList.find({}, function(err, data) {
    if (err) {
      return next(err)
    } else {
      res.json(data)
    }
  })
})
//渲染搜索小说页面
router.get('/findNovel', function(req, res, next) {
  res.render('./findnovel.html')
})

//获取小说每一章节内容
router.get('/getChapter', function(req, res, next) {
  try {
    let href = req.query.href
    superagent.get(href).end(function(err, data) {
      if (err) {
        next(err)
      }
      let $ = cheerio.load(data.text, { decodeEntities: true })
      let nextHref =
        'http://www.xbiquge.la' + $('.bottem1 a:nth-of-type(4)').attr('href')
      let preHref =
        'http://www.xbiquge.la' + $('.bottem1 a:nth-of-type(2)').attr('href')

      let text = $('#content')
        .text()
        .replace(/\s+/g, '<br/><br/>' + '&nbsp;&nbsp;&nbsp;&nbsp;')
      let title = $('.bookname>h1').text()

      res.status(200).json({
        code: 200,
        message: text,
        nextHref: nextHref,
        preHref: preHref,
        title: title
      })
    })
  } catch (error) {
    fs.writeFile('./data/err.txt', error)
  }
})

//添加书架内容

//获取书架内容

//导出路由
module.exports = router
