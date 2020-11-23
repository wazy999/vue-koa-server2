<template>
	<div>
		<el-row :gutter="20">
			<el-col class="left-sider" :span="8">
				<el-card shadow="hover" class="mgb20" style="height:252px;">
					<div class="user-info">
						<img src="../../assets/img/img.jpg" class="user-avator" alt />
						<div class="user-info-cont">
							<div class="user-info-name">{{name}}</div>
							<div>{{role}}</div>
						</div>
					</div>
					<div class="user-info-list">
						上次登录时间：
						<span>{{ last_login | formatDate }}</span>
					</div>
					<div class="user-info-list">
						上次登录地点：
						<span>广州</span>
					</div>
				</el-card>
				<el-card shadow="hover">
					<div slot="header" class="clearfix">
						<span>语言详情</span>
					</div>
          Vue <el-progress :percentage="81.7" color="#42b983"></el-progress>
          JavaScript <el-progress :percentage="14.4" color="#f1e05a"></el-progress>
          CSS <el-progress :percentage="3.2"></el-progress>
          Other <el-progress :percentage="0.7" color="#f56c6c"></el-progress>
				</el-card>
			</el-col>
			<el-col :span="16">
				<el-row :gutter="20" class="mgb20">
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{padding: '0px'}">
							<div class="grid-content grid-con-1">
								<i class="el-icon-lx-people grid-con-icon"></i>
								<div class="grid-cont-right">
									<div class="grid-num">1234</div>
									<div>用户访问量</div>
								</div>
							</div>
						</el-card>
					</el-col>
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{padding: '0px'}">
							<div class="grid-content grid-con-2">
								<i class="el-icon-lx-notice grid-con-icon"></i>
								<div class="grid-cont-right">
									<div class="grid-num">321</div>
									<div>系统消息</div>
								</div>
							</div>
						</el-card>
					</el-col>
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{padding: '0px'}">
							<div class="grid-content grid-con-3">
								<i class="el-icon-lx-goods grid-con-icon"></i>
								<div class="grid-cont-right">
									<div class="grid-num">5000</div>
									<div>数量</div>
								</div>
							</div>
						</el-card>
					</el-col>
				</el-row>
				<el-card class="articles-list" shadow="hover" style="height:465px;">
					<div slot="header" class="clearfix">
						<span>文章列表</span>
            <div class="btns">
              <el-row>
                <el-button type="primary" @click="synArticles">同步文章</el-button>
                <el-button type="primary" @click="doPersistence">文章持久化</el-button>
                <el-button type="primary" @click="doNotPersistence">取消持久化</el-button>
              </el-row>
              
            </div>
          </div>

          <!-- 勾选时触发 -->
          <el-checkbox-group v-model="checkedLabels" @change="handleCheckedLabelsChange">
            <li v-for="item in displayList" :key="item.id">
              <!-- <el-checkbox :label="item"> -- handleCheckedLabelsChange()传参item -->
              <el-checkbox :label="item">
                <router-link target="_blank" :to="`/articles/${item.id}?userId=${item.user_id}`">
                  {{item.title}}
                </router-link>
              </el-checkbox>
            </li>
          </el-checkbox-group>

          <el-checkbox class="select-all" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
            <span>全选</span>
          </el-checkbox>

          <div class="pagination">
            <el-pagination
              background
              layout="total, prev, pager, next"
              :total="list.length"
              @prev-click="toPrevPage"
              @next-click="toNextPage"
              @current-change="changeCurrentPage"
            ></el-pagination>
          </div>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script>
  import configObj from '@/config.js'
  import axios from '@/axios.js'
  import dayjs from 'dayjs'

  export default {
  	name: 'dashboard',
  	data() {
  		return {
  			blogs: [],
        list: [],
  			displayList: [],
        currentPage: 1,
  			labels: [],
  			checkAll: false,
  			isIndeterminate: false,  //部分选择的状态
  			checkedLabels: [],  //某个分页已选择的复选框
  			selectedLabels: [],  //所有分页已选择的复选框
  			name: localStorage.getItem('ms_username'),
        last_login: window.localStorage.getItem('last_login')*1 || (new Date()).getTime()
  		};
  	},
    filters: {
      formatDate: function (value) {
        return dayjs(value).format('YYYY-MM-DD')
      }
    },
  	computed: {
  		role() {
  			return this.name === 'admin' ? '超级管理员' : '普通用户';
  		}
  	},
    watch: {
      currentPage(){
        // 取消选择状态
        this.checkedLabels = [];
        this.checkAll = false;
      }
    },
  	methods: {
      changeCurrentPage(index){
        // console.log("changeCurrentPage");
        // console.log(index);
        this.currentPage = index;
        this.displayList = this.list.slice((this.currentPage-1)*10, this.currentPage*10);
      },
      toPrevPage(){
        // console.log("toPrevPage");
        this.currentPage -= 1;
        this.displayList = this.list.slice((this.currentPage-1)*10, this.currentPage*10);
      },
      toNextPage(){
        // console.log("toNextPage");
        this.currentPage += 1;
        this.displayList = this.list.slice((this.currentPage-1)*10, this.currentPage*10);
      },
      // 同步文章按钮
      synArticles(){
        // console.log("synArticles");
        this.$message({
          showClose: true,
          message: `同步文章中~`,
          type: 'success',
          duration: 1000
        })
        let urlArr = configObj.authorsAndBooks.map((item) => `api/v2/repos/${item.author}/${item.book}/docs`);
        let reqList = [];
        console.log(urlArr);
        for(let i=0; i<urlArr.length; i++){
          let req = this.axios.get(urlArr[i], {
            headers: {
              'X-Auth-Token': configObj.yuqueToken
            }
          })
          reqList.push(req);
        }
        this.axios.all(reqList).then(this.axios.spread((...resList) => {
          this.list = resList.map((item) => item.data.data).flat(); // 所有的文章
          // console.log(resList) // 拿到所有posts数据
          console.log(this.list)
          this.displayList = this.list.slice((this.currentPage-1)*10, this.currentPage*10)
          this.labels = this.list.map((item) => item.id)
        }))
      },
  		doNotPersistence(){
        if(this.checkedLabels.length === 0){
          this.$message({
            showClose: true,
            message: '请选择想要取消持久化的文章~',
            type: 'warning'
          })
          return false;
        }
        else {
          console.log("doNotPersistence");
          for(let i=0; i<this.checkedLabels.length; i++){
            axios.removeAnArticle(this.checkedLabels[i].id)
              .then(()=>{
                // console.log(response);
                this.$message({
                  showClose: true,
                  message: `文章 ${this.checkedLabels[i].title} 取消持久化完成~`,
                  type: 'success',
                  duration: 1500
                })
              })
              .catch((err)=>{
                // console.log(err)
                if(err.status === 404){
                  this.$message({
                    showClose: true,
                    message: `文章 ${this.checkedLabels[i].title} 已经取消持久化~`,
                    type: 'warning',
                    duration: 1500
                  })
                }
              })
          }  // endfor
        }
      },
      doPersistence(){
        // 持久化之前需要选择某些文章
        if(this.checkedLabels.length === 0){
          this.$message({
            showClose: true,
            message: '请选择想要持久化的文章~',
            type: 'warning'
          })
          return false;
        }
        else {
          console.log("doPersistence");
          console.log(this.checkedLabels);
          for(let i=0; i<this.checkedLabels.length; i++){
            let person = configObj.authorsAndBooks.filter(obj => obj.user_id === this.checkedLabels[i].user_id).shift();
            let link = `api/v2/repos/${person.author}/${person.book}/docs/${this.checkedLabels[i].id}?raw=1`
            console.log(link);
            // 根据文章id请求文章内容
            this.axios.get(link, {
              headers: {
                'X-Auth-Token': configObj.yuqueToken
              },
              // params: {
              //   raw: 1,  // Markdown格式
              // }
            })
            .then(({data})=>{
              // 存入数据库
              axios.postAnArticle(data.data)
                .then(()=>{
                  console.log("success");
                  this.$message({
                    showClose: true,
                    message: `文章 ${data.data.title} 持久化完成~`,
                    type: 'success',
                    duration: 1000
                  })
                })
                .catch((err)=>{
                  console.log(err);
                  if(err.status === 409){
                    this.$message({
                      showClose: true,
                      message: `文章 ${data.data.title} 已经持久化~`,
                      type: 'warning',
                      duration: 1000
                    })
                  }
                })
            })
          }
        }
      },
      handleCheckAllChange(val){
        //@change="handleCheckAllChange"-->选中状态val为true，未选中为false
        // console.log(val)
        this.checkedLabels = val ? this.labels.slice((this.currentPage-1)*10, this.currentPage*10) : [];
        this.isIndeterminate = false;
      },
      handleCheckedLabelsChange(value){
        console.log(value);  //已勾选的复选框的label组成的数组
        // 比较数量
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.labels.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.labels.length;
      }
  	}
  };
