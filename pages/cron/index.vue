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

    <Table border :columns="columns" :data="data"></Table>
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
      formItem: {
        Name: '',
        Schedule: '',
        Status: '',
        Cmd: '',
        Machine: '',
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
          title: '执行命令',
          key: 'Cmd'
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
                      this.show(params.index)
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
                      this.show(params.index)
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
                      this.remove(params.index)
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
    }
  }
}
</script>
