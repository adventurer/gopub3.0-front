<template>
  <div>
    <Row>
      <Col span="24">
        <Select
          @on-change="get_volumes"
          v-model="model1"
          style="width:200px;margin-bottom:5px;"
          placeholder="选择主机"
        >
          <Option v-for="item in machines" :value="item.ID" :key="item.Ip">{{ item.Name }}</Option>
        </Select>

        <Button style="float:right;" type="info" icon="md-add" @click="modal_new = true">创建nfs卷</Button>
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
            <Input style="width: auto" v-model="formItem.Hport" placeholder="主机端口"></Input>-
            <Input style="width: auto" v-model="formItem.Cport" placeholder="容器端口"></Input>
          </FormItem>
          <FormItem label="镜像">
            <!-- <Input v-model="formItem.Image" placeholder="容器镜像"></Input> -->
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
        <span>创建nfs卷</span>
      </p>
      <div>
        <div>
          nfs服务器ip：
          <Input v-model="formVolume.Ip" placeholder="nfs服务器ip" style="width: 100%" />
        </div>
        <div style="margin-top:5px;">
          nfs服务器路径：
          <Input v-model="formVolume.Directory" placeholder="nfs服务目录（带根目录）" style="width: 100%" />
        </div>
        <div style="margin-top:5px;">
          挂载名：
          <Input v-model="formVolume.Name" placeholder="挂载后的卷名" style="width: 100%" />
        </div>
      </div>
      <div slot="footer">
        <Button type="info" size="large" long @click="submit_new_volume">提交</Button>
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
            formVolume: {
                Ip: '',
                Name: '',
                Directory: '',
                Machine: ''
            },
            formItem: {
                Machine: this.model1,
                Name: '',
                Network: '',
                Ip: '',
                Image: '',
                Hport: '',
                Cport: ''
            },
            columns: [
                {
                    title: 'Driver',
                    key: 'Driver',
                    render: (h, params) => {
                        return h('div', [
                            h('Icon', {
                                props: {
                                    type: 'person'
                                }
                            }),
                            h('strong', params.row.Driver)
                        ])
                    }
                },
                {
                    title: 'NAME',
                    key: 'Name'
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
                                            this.volumeInspect(params.row)
                                        }
                                    }
                                },
                                '详情'
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
                                            this.volumeRemove(params.row)
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
        get_volumes() {
            let that = this
            axios({
                method: 'post',
                type: 'json',
                url: '/api/v1/docker/volumes',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                headers: { token: Cookie.get('PasswordHash') },
                data: qs.stringify({
                    id: this.model1
                })
            }).then(function(response) {
                that.$Message.info(response.data.Msg)
                that.data = response.data.Data
            })
        },
        volumeInspect(row) {
            let that = this
            axios({
                method: 'post',
                type: 'json',
                url: '/api/v1/docker/volumeinspect',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                headers: { token: Cookie.get('PasswordHash') },
                data: qs.stringify({
                    id: this.model1,
                    volume: row.Name
                })
            }).then(function(response) {
                that.$Message.info(response.data.Msg)
                that.$Modal.confirm({
                    title: row.Name + ' :inspect',
                    content: '<div>' + response.data.Data + '</div>'
                })
            })
        },
        volumeRemove(row) {
            if (confirm('要删除这个卷？')) {
                let that = this
                axios({
                    method: 'post',
                    type: 'json',
                    url: '/api/v1/docker/volumeremove',
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    headers: { token: Cookie.get('PasswordHash') },
                    data: qs.stringify({
                        id: this.model1,
                        volume: row.Name
                    })
                }).then(function(response) {
                    that.$Message.info(response.data.Msg)
                })
            }
        },
        submit_new_volume() {
            this.formVolume.Machine = this.model1
            let that = this
            axios({
                method: 'post',
                type: 'json',
                url: '/api/v1/docker/volumecreate',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                headers: { token: Cookie.get('PasswordHash') },
                data: qs.stringify(this.formVolume)
            }).then(function(response) {
                that.$Message.info(response.data.Msg)
            })
        }
    }
}
</script>
