<template>
  <div>
    <div style="text-align:center;margin-bottom:10px;">
      <Button @click="modal = true">新增任务</Button>
    </div>
    <Modal v-model="modal" width="800">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>新增任务</span>
      </p>
      <div style="text-align:center">
        <Form :model="formItem" :label-width="60">
          <FormItem label="任务名">
            <Input v-model="formItem.Name" placeholder="一个名字而已"></Input>
          </FormItem>
          <FormItem label="计划时间">
            <Input v-model="formItem.Schedule" placeholder="秒 分 时 日 月 年"></Input>
          </FormItem>
          <FormItem label="是否启用">
            <Input v-model="formItem.Status" placeholder="1/0"></Input>
          </FormItem>
          <FormItem label="执行主机">
            <Input v-model="formItem.Machine" placeholder="主机别名"></Input>
          </FormItem>
          <FormItem label="执行命令">
            <Input
              v-model="formItem.Cmd"
              type="textarea"
              :autosize="{minRows: 20,maxRows: 50}"
              placeholder="shell命令内容"
            ></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="success" size="large" long @click="cron_add">新增</Button>
      </div>
    </Modal>
    <!-- 编辑任务 -->
    <Modal v-model="modalEdit" width="800">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>编辑任务</span>
      </p>
      <div style="text-align:center">
        <Form :model="formItemEdit" :label-width="60">
          <FormItem label="任务名">
            <Input v-model="formItemEdit.Name" placeholder="一个名字而已"></Input>
          </FormItem>
          <FormItem label="计划时间">
            <Input v-model="formItemEdit.Schedule" placeholder="秒 分 时 日 月 年"></Input>
          </FormItem>
          <FormItem label="是否启用">
            <Input v-model="formItemEdit.Status" placeholder="1/0"></Input>
          </FormItem>
          <FormItem label="执行主机">
            <Input v-model="formItemEdit.Machine" placeholder="主机别名"></Input>
          </FormItem>
          <FormItem label="执行命令">
            <Input
              v-model="formItemEdit.Cmd"
              type="textarea"
              :autosize="{minRows: 20,maxRows: 50}"
              placeholder="shell命令内容"
            ></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="success" size="large" long @click="cron_edit_submit">提交修改</Button>
      </div>
    </Modal>

    <Table border :columns="columns" :data="data"></Table>
    <div style="margin:10px;float:right;">
      <Button type="primary" @click="cron_start">开始</Button>
      <Button type="primary" @click="cron_stop">停止</Button>
      <Button type="primary" @click="cron_restart">重启</Button>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import qs from 'qs'
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  data() {
    return {
      modal: false,
      modalEdit: false,
      formItem: {
        Name: '',
        Schedule: '',
        Status: '',
        Cmd: '',
        Machine: ''
      },
      formItemEdit: {
        Name: '',
        Schedule: '',
        Status: '',
        Cmd: '',
        Machine: ''
      },
      columns: [
        {
          title: '任务名',
          key: 'Name',
          width: 150
        },
        {
          title: '执行主机',
          key: 'Machine',
          width: 150
        },
        {
          title: '计划时间',
          key: 'Schedule',
          width: 200
        },
        {
          title: '状态',
          key: 'Status',
          align: 'center',
          width: '80px',
          render: (h, params) => {
            return h('div', [
              h('i-switch', {
                props: {
                  size: 'small',
                  value: !!params.row.Status
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  'on-change': status => {
                    this.cron_switch(params.row.ID, status)
                  }
                }
              })
            ])
          }
        },
        {
          title: '执行命令',
          key: 'Cmd',
          render: (h, params) => {
            return h('div', [
              h('Input', {
                props: {
                  value: params.row.Cmd
                }
              })
            ])
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 180,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.$Message.info("好麻烦，这个先不做")
                    }
                  }
                },
                '日志'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.cron_edit(params.row)
                    }
                  }
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.cron_remove(params.row.ID)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      data: []
    }
  },
  mounted: function() {
    let that = this
    axios({
      method: 'get',
      type: 'json',
      url: '/api/v1/cron/list',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      headers: { token: Cookie.get('PasswordHash') }
    }).then(function(response) {
      that.data = response.data.Data
    })
  },
  methods: {
    show(index) {
      this.$Modal.info({
        title: 'User Info',
        content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
      })
    },
    remove(index) {
      this.data6.splice(index, 1)
    },
    cron_add() {
      let that = this
      axios({
        method: 'post',
        type: 'json',
        url: '/api/v1/cron/add',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        headers: { token: Cookie.get('PasswordHash') },
        data: qs.stringify(this.formItem)
      }).then(function(response) {
        that.$Message.info(response.data.Msg)
        that.modal = false
      })
    },
    cron_start() {
      let that = this
      axios({
        method: 'post',
        type: 'json',
        url: '/api/v1/cron/start',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        headers: { token: Cookie.get('PasswordHash') }
      }).then(function(response) {
        that.$Message.info(response.data.Msg)
      })
    },
    cron_stop() {
      let that = this
      axios({
        method: 'post',
        type: 'json',
        url: '/api/v1/cron/stop',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        headers: { token: Cookie.get('PasswordHash') }
      }).then(function(response) {
        that.$Message.info(response.data.Msg)
      })
    },
    cron_restart() {
      let that = this
      axios({
        method: 'post',
        type: 'json',
        url: '/api/v1/cron/restart',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        headers: { token: Cookie.get('PasswordHash') }
      }).then(function(response) {
        that.$Message.info(response.data.Msg)
      })
    },
    cron_switch(id, status) {
      let url = ''
      if (status) {
        url = '/api/v1/cron/on'
      } else {
        url = '/api/v1/cron/off'
      }
      let that = this
      axios({
        method: 'post',
        type: 'json',
        url: url,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        headers: { token: Cookie.get('PasswordHash') },
        data: qs.stringify({ id: id })
      }).then(function(response) {
        that.$Message.info(response.data.Msg)
      })
    },
    cron_remove(id) {
      if (confirm('确认删除此任务？')) {
        let that = this
        axios({
          method: 'post',
          type: 'json',
          url: '/api/v1/cron/remove',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          headers: { token: Cookie.get('PasswordHash') },
          data: qs.stringify({ id: id })
        }).then(function(response) {
          that.$Message.info(response.data.Msg)
        })
      }
    },
    cron_edit(data) {
      this.formItemEdit = data
      this.modalEdit = true
    },
    cron_edit_submit() {
      let that = this
      axios({
        method: 'post',
        type: 'json',
        url: '/api/v1/cron/edit',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        headers: { token: Cookie.get('PasswordHash') },
        data: qs.stringify({
          ID:this.formItemEdit.ID,
          Name: this.formItemEdit.Name,
          Schedule: this.formItemEdit.Schedule,
          Status: this.formItemEdit.Status,
          Cmd: this.formItemEdit.Cmd,
          Machine: this.formItemEdit.Machine
        })
      }).then(function(response) {
        that.$Message.info(response.data.Msg)
        that.modalEdit = false
      })
    }
  }
}
</script>
