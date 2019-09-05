<template>
  <div>
    <Row>
      <Col span="24">
        <Select v-model="checkDomainId" @on-change="display_domain()" style="width:200px">
          <Option v-for="item in selList" :value="item.ID" :key="item.ID">{{ item.Domain }}</Option>
        </Select>
        <Button style="float:right;" type="info" icon="md-add" @click="modal_new = true">新增</Button>
      </Col>
    </Row>

    <Table border style="margin-top:5px;" :columns="columns12" :data="data6">
      <template slot-scope="{ row, index }" slot="action">
        <Button type="error" size="small" @click="remove(index)">删除</Button>
        <!-- <Icon :size="30" color="Error" type="ios-trash-outline" @click="remove(index)" /> -->
      </template>
    </Table>

    <Modal v-model="modal_new" width="360">
      <p slot="header" style="text-align:center">
        <span>新增域名解析</span>
      </p>
      <div style="text-align:center">
        <div>
          主域名：
          <Input v-model="formItem.Domain" placeholder="Enter name" style="width: 250px" />
        </div>
        <div style="margin-top:5px;">
          子域名：
          <Input v-model="formItem.SubDomain" placeholder="Enter name" style="width: 250px" />
        </div>
        <div style="margin-top:5px;">
          指向ip：
          <Input v-model="formItem.Ip" placeholder="Enter name" style="width: 250px" />
        </div>
      </div>
      <div slot="footer">
        <Button type="info" size="large" long @click="submit_new_domain">提交</Button>
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
            modal_new: false,
            checkDomainId: '',
            selList: [],
            formItem: {
                Domain: '',
                SubDomain: '',
                Ip: ''
            },
            columns12: [
                {
                    title: 'DomainName',
                    key: 'DomainName'
                },
                {
                    title: 'RecordId',
                    key: 'RecordId'
                },
                {
                    title: 'RR',
                    key: 'RR'
                },
                {
                    title: 'Value',
                    key: 'Value'
                },
                {
                    title: 'Type',
                    key: 'Type'
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 150,
                    align: 'center'
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
                that.selList = response.data.Data
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
            if (confirm('确定要删除？')) {
                let that = this
                axios({
                    method: 'post',
                    type: 'json',
                    url: '/api/v1/domain/removedomain',
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    headers: { token: Cookie.get('PasswordHash') },
                    data: qs.stringify({
                        subdomianId: this.data6[index].RecordId,
                        id: this.checkDomainId
                    })
                }).then(function(response) {
                    that.$Message.info(response.data.Msg)
                })
            }
        },
        display_domain() {
            let that = this
            axios({
                method: 'post',
                type: 'json',
                url: '/api/v1/domain/list',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                headers: { token: Cookie.get('PasswordHash') },
                data: qs.stringify({
                    id: this.checkDomainId
                })
            }).then(function(response) {
                if (!!response.data.Data) {
                    that.data6 = response.data.Data.Record
                }
            })
        },
        submit_new_domain() {
            let that = this
            axios({
                method: 'post',
                type: 'json',
                url: '/api/v1/domain/newdomain',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                headers: { token: Cookie.get('PasswordHash') },
                data: qs.stringify(this.formItem)
            }).then(function(response) {
                that.$Message.info(response.data.Msg)
            })
        }
    }
}
</script>