</script>


<style scoped>
  .articles-list{
    position: relative;
    padding-bottom: 52px;  /*留给.pagination*/
  }
  .btns{
    float: right;
  }
  .select-all{
    position: absolute;
    left: 20px;
    bottom: 20px;
    color: #606266;
    padding: 0 0 5px 10px;
  }
  .select-all .el-checkbox__label span{
    font-size: 15px;
  }
  .el-checkbox-group li{
    color: #606266;
    list-style: none;
    font-size: 14px;
    border-bottom: 1px solid #EBEEF5;
    padding: 8px 0;
    padding-left: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
  }
  .el-checkbox-group li a{
    color: #606266;
  }
  .pagination{
    position: absolute;
    right: 20px;
    bottom: 0;
  }
  .el-row {
  	/*margin-bottom: 20px;*/
  }

  .grid-content {
  	display: flex;
  	align-items: center;
  	height: 100px;
  }

  .grid-cont-right {
  	flex: 1;
  	text-align: center;
  	font-size: 14px;
  	color: #999;
  }

  .grid-num {
  	font-size: 30px;
  	font-weight: bold;
  }

  .grid-con-icon {
  	font-size: 50px;
  	width: 100px;
  	height: 100px;
  	text-align: center;
  	line-height: 100px;
  	color: #fff;
  }

  .grid-con-1 .grid-con-icon {
  	background: rgb(45, 140, 240);
  }

  .grid-con-1 .grid-num {
  	color: rgb(45, 140, 240);
  }

  .grid-con-2 .grid-con-icon {
  	background: rgb(100, 213, 114);
  }

  .grid-con-2 .grid-num {
  	color: rgb(45, 140, 240);
  }

  .grid-con-3 .grid-con-icon {
  	background: rgb(242, 94, 67);
  }

  .grid-con-3 .grid-num {
  	color: rgb(242, 94, 67);
  }

  .user-info {
  	display: flex;
  	align-items: center;
  	padding-bottom: 20px;
  	border-bottom: 2px solid #ccc;
  	margin-bottom: 20px;
  }

  .user-avator {
  	width: 120px;
  	height: 120px;
  	border-radius: 50%;
  }

  .user-info-cont {
  	padding-left: 50px;
  	flex: 1;
  	font-size: 14px;
  	color: #999;
  }

  .user-info-cont div:first-child {
  	font-size: 30px;
  	color: #222;
  }

  .user-info-list {
  	font-size: 14px;
  	color: #999;
  	line-height: 25px;
  }

  .user-info-list span {
  	margin-left: 70px;
  }

  .mgb20 {
  	margin-bottom: 20px;
  }

  .todo-item {
  	font-size: 14px;
  }

  .todo-item-del {
  	text-decoration: line-through;
  	color: #999;
  }

  .schart {
  	width: 100%;
  	height: 300px;
  }
</style>
