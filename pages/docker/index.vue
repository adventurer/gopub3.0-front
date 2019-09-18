<template>
  <div>
    <Select
      @on-change="get_containers"
      v-model="model1"
      style="width:200px;margin-bottom:5px;"
      placeholder="选择主机"
    >
      <Option v-for="item in machines" :value="item.ID" :key="item.Ip">{{ item.Name }}</Option>
    </Select>

    <Table border :columns="columns" :data="data"></Table>
  </div>
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
                    title: '开放端口',
                    key: 'Ports'
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
                                        click: event => {
                                            console.log(event)
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
                            ),
                            h(
                                'Button',
                                {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove_container(params.row)
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
        start_container(row) {
            let that = this
            axios({
                method: 'post',
                type: 'json',
                url: '/api/v1/docker/start',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
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
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
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
        get_containers() {
            let that = this
            axios({
                method: 'post',
                type: 'json',
                url: '/api/v1/docker/list',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                headers: { token: Cookie.get('PasswordHash') },
                data: qs.stringify({
                    id: this.model1
                })
            }).then(function(response) {
                if (response.data.Sta == 1) {
                    that.data = response.data.Data
                    that.$Message.info(response.data.Msg)
                } else {
                    that.data = []
                }
            })
        },
        remove_container(row) {
            if (row.Status=="running") {
                this.$Message.info("不能删除处于运行状态的容器")
                return
            }
            if (confirm('确认删除容器' + row.Name)) {
                let that = this
                axios({
                    method: 'post',
                    type: 'json',
                    url: '/api/v1/docker/remove',
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    headers: { token: Cookie.get('PasswordHash') },
                    data: qs.stringify({
                        id: this.model1,
                        name: row.ID
                    })
                }).then(function(response) {
                    that.$Message.info(response.data.Msg)
                })
            }
        }
    }
}
</script>
