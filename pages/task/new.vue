<template>
  <div>
    <div style="text-align:center;">
      <p class="title">新建上线单</p>
    </div>
    <Form :model="formItem" :label-width="100">
      <FormItem label="上线单标题">
        <Input v-model="formItem.Name" placeholder="Enter something..."></Input>
      </FormItem>
      <FormItem label="项目" prop="program">
        <Select v-model="formItem.ProjectID" placeholder="选择项目" @on-change="get_branch">
          <template v-for="item in program">
            <Option :value="item.ID">{{item.Name}}</Option>
          </template>
        </Select>
      </FormItem>
      <FormItem label="分支" prop="program">
        <Select v-model="formItem.Branch" placeholder="选择分支" label="master">
          <Option value="master">master</Option>
        </Select>
      </FormItem>
      <FormItem label="版本" prop="program">
        <Select v-model="formItem.Version" placeholder="选择版本" @on-change="get_version_info">
          <template v-for="item in commit">
            <Option :value="item.Key">{{item.Value}}</Option>
          </template>
        </Select>
      </FormItem>
      <!-- <FormItem label="版本信息">
        <Input
          v-model="versioninfo"
          type="textarea"
          :autosize="{minRows: 10,maxRows: 40}"
          placeholder="Enter something..."
        ></Input> -->
      </FormItem>
      <FormItem>
        <Button type="primary" @click="task_add">提交上线单</Button>
        <Button style="margin-left: 8px" @click="cancel">Cancel</Button>
      </FormItem>
    </Form>
    <Card class="version-style">
      {{versioninfo}}
    </Card>
  </div>
</template>
<style>
.title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}
.version-style{
  background-color: black;
  color:white;
  white-space: pre-wrap;
}
</style>

<script>
import axios from 'axios'
import qs from 'qs'
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  data() {
    return {
      formItem: {
        Name: '',
        ProjectName: '',
        ProjectID: '',
        Version: '',
        Branch: 'master',
        UserName:'',
      },
      program: [],
      commit: [],
      versioninfo: ''
    }
  },
  mounted: function() {
    let that = this
    axios({
      method: 'get',
      type: 'json',
      url: '/api/v1/project/list',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      headers: { token: Cookie.get('PasswordHash') }
    }).then(function(response) {
      console.log(response.data.Data)
      that.program = response.data.Data
    })
  },
  methods: {
    get_branch(params) {
      let that = this
      axios({
        method: 'post',
        type: 'json',
        url: '/api/v1/task/getversion',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        headers: { token: Cookie.get('PasswordHash') },
        data: qs.stringify({
          project: params
        })
      }).then(function(response) {
        that.commit = response.data.Data
        console.log(that)
      })
    },
    get_version_info(param) {
      let that = this
      axios({
        method: 'post',
        type: 'json',
        url: '/api/v1/task/getversioninfo',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        headers: { token: Cookie.get('PasswordHash') },
        data: qs.stringify({
          project: that.formItem.ProjectID,
          hash: param
        })
      }).then(function(response) {
        console.log(response)
        that.versioninfo = response.data.Data
        // that.commit = response.data.Data
      })
    },
    cancel(){
      this.formItem = []
      this.$router.push('/task')
    },
    task_add() {
      let that = this
      this.formItem.UserName = Cookie.get('Email')
      axios({
        method: 'post',
        type: 'json',
        url: '/api/v1/task/add',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        headers: { token: Cookie.get('PasswordHash') },
        data: qs.stringify(this.formItem)
      }).then(function(response) {
        that.$router.push('/task')
      })
    }
  }
}
</script>
