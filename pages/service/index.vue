<template>
  <div>
    <div style="text-align:center;margin-bottom:10px;">
      <Button @click="modal2 = true">新增服务</Button>
    </div>
    <Modal v-model="modal2" width="400">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>新增服务</span>
      </p>
      <div style="text-align:center">
        <Form :model="formItem" :label-width="60">
          <FormItem label="服务名">
            <Input v-model="formItem.name" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="IP">
            <Input v-model="formItem.ip" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="端口">
            <Input v-model="formItem.port" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="自动连接">
            <Input v-model="formItem.auto" placeholder="1或者0:1则自动连接"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="success" size="large" @click="service_add">新增</Button>
      </div>
    </Modal>

    <Table border :columns="columns1" :data="data1"></Table>
  </div>
</template>


// <i-switch v-model="switchValue" slot="extra" @on-change="switch_to" />

<script>
import axios from 'axios'
import qs from 'qs'
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  data() {
    return {
      switchValue: true,
      modal2: false,
      formItem: {
        name: '',
        ip: '',
        port: '',
        auto: '',
      },
      columns1: [
        {
          title: '服务名',
          key: 'Name'
        },
        {
          title: '服务IP',
          key: 'LocalIp'
        },
        {
          title: '服务端口',
          key: 'Port'
        },
        {
          title: '远程主机',
          key: 'Machine'
        },
        {
          title: '自动连接',
          key: 'Auto'
        },
        {
          title: '连接',
          key: 'address',
          align: 'center',
          width: '80px',
          render: (h, params) => {
            return h('div', [
              h(
                'i-switch',
                {
                  props: {
                    size: 'small',
                    value: this.data1[params.index].Status
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    'on-change': (status) => {
                      this.data1[params.index].Status = !this.data1[params.index].Status
                      this.proxy_switch(this.data1[params.index].Machine,this.data1[params.index].Name,this.data1[params.index].Status)
                    }
                  }
                }
              )
            ])
          }
        }
      ],
      data1: []
    }
  },
  mounted: function() {
    let that = this
    axios({
      method: 'get',
      type: 'json',
      url: '/api/v1/service/list',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      headers: { token: Cookie.get('PasswordHash') }
    }).then(function(response) {
      console.log(that.data1)
      console.log(response.data.Data)
      that.data1 = response.data.Data
      // that.data6 = response.data.Data
    })
  },
  methods: {
    service_add() {
      let that = this
      axios({
        method: 'post',
        type: 'json',
        url: '/api/v1/service/add',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        headers: { token: Cookie.get('PasswordHash') },
        data: qs.stringify({
          Name: this.formItem.name,
          Ip: this.formItem.ip,
          Port: this.formItem.port,
          Auto: this.formItem.auto
        })
      }).then(function(response) {
        // console.log(that)
        // console.log(response)
        that.modal2 = false
        that.$Message.info('新增成功')
      })
    },
    proxy_switch(name,service,status) {
      console.log(name)
      console.log(service)
      let that = this
      if (status) {
        axios({
          method: 'post',
          type: 'json',
          url: '/api/v1/proxy/on',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          headers: { token: Cookie.get('PasswordHash') },
          data: qs.stringify({
            name: name,
            service:service
          })
        }).then(function(response) {
          // console.log(that)
          console.log(response)
        })
      } else {
        axios({
          method: 'post',
          type: 'json',
          url: '/api/v1/proxy/off',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          headers: { token: Cookie.get('PasswordHash') },
          data: qs.stringify({
            name: name,
            service:service
          })
        }).then(function(response) {
          // console.log(that)
          console.log(response)
        })
      }
    }
  }
}
</script>