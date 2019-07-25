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
                <DropdownItem>修改资料</DropdownItem>
                <DropdownItem divided>登出</DropdownItem>
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
              <MenuItem name="1-1" to="home">首页</MenuItem>
              <MenuItem name="1-2">Option 2</MenuItem>
              <MenuItem name="1-3">Option 3</MenuItem>
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
              <MenuItem name="4-2">主机监控</MenuItem>
            </Submenu>
            <Submenu name="5">
              <template slot="title">
                <Icon type="logo-github"></Icon>内网服务穿透
              </template>
              <MenuItem name="5-1" to="/service">服务穿透列表</MenuItem>
            </Submenu>
            <Submenu name="6">
              <template slot="title">
                <Icon type="ios-construct-outline"></Icon>设置
              </template>
              <MenuItem name="6-1" to="/user">用户设置</MenuItem>
              <MenuItem name="6-2" to="/setting">通用设置</MenuItem>
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
  </div>
</template>
<script>
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  data() {
    return {
      menuHeight: 100,
      active: '1-1',
      open_t: ['2'],
      userName:'',
    }
  },
  computed: {
    open: {
      get() {
        return this.open_t
      },
      set() {}
    },
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
    }
  }
}
</script>
