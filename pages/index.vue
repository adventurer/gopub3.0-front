<template>
  <Row>
    <Col span="6" offset="9" style="margin-top:300px">
      <Form ref="formInline" :model="formInline" :rules="ruleInline">
        <FormItem prop="user">
          <Input type="text" v-model="formInline.user" placeholder="Username">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input type="password" v-model="formInline.password" placeholder="Password">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit">Signin</Button>
        </FormItem>
      </Form>
    </Col>
  </Row>
</template>
<script>
import { mapMutations } from 'vuex'

const Cookie = process.client ? require('js-cookie') : undefined
import axios from 'axios'
import qs from 'qs'

export default {
  layout: 'none',
  data() {
    return {
      formInline: {
        user: '',
        password: ''
      },
      ruleInline: {
        user: [
          {
            required: true,
            message: 'Please fill in the user name',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: 'Please fill in the password.',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 6,
            message: 'The password length cannot be less than 6 bits',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    handleSubmit() {
      let that = this
      axios({
        method: 'post',
        type: 'json',
        url: '/api/v1/user/login',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify({
          Email: this.formInline.user,
          Password: this.formInline.password
        })
      }).then(function(response) {
        console.log(response)
        if (!response.data.Sta) {
          that.$Message.info('登录失败：' + response.data.Msg)
          return
        }

        Cookie.set('PasswordHash', response.data.Data.PasswordHash)
        Cookie.set('isLogin', true)
        Cookie.set('Email', response.data.Data.Email)
        Cookie.set('Role', response.data.Data.Role)

        // that.$router.push('/home')
        location.href = '/home'
      })
    }
  }
}
</script>
