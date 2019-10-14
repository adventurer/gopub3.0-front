<template>
  <div>
    <Table border :columns="columns" :data="data"></Table>
    <Modal v-model="audit_modal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>审核上线单编号：{{audit_record.ID}}</span>
      </p>
      <div style="text-align:center">
        <p>正在审核上线单:"{{audit_record.Name}}",请核对上线单id是否跟标题相同</p>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="audit_task">审核</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import axios from 'axios'
import qs from 'qs'
const Cookie = process.client ? require('js-cookie') : undefined
import expandRow from './table-expand.vue'

export default {
  components: { expandRow },
  data() {
    return {
      audit_modal: false,
      audit_record: [],
      columns: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          title: 'ID',
          key: 'ID'
        },
        {
          title: '项目',
          key: 'ProjectName'
        },
        {
          title: '上线单标题',
          key: 'Name'
        },
        {
          title: '提交人',
          key: 'UserName'
        },
        {
          title: '最后步骤',
          key: 'Step'
        },
        {
          title: '审核情况',
          key: 'Audit',
          render: (h, params) => {
            return h('div', [
              h('i-switch', {
                props: {
                  value: !!params.row.Audit,
                  disabled: true,
                  size:"small"
                },
                style: {
                  marginRight: '5px'
                }
              })
            ])
          }
        },
        {
          title: '部署情况',
          key: 'Status',
          render: (h, params) => {
            return h('div', [
              h('i-switch', {
                props: {
                  value: !!params.row.Status,
                  disabled: true,
                  size:"small"
                },
                style: {
                  marginRight: '5px'
                }
              })
            ])
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 225,
          align: 'center',
          render: (h, params) => {
            if (!params.row.Status) {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'success',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        if (params.row.Audit == 1) {
                          this.$Message.info("该上线单已经审核过了")
                          return
                        }
                        this.audit_modal = true
                        this.audit_record = params.row
                      }
                    }
                  },
                  '审核'
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
                        if (params.row.Audit == 0) {
                          this.$Message.info('该上线单未审核')
                          return
                        }
                        this.$router.push({
                          path: '/task/publish',
                          query: { id: params.row.ID }
                        })
                      }
                    }
                  },
                  '部署'
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
                        this.task_remove(params.row.ID)
                      }
                    }
                  },
                  '撤销'
                )
              ])
            }
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
      url: '/api/v1/task/list',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      headers: { token: Cookie.get('PasswordHash') }
    }).then(function(response) {
      that.data = response.data.Data
    })
  },
  methods: {
    audit_task() {
      let that = this
      axios({
        method: 'post',
        type: 'json',
        url: '/api/v1/task/audit',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        headers: { token: Cookie.get('PasswordHash') },
        data: qs.stringify({
          id: this.audit_record.ID
        })
      }).then(function(response) {
        console.log(response)
        that.audit_modal = false
      })
    },
    task_remove(id) {
      if (confirm('确定要删除此上线单')) {
        let that = this
        axios({
          method: 'post',
          type: 'json',
          url: '/api/v1/task/remove',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          headers: { token: Cookie.get('PasswordHash') },
          data: qs.stringify({
            id: id
          })
        }).then(function(response) {
          console.log(response)
        })
      }
    }
  }
}
</script>