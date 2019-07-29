<template>
  <div>
    <div style="text-align:center;margin-bottom:10px;">
      <Button @click="modal = true">新增用户</Button>
    </div>
    <Modal v-model="modal" width="400">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>新增用户</span>
      </p>
      <div style="text-align:center">
        <Form :model="formItem" :label-width="60">
          <FormItem label="Email">
            <Input v-model="formItem.Email" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="姓名">
            <Input v-model="formItem.Name" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="角色">
            <Input v-model="formItem.Role" placeholder="Enter something..."></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="success" size="large" long @click="user_add">新增</Button>
      </div>
    </Modal>

    <Table border :columns="columns7" :data="data6"></Table>
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
        Email: '',
        Name: '',
        Role: ''
      },
      columns7: [
        {
          title: '用户名',
          key: 'Name'
        },
        {
          title: 'Email',
          key: 'Email'
        },
        {
          title: '角色',
          key: 'Role'
        },
        {
          title: '上次登录时间',
          key: 'LastLogin'
        },
        {
          title: '创建时间',
          key: 'CreatedAt'
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
                      this.user_remove(params.row.ID)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      data6: []
    }
  },
  mounted: function() {
    let that = this
    axios({
      method: 'get',
      type: 'json',
      url: '/api/v1/user/list',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      headers: { token: Cookie.get('PasswordHash') }
    }).then(function(response) {
      that.data6 = response.data.Data
    })
  },
  methods: {
    user_add() {
      let that = this
      axios({
        method: 'post',
        type: 'json',
        url: '/api/v1/user/add',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        headers: { token: Cookie.get('PasswordHash') },
        data: qs.stringify(this.formItem)
      }).then(function(response) {
        that.$Message.info('完成添加')
        that.modal = false
      })
    },
    user_remove(id) {
      let that = this
      if (confirm('确定要删除该用户？')) {
        axios({
          method: 'post',
          type: 'json',
          url: '/api/v1/user/remove',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          headers: { token: Cookie.get('PasswordHash') },
          data: qs.stringify({
            id: id
          })
        }).then(function(response) {
          that.$Message.info('完成删除')
        })
      }
    },
    show(index) {
      this.formItem = this.data6[index]
      this.modal = true
    },
    remove(index) {
      this.data6.splice(index, 1)
    }
  }
}
</script>
