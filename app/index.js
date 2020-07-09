const koa = require('koa')
const path = require('path')
const koaBody = require('koa-body')
const koaStatic = require('koa-static')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const mongoose = require('mongoose')
const routes = require('./routes')

const { connectionStr } = require('./config')

const app = new koa();

mongoose.connect(connectionStr, { 
  useNewUrlParser: true,
  useUnifiedTopology: true 
}, () => {
  console.log('mongoDB 连接成功')
})
mongoose.connection.on('error', console.error)

app.use(koaStatic(path.join(__dirname, 'public')))
app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, '/public/uploads'),
    keepExtensions: true
  }
}))
app.use(parameter(app))
app.use(routes.routes())
  .use(routes.allowedMethods())

app.listen(3000, () => {
  console.log('启动成功在 3000 端口')
})