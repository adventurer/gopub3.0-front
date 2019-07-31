<template>
  <div>
    <Row type="flex" justify="center" align="top" class="code-row-bg">
      <Col span="24">
        <div style="text-align:center;">
          <p style="font-size:24px">{{taskInfo.Name}}</p>
        </div>
      </Col>
      <Col span="24">
        <template v-for="item in taskInfo.Machine">
          <div class="progress-block">
            <p class="machine-lable">主机：{{item.Name}}</p>
            <Steps :current="item.Step" direction="vertical">
              <template v-for="step in item.DeployStep">
                <Step :title="step.Title" :content="step.Action"></Step>
              </template>
            </Steps>
          </div>
        </template>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <div style="text-align:center;margin-top:50px;">
          <Button
            type="primary"
            :loading="loading"
            shape="circle"
            size="large"
            :disabled="deployStatus"
          >
            <span v-if="!loading" @click="deploy(taskId)">{{deployText}}</span>
            <span v-else>{{deployText}}</span>
          </Button>
        </div>
      </Col>
    </Row>
  </div>
</template>
<script>
import axios from 'axios'
import qs from 'qs'
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  data() {
    return {
      deployStatus: false,
      deployText: '发布!',
      loading: false,
      taskId: '',
      task: [],
      taskInfo: []
    }
  },
  mounted: function() {
    console.log(this.$route.path)
  },
  beforeMount: function() {
    this.taskId = this.$route.query.id
    this.initTask()
    this.fresh_task_info()
  },
  methods: {
    initMachine() {},
    initTask() {
      let that = this
      axios({
        method: 'post',
        type: 'json',
        url: '/api/v1/task/info',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        headers: { token: Cookie.get('PasswordHash') },
        data: qs.stringify({
          id: this.taskId
        })
      }).then(function(response) {
        that.taskInfo = response.data.Data
        if (response.data.Data.Status == 1) {
          that.deployStatus = true
          that.deployText = '已发布'
        }
        console.log(response.data.Data)
      })
    },
    deploy(id) {
      this.deployText = '正在发布...'
      let that = this
      axios({
        method: 'post',
        type: 'json',
        url: '/api/v1/task/deploy',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        headers: { token: Cookie.get('PasswordHash') },
        data: qs.stringify({
          id: this.taskId
        })
      }).then(function(response) {
        console.log(response.data.Data)
        that.loading = false
        that.deployText = '发布结束'
        that.deployStatus = true
      })
    },
    toLoading() {
      this.loading = true
    },
    fresh_task_info() {
      let that = this
      setInterval(() => {
        if (this.$route.path == '/task/publish') {
          axios({
            method: 'post',
            type: 'json',
            url: '/api/v1/task/deploymessage',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            headers: { token: Cookie.get('PasswordHash') },
            data: qs.stringify({
              id: this.taskId
            })
          }).then(function(response) {
            if (response.data.Code == 1) {
              console.log(response.data.Data)
              console.log(that.taskInfo)
              that.taskInfo = response.data.Data
            }
          })
        }
      }, 1000)
    }
  }
}
</script>
<style>
.demo-split {
  height: 200px;
  border: 1px solid #dcdee2;
}
.demo-split-pane {
  padding: 10px;
}
.progress-block {
  margin-top: 50px;
}
.machine-lable {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 10px;
}
</style>
