<template>
  <div>
    <!-- project model -->
    <div style="text-align:center;margin-bottom:10px;">
      <Button @click="projectModel = true">新增项目</Button>
    </div>
    <Modal v-model="projectModel" width="800">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>新增项目</span>
      </p>
      <div style="text-align:center">
        <Form :model="formProject" :label-width="80">
          <FormItem label="项目">
            <Input v-model="formProject.Name" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="上线用仓库">
            <Input v-model="formProject.Repo" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="真实仓库">
            <Input v-model="formProject.RepoReal" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="审核">
            <!-- <Input v-model="formProject.Audit" placeholder="Enter something..."></Input> -->
            <Select v-model="formProject.Audit" placeholder="是否需要审核">
              <Option value="0">否</Option>
              <Option value="1">是</Option>
            </Select>
          </FormItem>
          <FormItem label="部署目录">
            <Input v-model="formProject.Deploy" placeholder="部署路径"></Input>
          </FormItem>
          <FormItem label="部署名">
            <Input v-model="formProject.DeployName" placeholder="部署路径下的项目名称"></Input>
          </FormItem>
          <p>上线步骤</p>
          <Divider />
          <template v-for="item,index in deployStep">
            <FormItem :label="'步骤：'+index">
              <Input v-model="deployStep[index].Title" width="200px">
                <span slot="prepend">title</span>
              </Input>
              <Input v-model="deployStep[index].Action">
                <span slot="prepend">action</span>
              </Input>
            </FormItem>
          </template>

          <Button icon="ios-add" type="primary" shape="circle" @click="add_step"></Button>
        </Form>
      </div>
      <div slot="footer">
        <Button type="success" size="large" @click="project_add" long>新增</Button>
      </div>
    </Modal>
    <!-- host model -->
    <Modal v-model="hostModel" width="400">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>添加主机</span>
      </p>
      <div style="text-align:center">
        <Form :model="formHost" :label-width="60">
          <FormItem label="项目名">
            <Input v-model="formHost.Name" placeholder="项目id,必填" disabled></Input>
          </FormItem>
          <FormItem label="项目ID">
            <Input v-model="formHost.Project" placeholder="项目id,必填" disabled></Input>
          </FormItem>
          <FormItem label="主机">
            <Input v-model="formHost.Host" placeholder="输入主机别名',' 分割"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="success" size="large" @click="host_add">新增</Button>
      </div>
    </Modal>

    <Table border :columns="columns" :data="data"></Table>
    <Alert>
        变量提示：
        <template slot="desc">上线单版本：__version__</template>
    </Alert>
  </div>
</template>
<script>
import axios from 'axios'
import qs from 'qs'
const Cookie = process.client ? require('js-cookie') : undefined
import expandRow from './table-expand.vue'

export default {
  data() {
    return {
      initStatu:false,
      projectModel: false,
      hostModel: false,
      formProject: {
        Name: '',
        Repo: '',
        Audit: 0,
        Deploy: '',
        CmdPreFetch: '',
        CmdPreUpdate: '',
        CmdEnd: '',
        RepoReal: ''
      },
      deployStep: [
      ],
      formHost: {
        Name: '',
        Project: '',
        Host: ''
      },
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
          key: 'id',
          width: 60,
          align: 'center',
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
          title: '项目',
          key: 'name',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'person'
                }
              }),
              h('strong', params.row.Name)
            ])
          }
        },
        {
          title: '审核',
          key: 'Audit',
          width: 80,
          align: 'center'
        },
        {
          title: '部署目录',
          key: 'Deploy'
        },
        {
          title: '部署名',
          key: 'DeployName'
        },
        {
          title: '主机',
          key: 'action',
          align: 'center',
          //   render多个元素实例
          render: (h, params) => {
            let arr = params.row.Host.split(',')
            return h(
              'div',
              arr.map(function(item) {
                //   获取的值
                console.log(item)
                return h(
                  'Tag',
                  {
                    props: {
                      color: 'primary'
                    }
                  },
                  item
                )
              })
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 200,
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
                      this.hostModel = true
                      this.formHost.Project = params.row.ID
                      this.formHost.Name = params.row.Name
                    }
                  }
                },
                '修改主机'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'warning',
                    size: 'small',
                    loading:this.initStatu
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.initStatu = true
                      this.project_init(params.row.ID)
                    }
                  }
                },
                '初始化'
              )
            ])
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
      url: '/api/v1/project/list',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      headers: { token: Cookie.get('PasswordHash') }
    }).then(function(response) {
      console.log(response.data.Data)
      that.data = response.data.Data
    })
  },
  methods: {
    project_add() {
      let that = this
      axios({
        method: 'post',
        type: 'json',
        url: '/api/v1/project/add',
        headers: { 'Content-Type': 'application/json' },
        headers: { token: Cookie.get('PasswordHash') },
        transformRequest: [
          function(data) {
            data = JSON.stringify(data)
            return data
          }
        ],
        data: {
          Name: this.formProject.Name,
          Repo: this.formProject.Repo,
          Audit:Number(this.formProject.Audit),
          Deploy: this.formProject.Deploy,
          DeployName: this.formProject.DeployName,
          RepoReal: this.formProject.RepoReal,
          DeployStep: this.deployStep
        }
      }).then(function(response) {
        console.log(response.data.Data)
        that.$Message.info('新增成功')
        that.projectModel = false
      })
    },
    host_add() {
      let that = this
      axios({
        method: 'post',
        type: 'json',
        url: '/api/v1/project/hostadd',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        headers: { token: Cookie.get('PasswordHash') },
        data: qs.stringify({
          Host: this.formHost.Host,
          Project: this.formHost.Project
        })
      }).then(function(response) {
        console.log(response.data.Data)
        that.$Message.info('新增成功')
        that.formHost = {}
        that.hostModel = false
      })
    },
    add_step() {
      console.log(this.deployStep)
      this.deployStep.push({ Title: '', Action: '' })
    },
    show(index) {
      this.$Modal.info({
        title: 'User Info',
        content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
      })
    },
    remove(index) {
      this.data6.splice(index, 1)
    },
    project_init(id){
      let that = this
      axios({
        method: 'post',
        type: 'json',
        url: '/api/v1/project/init',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        headers: { token: Cookie.get('PasswordHash') },
        data: qs.stringify({
          id: id
        })
      }).then(function(response) {
        that.initStatu = false
        console.log(response.data.Data)
        that.$Message.info(response.data.Msg)
      })
      
    }
  }
}
</script>