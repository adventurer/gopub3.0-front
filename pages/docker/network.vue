<template>
  <div>
    <Row>
      <Col span="24">
        <Select
          @on-change="get_network"
          v-model="model1"
          style="width:200px;margin-bottom:5px;"
          placeholder="选择主机"
        >
          <Option v-for="item in machines" :value="item.ID" :key="item.Ip">{{ item.Name }}</Option>
        </Select>

        <Button style="float:right;" type="info" icon="md-add" @click="modal_new = true">创建网络</Button>
      </Col>
    </Row>

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
          <FormItem label="端口绑定">
            <Input style="width: auto" v-model="formItem.Hport" placeholder="主机端口"></Input>
            -
            <Input style="width: auto" v-model="formItem.Cport" placeholder="容器端口"></Input>
          </FormItem>
          <FormItem label="卷挂载">
            <Input style="width: auto" v-model="formItem.Hvolume" placeholder="主机卷"></Input>
            -
            <Input style="width: auto" v-model="formItem.Cvolume" placeholder="容器卷"></Input>
          </FormItem>
          <FormItem label="镜像">
            <Select v-model="formItem.Image">
              <Option v-for="item in images" :value="item.Image" :key="item.Image">{{ item.Image }}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="success" size="large" @click="container_deploy">新增</Button>
      </div>
    </Modal>

    <Modal v-model="modal_new" width="360">
      <p slot="header" style="text-align:center">
        <span>创建网络</span>
      </p>
      <div style="text-align:center">
        <div>
          <div style="width: 80px;">网络名称：</div>
          <Input v-model="formNetrowk.Name" placeholder="英文命名" style="width: 250px" />
        </div>
        <div style="margin-top:5px;">
          <div style="width: 80px;">网段地址：</div>
          <Input v-model="formNetrowk.SubNet" placeholder="172.19.0.0/24" style="width: 250px" />
        </div>
      </div>
      <div slot="footer">
        <Button type="info" size="large" long @click="submit_new_network">提交</Button>
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
            modal2: false,
            formNetrowk: {
                Name: '',
                SubNet: '',
                Machine: ''
            },
            formItem: {
                Machine: this.model1,
                Name: '',
                Network: '',
                Ip: '',
                Image: '',
                Hport:'',
                Cport:'',
                Hvolume:'',
                Cvolume:'',
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
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.docker_network_remove(
                                                params.row.Name
                                            )
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
            model1: [],
            images: []
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
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                headers: { token: Cookie.get('PasswordHash') },
                data: qs.stringify({
                    id: this.model1
                })
            }).then(function(response) {
                that.formItem.Machine = that.model1
                that.$Message.info(response.data.Msg)
                that.data = response.data.Data

                that.docker_images(that.model1)
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
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                headers: { token: Cookie.get('PasswordHash') },
                data: qs.stringify(this.formItem)
            }).then(function(response) {
                that.$Message.info(response.data.Msg)
            })
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
        },
        docker_images(id) {
            let that = this
            axios({
                method: 'post',
                type: 'json',
                url: '/api/v1/docker/images',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                headers: { token: Cookie.get('PasswordHash') },
                data: qs.stringify({
                    id: id
                })
            }).then(function(response) {
                that.images = response.data.Data
            })
        },
        docker_network_remove(name) {
            if (confirm('确认要删除这个网络？')) {
                let that = this
                axios({
                    method: 'post',
                    type: 'json',
                    url: '/api/v1/docker/networkremove',
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    headers: { token: Cookie.get('PasswordHash') },
                    data: qs.stringify({
                        id: this.model1,
                        name: name
                    })
                }).then(function(response) {
                    that.$Message.info(response.data.Msg)
                })
            }
        }
    }
}
</script>
