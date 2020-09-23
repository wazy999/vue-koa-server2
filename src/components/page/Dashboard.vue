<template>
	<div>
		<el-row :gutter="20">
			<el-col :span="8">
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
						<span>2020-09-20</span>
					</div>
					<div class="user-info-list">
						上次登录地点：
						<span>广州</span>
					</div>
				</el-card>
				<el-card shadow="hover">
					<div slot="header" class="clearfix">
						<span>语言详情</span>
					</div>Vue
					<el-progress :percentage="52.1" color="#42b983"></el-progress>JavaScript
					<el-progress :percentage="24.1" color="#f1e05a"></el-progress>CSS
					<el-progress :percentage="13.7"></el-progress>HTML
					<el-progress :percentage="10.1" color="#f56c6c"></el-progress>
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

          <el-checkbox-group v-model="checkedLabels" @change="handleCheckedLabelsChange">
            <li v-for="item in displayList" :key="item.id">
              <el-checkbox :label="item.id">
                <router-link target="_blank" :to="'/articles/'+item.id">
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
  		};
  	},
  	components: {
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
        // 获取id、title等数据
        this.axios.get(`${configObj.docsUrl}`,{
          headers: {
            'X-Auth-Token': configObj.yuqueToken
          }
        }).then((response)=>{
          // console.log("response.data.data");
          // console.log(response.data.data);
          this.list = response.data.data
          this.displayList = this.list.slice((this.currentPage-1)*10, this.currentPage*10)
          this.labels = this.list.map((item) => item.id)
          // console.log(this.labels)
        })
        .then(()=>{
          // 统一文档格式
          for(let i=0; i<this.list.length; i++){
            let blog = {}
            blog.id = this.list[i].id
            blog.title = this.list[i].title
            this.axios.get(`${configObj.docsUrl}${blog.id}`,{
              headers: {
                'X-Auth-Token': configObj.yuqueToken
              },
              params: {
                raw: 1,  // Markdown格式
              }
            })
            .then((response)=>{
              let resData = response.data.data
              blog.body_markdown = resData.body
              blog.body_html = resData.body_html
              this.blogs.push(blog)
            })
          }
        })
        .catch((response)=>{
          console.log(response);
        })
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
        console.log("doNotPersistence");
        let checkBlogs = this.blogs.filter(blog => this.checkedLabels.includes(blog.id))
        console.log(checkBlogs);
        for(let i=0; i<this.checkedLabels.length; i++){
          axios.removeAnArticle(this.checkedLabels[i])
            .then(()=>{
              // console.log(response);
              this.$message({
                showClose: true,
                message: `文章 ${checkBlogs[i].title} 取消持久化完成~`,
                type: 'success',
                duration: 1500
              })
            })
            .catch((err)=>{
              // console.log(err)
              if(err.status === 404){
                this.$message({
                  showClose: true,
                  message: `文章 ${checkBlogs[i].title} 已经取消持久化~`,
                  type: 'warning',
                  duration: 1500
                })
              }
            })
        }  // endfor
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
        console.log("doPersistence");
        // console.log(this.blogs);

        // 复选框选中的文章
        let checkBlogs = this.blogs.filter(blog => this.checkedLabels.includes(blog.id))
        console.log(checkBlogs);
        // 
        // 文章存入数据库后，前端读取数据库并展示
        for(let i=0; i<checkBlogs.length; i++){
          axios.postAnArticle(checkBlogs[i])
          // this.axios.post('http://localhost:3000/articles', checkBlogs[i])
            .then(()=>{
              // console.log(response);
              this.$message({
                showClose: true,
                message: `文章 ${checkBlogs[i].title} 持久化完成~`,
                type: 'success',
                duration: 1000
              })
            })
            .catch((err)=>{
              if(err.status === 409){
                this.$message({
                  showClose: true,
                  message: `文章 ${checkBlogs[i].title} 已经持久化~`,
                  type: 'warning',
                  duration: 1000
                })
              }
            })
        }  // endfor
        // console.log(this.checkedLabels)
      },
      handleCheckAllChange(val){
        //@change="handleCheckAllChange"-->选中状态val为true，未选中为false
        // console.log(val)
        this.checkedLabels = val ? this.labels.slice((this.currentPage-1)*10, this.currentPage*10) : [];
        // 这样太复杂了...
        // this.selectedLabels = this.selectedLabels.concat(this.checkedLabels);
        // console.log("this.selectedLabels")
        // console.log(this.selectedLabels)
        this.isIndeterminate = false;
      },
      handleCheckedLabelsChange(value){
        // console.log(value);  //已勾选的复选框的label组成的数组
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
  	margin-bottom: 20px;
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
