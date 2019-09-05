<style scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-logo {
  width: 100px;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}
.layout-nav {
  float: right;
  color: #fff;
}
</style>
<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo"></div>
          <!-- <div class="layout-nav">
            <MenuItem name="1">
              <Icon type="ios-navigate"></Icon>Item 1
            </MenuItem>
            <MenuItem name="2">
              <Icon type="ios-keypad"></Icon>Item 2
            </MenuItem>
            <MenuItem name="3">
              <Icon type="ios-analytics"></Icon>Item 3
            </MenuItem>
            <MenuItem name="4">
              <Icon type="ios-paper"></Icon>Item 4
            </MenuItem>
          </div>-->
          <div class="demo-avatar layout-nav">
            <Avatar icon="ios-person" />
            <Dropdown>
              <a href="javascript:void(0)" :style="{color:'#fff'}">
                {{userName}}
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem>
                  <a @click="change_pass">修改资料</a>
                </DropdownItem>
                <DropdownItem divided>
                  <a @click="log_out">登出</a>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </Menu>
      </Header>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu
            :style="{'min-height':menuHeight+'px'}"
            :active-name="active"
            theme="light"
            width="auto"
            accordion
            :open-names="open"
            @on-select="active_item"
            @on-open-change="open_item"
          >
            <Submenu name="1">
              <template slot="title">
                <Icon type="ios-desktop-outline"></Icon>综合控制台
              </template>
              <MenuItem name="1-1" to="/home">首页</MenuItem>
            </Submenu>
            <Submenu name="2">
              <template slot="title">
                <Icon type="ios-list-box-outline"></Icon>上线单
              </template>
              <MenuItem name="2-1" to="/task">上线单列表</MenuItem>
              <MenuItem name="2-2" to="/task/new">新建上线单</MenuItem>
            </Submenu>
            <Submenu name="3">
              <template slot="title">
                <Icon type="ios-paper-outline"></Icon>项目
              </template>
              <MenuItem name="3-1" to="/program">项目列表</MenuItem>
            </Submenu>
            <Submenu name="4">
              <template slot="title">
                <Icon type="ios-cloud-outline"></Icon>主机
              </template>
              <MenuItem name="4-1" to="/machine">主机列表</MenuItem>
            </Submenu>
            <Submenu name="5">
              <template slot="title">
                <Icon type="logo-github"></Icon>内外网服务穿透
              </template>
              <MenuItem name="5-1" to="/service">服务穿透列表</MenuItem>
            </Submenu>
            <Submenu name="6">
              <template slot="title">
                <Icon type="ios-clock-outline"></Icon>计划任务
              </template>
              <MenuItem name="6-1" to="/cron">计划任务列表</MenuItem>
            </Submenu>
            <Submenu name="7">
              <template slot="title">
                <Icon type="ios-cube-outline"></Icon>容器
              </template>
              <MenuItem name="7-1" to="/docker/network">网络</MenuItem>
              <MenuItem name="7-2" to="/docker">容器列表</MenuItem>
              <MenuItem name="7-3" to="/docker/port">端口转发</MenuItem>
            </Submenu>
            <Submenu name="8">
              <template slot="title">
                <Icon type="ios-at-outline"></Icon>域名
              </template>
              <MenuItem name="8-1" to="/domain/setting">域名配置</MenuItem>
              <MenuItem name="8-2" to="/domain">域名列表</MenuItem>
            </Submenu>
            <Submenu name="9">
              <template slot="title">
                <Icon type="ios-construct-outline"></Icon>设置
              </template>
              <MenuItem name="9-1" to="/user">用户设置</MenuItem>
            </Submenu>
          </Menu>
        </Sider>
        <Layout :style="{padding: ''}">
          <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
            <nuxt />
          </Content>
        </Layout>
      </Layout>
    </Layout>

    <Modal v-model="modal_pass" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>修改密码</span>
      </p>
      <div style="text-align:center">
        <Input v-model="newpass" placeholder="输入新密码" type="password" />
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="newpass_submit">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { log } from 'util'
import axios from 'axios'
import qs from 'qs'
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  data() {
    return {
      newpass: '',
      modal_pass: false,
      menuHeight: 100,
      active: '1-1',
      open_t: ['2'],
      userName: ''
    }
  },
  computed: {
    open: {
      get() {
        return this.open_t
      },
      set() {}
    }
  },
  beforeMount: function() {
    this.menuHeight = document.documentElement.clientHeight - 60
    this.active = Cookie.get('active-item')
    this.open_t = [Cookie.get('open-item')]
    this.userName = Cookie.get('Email')
  },
  methods: {
    active_item: function(name) {
      Cookie.set('active-item', name)
    },
    open_item: function(name) {
      Cookie.set('open-item', name[0])
    },
    change_pass() {
      this.modal_pass = true
    },
    newpass_submit() {
      let that = this
      axios({
        method: 'post',
        type: 'json',
        url: '/api/v1/user/repass',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        headers: { token: Cookie.get('PasswordHash') },
        data: qs.stringify({
          pass: this.newpass
        })
      }).then(function(response) {
        // console.log(that)
        // console.log(response)
        that.modal_pass = false
        that.$Message.info('修改成功')
      })
    },
    log_out() {
      Cookie.remove('PasswordHash')
      Cookie.remove('isLogin')
      Cookie.remove('Email')
      Cookie.remove('Role')
      location.href = '/'
    }
  }
}
</script>
