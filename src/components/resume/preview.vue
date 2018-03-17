<template>
  <div class="body">
    <div class="wrap preview">
      <h1>简历预览</h1>
      <!-- 个人信息 -->
      <div class="preview-item">
        <h2>个人信息</h2>
        <div class="content">
          <div class="name">{{data.basicInfo.name}}</div>
          <div class="avatar">
            <img src="" width="100" alt="">
          </div>
          <div class="info">
            <p class="info-list">
              <span>{{sexOptions[data.basicInfo.sex]}}</span>
              <i class="gap">|</i>
              <span>{{data.basicInfo.birthday}}</span>
              <i class="gap">|</i>
              <span v-if="data.basicInfo.idcard">
                <span>身份证</span>
                {{data.basicInfo.idcard}}
              </span>
            </p>
            <p class="info-list">手机号：{{data.basicInfo.tel}}</p>
            <p class="info-list">邮箱：{{data.basicInfo.email}}</p>
            <!--<p class="info-list">期望薪资:{{data.basicInfo.salary}}</p>-->
          </div>
        </div>
      </div>
      <!-- 教育信息 -->
      <template v-if="data.educations">
        <div class="preview-item">
          <h2>教育信息</h2>
          <div class="content">
            <dl class="content-list">
              <dt v-for="education in data.educations">
                <span>{{education.startTime}}至{{education.endTime}}</span>
                <i class="gap">|</i>
                <span>{{education.schoolName}}</span>
                <i class="gap">|</i>
                <span>
                <span>{{eduExperienceValue[education.degree]}}</span>
              </span>
                <i class="gap">|</i>
                <span>{{education.major}}</span>
              </dt>
            </dl>
          </div>
        </div>
      </template>

      <template v-if="data.experiences">
        <div class="preview-item">
          <h2>实践经验</h2>
          <div class="content">
            <dl class="content-list">
              <template v-for="experience in data.experiences">
                <dt>{{experience.startTime}}至{{experience.endTime}}&nbsp;&nbsp;{{experience.companyName}}&nbsp;&nbsp;{{experience.positionName}}
                </dt>
                <dd v-if="experience.responsibility">
                  <p>项目内容：</p>
                  <p>{{experience.responsibility}}</p>
                </dd>
              </template>
            </dl>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  const eduExperienceOpt = [
    {
      value: 1,
      label: '初中及以下'
    },
    {
      value: 2,
      label: '高中'
    },
    {
      value: 3,
      label: '中技'
    },
    {
      value: 4,
      label: '中专'
    },
    {
      value: 5,
      label: '大专'
    },
    {
      value: 6,
      label: '本科'
    },
    {
      value: 7,
      label: '研究生'
    },
    {
      value: 8,
      label: 'EMBA'
    },
    {
      value: 9,
      label: 'MBA'
    },
    {
      value: 10,
      label: '博士'
    },
    {
      value: 11,
      label: '其他'
    }
  ]
  const eduExperienceValue = eduExperienceOpt.reduce((acc, cur) => {
    acc[cur.value] = cur.label
    return acc
  }, {})

  export default {
    name: 'preview',
    props: {
      data: {
        type: Object
      }
    },
    data() {
      return {
        sexOptions: {
          0: '男',
          1: '女'
        },
        eduExperienceValue
      }
    }
  }
</script>

<style scoped>
  .body {
    font: 14px "Microsoft YaHei", "SimSun", arial, helvetica, clean, sans-serif;
    color: #333;
  }

  .body, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, code, form, fieldset, legend, input, textarea, p, blockquote, th, td, img {
    margin: 0;
  }

  ul, li {
    padding: 0;
    list-style: none;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  select, input, button, textarea {
    font-family: "Microsoft YaHei", "SimSun", arial, helvetica, clean, sans-serif;
    font-size: 12px;
  }

  a {
    color: #333;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
    color: #CA1622;
  }

  a, a:visited, a:hover, a:active, a:focus {
    -moz-outline: none;
    outline: none;
  }

  img {
    border: 0px;
    vertical-align: top;
  }

  button {
    border: 0 none;
    margin: 0;
  }

  em {
    font-style: normal;
  }

  input {
    outline: none;
  }

  input[type=button]::-moz-focus-inner {
    border: none;
  }

  * {
    outline: none;
  }

  :focus {
    outline: 0;
  }

  img {
    vertical-align: top;
  }

  .clearfix:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: " ";
    clear: both;
    height: 0;
  }

  .clearfix {
    display: inline-block;
  }

  /*main*/
  .wrap {
    width: 1000px;
    margin: 0 auto;
    color: #5A5A5A;
    font-size: 16px;
  }

  /*preview*/
  .preview {
    padding: 40px 0 100px;
  }

  .preview h1, .preview h2 {
    color: #E3393C;
    font-weight: normal;
  }

  .preview h1 {
    font-size: 36px;
    margin-bottom: 30px;
  }

  .preview h2 {
    font-size: 22px;
  }

  .preview-item {
    padding-bottom: 20px;
  }

  .preview-item h2 {
    border-bottom: 1px solid #E6EAED;
    height: 45px;
    line-height: 40px;
  }

  .preview-item .content {
    position: relative;
  }

  .content .name {
    font-size: 24px;
    padding: 20px 0;
  }

  .content .avatar {
    position: absolute;
    right: 0;
    top: 40px;
  }

  .content h3 {
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 10px;
    padding-top: 10px;
  }

  .info-list {
    margin-bottom: 15px;
  }

  .content .gap {
    display: inline-block;
    padding: 0 5px;
    font-size: 16px;
    font-family: Arial;
  }

  .content .appraisal {
    line-height: 28px;
    width: 820px;
  }

  /*content-list*/
  .content-list {
  }

  .content-list dt, .content-list dd {
    display: block;
  }

  .content-list dt {
    font-weight: bold;
    padding-top: 30px;
  }

  .content-list dd {
    margin-bottom: 20px;
    margin-top: 10px;
    margin-left: 20px;
  }

  .content-list dd p {
    min-height: 30px;
    line-height: 30px;
  }

  .content .sub-title {
    padding-top: 20px;
    margin-bottom: -10px;
  }

  .upload-list {
    margin-bottom: 20px;
    padding-top: 20px;
  }

  .upload-list li {
    min-height: 35px;
    line-height: 35px;
    position: relative;
    padding-left: 120px;
    margin-bottom: 20px;
  }

  .upload-list .upload-title {
    width: 110px;
    text-align: right;
    position: absolute;
    left: 0;
    top: 0;
    display: block;
  }

  .upload-list .upload-item {
    display: inline-block;
    border: 1px solid #E6EAED;
    text-align: center;
    width: 260px;
    height: 35px;
    line-height: 35px;
    text-decoration: none;
    margin-bottom: 10px;
  }
</style>
