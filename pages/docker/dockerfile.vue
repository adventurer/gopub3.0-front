<template>
  <div>
    <Row>
      <Col span="24">
        <Upload v-bind:headers="{token}" action="http://127.0.0.1:8088/api/v1/docker/fileup">
          <Button icon="ios-cloud-upload-outline">上传Dockfile</Button>
        </Upload>
      </Col>
    </Row>

    <!-- <Table border :columns="columns" :data="data"></Table> -->

    <Table border :columns="columns" :data="data">
      <template slot-scope="{ row }" slot="Name">
        <strong>{{ row.Name }}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="deploy">
        <Select
          @on-change="dockerFile_deploy($event,row.Name)"
          :transfer="true"
          style="width:200px;margin-bottom:5px;"
          placeholder="选择主机"
        >
          <Option v-for="item in machines" :value="item.ID" :key="item.Ip">{{ item.Name }}</Option>
        </Select>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <Button type="error" size="small" @click="dockerFile_remove(row.Name)">删除</Button>
      </template>
    </Table>
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
            modal2: false,
            formNetrowk: {
                Name: '',
                SubNet: '',
                Machine: ''
            },
            formItem: {
                Machine: this.model1,
                File: ''
            },
            columns: [
                {
                    title: '文件名',
                    slot: 'Name'
                },
                {
                    title: '部署',
                    slot: 'deploy',
                    width: 300,
                    align: 'center'
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 150,
                    align: 'center'
                }
            ],
            data: [],
            machines: [],
            model1: [],
            token: {}
        }
    },
    // computed: {
    //     token: function() {
    //         return Cookie.get('PasswordHash')
    //     },
    // },
    mounted: function() {
        this.token = Cookie.get('PasswordHash')
        this.get_file()

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
        get_file() {
            let that = this
            axios({
                method: 'post',
                type: 'json',
                url: '/api/v1/docker/files',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                headers: { token: Cookie.get('PasswordHash') },
                data: qs.stringify({
                    id: this.model1
                })
            }).then(function(response) {
                that.data = response.data.Data
            })
        },
        container_new(row) {
            this.modal2 = true
            this.formItem.Network = row.Name
        },
        dockerFile_deploy(event, File) {
            if (confirm('确实要创建这个镜像？')) {
                this.formItem.File = File
                this.formItem.Machine = event
                console.log(this.formItem)
                let that = this
                axios({
                    method: 'post',
                    type: 'json',
                    url: '/api/v1/docker/filedeploy',
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    headers: { token: Cookie.get('PasswordHash') },
                    data: qs.stringify(this.formItem)
                }).then(function(response) {
                    that.$Message.info(response.data.Msg)
                })
            }
        },
        dockerFile_remove(File) {
            if (confirm('确实要删除这个文件？')) {
                let that = this
                axios({
                    method: 'post',
                    type: 'json',
                    url: '/api/v1/docker/fileremove',
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    headers: { token: Cookie.get('PasswordHash') },
                    data: qs.stringify({
                        File:File
                    })
                }).then(function(response) {
                    that.$Message.info(response.data.Msg)
                })
            }
        },
        submit_new_network() {
            this.formNetrowk.Machine = this.model1
            let that = this
            axios({
                method: 'post',
                type: 'json',
                url: '/api/v1/docker/network/new',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                headers: { token: Cookie.get('PasswordHash') },
                data: qs.stringify(this.formNetrowk)
            }).then(function(response) {
                that.$Message.info(response.data.Msg)
            })
        }
    }
}
</script>
