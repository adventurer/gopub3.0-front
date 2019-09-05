<template>
  <div>
    <div style="text-align:center;margin-bottom:10px;">
      <Button @click="modal = true">新增管理域名</Button>
    </div>
    <Modal v-model="modal" width="800">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>新增管理域名</span>
      </p>
      <div style="text-align:center">
        <Form :model="formItem" :label-width="150">
          <FormItem label="域名">
            <Input v-model="formItem.Domain" placeholder="Enter something..." />
          </FormItem>
          <FormItem label="AccessKeyId">
            <Input v-model="formItem.AccessKeyId" placeholder="Enter something..." />
          </FormItem>
          <FormItem label="AccessSecret">
            <Input v-model="formItem.AccessSecret" placeholder="number" />
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="success" size="large" @click="domain_add">新增</Button>
      </div>
    </Modal>

    <template>
      <Table border :columns="columns7" :data="data6"></Table>
    </template>

    <Alert style="margin-top:10px;">
        提示：
        <template slot="desc">目前仅支持阿里云dns</template>
    </Alert>
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
                Domain: '',
                AccessKeyId: '',
                AccessSecret: ''
            },
            columns7: [
                {
                    title: 'id',
                    key: 'ID',
                    width:80,
                },
                {
                    title: 'domail',
                    key: 'Domain'
                },
                {
                    title: 'AccessKeyId',
                    key: 'AccessKeyId'
                },
                {
                    title: 'AccessSecret',
                    key: 'AccessSecret'
                },
                {
                    title: 'Action',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h(
                                'Button',
                                {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.row)
                                        }
                                    }
                                },
                                'Delete'
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
            url: '/api/v1/domain/settinglist',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            headers: { token: Cookie.get('PasswordHash') }
        }).then(function(response) {
            if (!!response.data.Data) {
                that.data6 = response.data.Data
            }
        })
    },
    methods: {
        remove(row) {
            if (confirm('确定要删除这条记录？')) {
                let that = this
                axios({
                    method: 'post',
                    type: 'json',
                    url: '/api/v1/domain/settingremove',
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    headers: { token: Cookie.get('PasswordHash') },
                    data: qs.stringify({
                        id: row.ID
                    })
                }).then(function(response) {
                    that.$Message.info(response.data.Msg)
                })
            }
        },
        domain_add() {
            let that = this
            axios({
                method: 'post',
                type: 'json',
                url: '/api/v1/domain/settingadd',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                headers: { token: Cookie.get('PasswordHash') },
                data: qs.stringify(this.formItem)
            }).then(function(response) {
                that.$Message.info(response.data.Msg)
            })
            this.modal = false
        }
    }
}
</script>
