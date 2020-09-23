<template>
  <div class="article-body">
    <h1 class="title"> {{title}} </h1>
    <h4 class="time">更新时间：{{updated_at}}</h4>
    <div v-html="body_html"></div>
  </div>
</template>

<script>
import configObj from '@/config.js'

export default {
  name: 'Articles',
  data () {
    return {
      title: '',
      updated_at: '',
      body_html: '',
      id: this.$route.params.id
    }
  },
  mounted() {
    this.axios.get(`${configObj.docsUrl}${this.id}`,{
      headers: {
        'X-Auth-Token': configObj.yuqueToken
      },
      params: {
        raw: 1,  // Markdown格式
      }
    }).then((response)=>{
      console.log(response.data.data);
      let {title, updated_at, body_html} = response.data.data
      this.title = title
      this.updated_at = updated_at.slice(0, 10)
      this.body_html = body_html
      // console.log(body_html);
    }).catch((response)=>{
      console.log(response);
    })
  }
}
</script>

<style lang="css" scoped>
  .article-body{
    margin-left: 20px;
  }
  .time{
    margin: 20px 0;
    color: rgb(38, 38, 38);
    font-weight: 400;
  }
</style>
