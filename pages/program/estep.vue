<template>
  <div>
    <p class="title">编辑上线步骤</p>

    <Table border :columns="columns" :data="data"></Table>
    <div style="text-align:center;margin:10px;">
      <p>增加上线步骤</p>
      <Divider />
      <Button style="margin:10px" icon="ios-add" type="primary" shape="circle" @click="new_step"></Button>
      <Button style="margin:10px" icon="ios-remove" type="primary" shape="circle" @click="remove_new_step"></Button>
    </div>
    <Table border :columns="columns" :data="data2"></Table>

    

  </div>
</template>
<style>
.title{
  text-align: center;
  font-size: 16px;
  color: #464c5b;
  font-weight:bold;
  margin-bottom: 5px;
}
</style>

<script>
import axios from 'axios'
import qs from 'qs'
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  data() {
    return {
      title: 'xxxx',
      columns: [
        {
          title: 'ID',
          key: 'ID',
          width: 60
        },
        {
          title: '步骤名',
          key: 'Title',
          width: 160,
          render: (h, params) => {
            return h('div', [
              h('Input', {
                props: {
                  value: params.row.Title
                },
                on: {
                  'on-change': event => {
                    params.row.Title = event.target.value
                  }
                }
              })
            ])
          }
        },
        {
          title: '步骤内容',
          key: 'Action',
          render: (h, params) => {
            return h('div', [
              h('Input', {
                props: {
                  value: params.row.Action
                },
                on: {
                  'on-change': event => {
                    params.row.Action = event.target.value
                  }
                }
              })
            ])
          }
        },
        {
          title: '操作',
          key: 'address',
          width: 160,
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
                      this.edit_step(params.row)
                    }
                  }
                },
                '提交修改'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.remove_step(params.row)
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
      data2: [],
    }
  },
  mounted: function() {
    let that = this
    axios({
      method: 'post',
      type: 'json',
      url: '/api/v1/project/steps',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      headers: { token: Cookie.get('PasswordHash') },
      data: qs.stringify({
        id: this.$route.query.id
      })
    }).then(function(response) {
      console.log(response.data.Data)
      that.data = response.data.Data
    })
  },
  methods: {
    edit_step(data) {
      let that = this
      axios({
        method: 'post',
        type: 'json',
        url: '/api/v1/project/estep',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        headers: { token: Cookie.get('PasswordHash') },
        data: qs.stringify({
          project: this.$route.query.id,
          step: data.ID,
          title: data.Title,
          action: data.Action
        })
      }).then(function(response) {
        that.$Message.info(response.data.Msg)
      })
    },
    remove_step(data) {
      let that = this
      axios({
        method: 'post',
        type: 'json',
        url: '/api/v1/project/rstep',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        headers: { token: Cookie.get('PasswordHash') },
        data: qs.stringify({
          id: data.ID,
        })
      }).then(function(response) {
        that.$Message.info(response.data.Msg)
      })
    },
    new_step(){
      this.data2.push({
          project: this.$route.query.id,
          step: 0,
          title: '',
          action: ''
      })
    },
    remove_new_step(){
      this.data2.pop()
    }
  }
}
</script>
