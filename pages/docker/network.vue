<template>
  <div>
    <Select
      @on-change="get_network"
      v-model="model1"
      style="width:200px;margin-bottom:5px;"
      placeholder="选择主机"
    >
      <Option v-for="item in machines" :value="item.ID" :key="item.Ip">{{ item.Name }}</Option>
    </Select>

    <Table border :columns="columns" :data="data"></Table>

    <Modal v-model="modal2" width="400">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>创建容器@{{model1}}</span>
      </p>
      <div style="text-align:center">
        <Form :model="formItem" :label-width="60">
          <FormItem label="容器名称">
            <Input v-model="formItem.Name" placeholder="容器名"></Input>
          </FormItem>
          <FormItem label="网络">
            <Input v-model="formItem.Network" placeholder="网络自动指定" disabled></Input>
          </FormItem>
          <FormItem label="ip">
            <Input v-model="formItem.Ip" placeholder="容器ip"></Input>
          </FormItem>
          <FormItem label="镜像">
            <Input v-model="formItem.Image" placeholder="容器镜像"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="success" size="large" @click="container_deploy">新增</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import axios from 'axios'
import qs from 'qs'
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  data() {
    return {
      modal2: false,
      formItem: {
        Machine:this.model1,
        Name: '',
        Network: '',
        Ip: '',
        Image: ''
      },
      columns: [
        {
          title: 'ID',
          key: 'ID',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'person'
                }
              }),
              h('strong', params.row.ID)
            ])
          }
        },
        {
          title: 'NAME',
          key: 'Name'
        },
        {
          title: 'NETWORK',
          key: 'IP'
        },
        {
          title: 'DRIVER',
          key: 'Driver'
        },
        {
          title: 'SCOPE',
          key: 'Scope'
        },
        {
          title: '操作',
          key: 'action',
          width: 250,
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
                      this.container_new(params.row)
                    }
                  }
                },
                '创建容器'
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
                '详情'
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
      data: [],
      machines: [],
      model1: []
    }
  },
  mounted: function() {
    let that = this
    axios({
      method: 'get',
      type: 'json',
      url: '/api/v1/docker/machines',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      headers: { token: Cookie.get('PasswordHash') }
    }).then(function(response) {
      if (!!response.data.Data) {
        that.machines = response.data.Data
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
    get_network() {
      let that = this
      axios({
        method: 'post',
        type: 'json',
        url: '/api/v1/docker/networks',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        headers: { token: Cookie.get('PasswordHash') },
        data: qs.stringify({
          id: this.model1
        })
      }).then(function(response) {
        that.formItem.Machine = that.model1
        that.$Message.info(response.data.Msg)
        that.data = response.data.Data
      })
    },
    container_new(row) {
      this.modal2 = true
      this.formItem.Network = row.Name
    },
    container_deploy() {
      let that = this
      axios({
        method: 'post',
        type: 'json',
        url: '/api/v1/docker/container/deploy',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        headers: { token: Cookie.get('PasswordHash') },
        data: qs.stringify(this.formItem)
      }).then(function(response) {
        that.$Message.info(response.data.Msg)
      })
    }
  }
}
</script>
