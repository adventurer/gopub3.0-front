<template>
  <div>
    <div style="text-align:center;margin-bottom:10px;">
      <Button @click="modal2 = true">新增主机</Button>
    </div>
    <Modal v-model="modal2" width="800">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>新增主机</span>
      </p>
      <div style="text-align:center">
        <Form :model="formItem" :label-width="60">
          <FormItem label="别名">
            <Input v-model="formItem.name" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="用户名">
            <Input v-model="formItem.user" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="IP">
            <Input v-model="formItem.ip" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="端口">
            <Input v-model="formItem.port" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="密钥">
            <Input
              v-model="formItem.rsa"
              type="textarea"
              :autosize="{minRows: 20,maxRows: 50}"
              placeholder="id_rsa  content..."
            ></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="success" size="large" @click="machine_add">新增</Button>
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
      modal2: false,
      formItem: {
        name: '',
        ip: '',
        port: '',
        rsa: '',
        user: '',
        textarea: ''
      },
      columns7: [
        {
          title: '序号',
          align: 'center',
          key: 'name',
          width: 60,
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
          title: '别名',
          key: 'Name'
        },
        {
          title: '用户',
          key: 'User',
          width: 150
        },
        {
          title: 'IP',
          key: 'Ip',
          width: 150
        },
        {
          title: '端口',
          key: 'Port',
          align: 'center',
          width: 80
        },
        {
          title: '私钥',
          key: 'Rsa',
          align: 'center',
          width: 80,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  shape: 'circle',
                  icon: 'ios-search'
                },
                on: {
                  click: () => {
                    this.show_rsa(params.index)
                  }
                }
              })
            ])
          }
        },
        {
          title: '状态',
          key: 'Status',
          align: 'center',
          width: 80
        },
        {
          title: '操作',
          key: 'action',
          width: 210,
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
                      this.machine_test(params.index)
                    }
                  }
                },
                '测试'
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
      data6: [
        {
          Id: '1',
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park'
        }
      ]
    }
  },
  mounted: function() {
    let that = this
    axios({
      method: 'get',
      type: 'json',
      url: '/api/v1/machine/list',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      headers: { token: Cookie.get('PasswordHash') }
    }).then(function(response) {
      console.log(response.data.Data)
      that.data6 = response.data.Data
    })
  },
  methods: {
    machine_test(index) {
      let that = this
      axios({
        method: 'post',
        type: 'json',
        url: '/api/v1/machine/test',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        headers: { token: Cookie.get('PasswordHash') },
        data: qs.stringify({
          id: this.data6[index].ID
        })
      }).then(function(response) {
        that.$Message.info(response.data.Msg)
      })
    },
    show_rsa(index) {
      this.$Modal.confirm({
        width: '800',
        render: h => {
          return h('Input', {
            props: {
              value: this.data6[index].Rsa,
              autofocus: true,
              placeholder: 'Please enter your name...',
              type: 'textarea',
              rows: 30
            },
            on: {
              input: val => {
                this.value = val
              }
            }
          })
        }
      })
    },
    remove(index) {
      this.data6.splice(index, 1)
    },
    machine_add() {
      let that = this
      axios({
        method: 'post',
        type: 'json',
        url: '/api/v1/machine/add',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        headers: { token: Cookie.get('PasswordHash') },
        data: qs.stringify({
          Name: this.formItem.name,
          Ip: this.formItem.ip,
          Port: this.formItem.port,
          Rsa: this.formItem.rsa,
          User: this.formItem.user
        })
      }).then(function(response) {
        // console.log(that)
        // console.log(response)
        that.modal2 = false
        that.$Message.info('新增成功')
      })
    }
  }
}
</script>
