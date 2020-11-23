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
    }
  },
  mounted() {
    let userId = parseInt(this.$route.query.userId);
    let person = configObj.authorsAndBooks.filter(obj => obj.user_id === userId).shift();
    let link = `api/v2/repos/${person.author}/${person.book}/docs/${this.$route.params.id}?raw=1`
    console.log(this.$route.params);
    this.axios.get(link, {
      headers: {
        'X-Auth-Token': configObj.yuqueToken
      },
    }).then((response)=>{
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
