<template>
  <div>
    <div style="text-align:center;margin-bottom:10px;">
      <Button @click="modal = true">新增端口转发</Button>
    </div>
    <Modal v-model="modal" width="800">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>新增端口转发</span>
      </p>
      <div style="text-align:center">
        <Form :model="formItem" :label-width="80">
          <FormItem label="容器名称">
            <Input v-model="formItem.Name" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="宿主主机">
            <Input v-model="formItem.MachineName" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="宿主端口">
            <Input v-model="formItem.Port" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="转发到ip">
            <Input v-model="formItem.ToIp" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="转发到端口">
            <Input v-model="formItem.ToPort" placeholder="number"></Input>
          </FormItem>
          <FormItem label="状态">
            <Input v-model="formItem.Status" placeholder="Enter something..."></Input>
          </FormItem>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="success" size="large" @click="add_port">新增</Button>
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
      modal:false,
      formItem: {
        Name: '',
        MachineName: '',
        Port: '',
        ToIp: '',
        ToPort: '',
        Status: '',
      },
      columns: [
        {
          title: '#',
          key: 'ID',
          width: 60,
        },
        {
          title: '容器名称',
          key: 'Name'
        },
        {
          title: '宿主主机',
          key: 'MachineName'
        },
        {
          title: '宿主端口',
          key: 'Port'
        },
        {
          title: '转发IP',
          key: 'ToIp'
        },
        {
          title: '转发端口',
          key: 'ToPort'
        },
        {
          title: '状态',
          key: 'Status'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
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
                'View'
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
                      this.remove_port(params.row.ID)
                    }
                  }
                },
                'Delete'
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
      url: '/api/v1/docker/ports',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      headers: { token: Cookie.get('PasswordHash') }
    }).then(function(response) {
      if (!!response.data.Data) {
        that.data = response.data.Data
        console.log(response.data.Data)
      }
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
    add_port(){
      let that = this
      axios({
        method: 'post',
        type: 'json',
        url: '/api/v1/docker/addport',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        headers: { token: Cookie.get('PasswordHash') },
        data: qs.stringify(this.formItem)
      }).then(function(response) {
        that.$Message.info(response.data.Msg)
        that.modal = false
      })
    },
    remove_port(id){
      let that = this      
      if (confirm("确认要删除？")) {
        axios({
          method: 'post',
          type: 'json',
          url: '/api/v1/docker/removeport',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          headers: { token: Cookie.get('PasswordHash') },
          data: qs.stringify({
            id:id
          })
        }).then(function(response) {
          that.$Message.info(response.data.Msg)
        })
      }
    }
  }
}
</script>
