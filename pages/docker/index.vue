<template>
  <Table border :columns="columns" :data="data"></Table>
</template>
<script>
import axios from 'axios'
import qs from 'qs'
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  data() {
    return {
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
          title: 'Name',
          key: 'Name'
        },
        {
          title: 'IP',
          key: 'IP'
        },
        {
          title: '状态',
          key: 'Status'
        },
        {
          title: '操作',
          key: 'action',
          width: 240,
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
                '详情'
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
                      this.start_container(params.row)
                    }
                  }
                },
                '启动'
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
                      this.stop_container(params.row)
                    }
                  }
                },
                '停止'
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
      url: '/api/v1/docker/list',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      headers: { token: Cookie.get('PasswordHash') }
    }).then(function(response) {
      that.data = response.data.Data
      console.log(response.data.Data)
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
    start_container(row) {
      let that = this
      axios({
        method: 'post',
        type: 'json',
        url: '/api/v1/docker/start',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        headers: { token: Cookie.get('PasswordHash') },
        data: qs.stringify({
          id: row.ID
        })
      }).then(function(response) {
        if (response.data.Sta == 1) {
          that.$Message.info(response.data.Msg)
        }
      })
    },
    stop_container(row) {
      let that = this
      axios({
        method: 'post',
        type: 'json',
        url: '/api/v1/docker/stop',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        headers: { token: Cookie.get('PasswordHash') },
        data: qs.stringify({
          id: row.ID
        })
      }).then(function(response) {
        if (response.data.Sta == 1) {
          that.$Message.info(response.data.Msg)
        }
      })
    }
  }
}
</script>
