<style scoped>
.expand-row {
  margin-bottom: 16px;
}
</style>
<template>
  <div>
    <Row class="expand-row">
      <Col span="6">
        <span class="expand-key">部署耗时:</span>
        <span class="expand-value"><span>{{ deploy_time }}</span>秒</span>
      </Col>
      <Col span="6">
        <span class="expand-key">审批耗时:</span>
        <span class="expand-value"><span style="">{{ audit_time }}</span>秒</span>
      </Col>
      <Col span="6">
        <span class="expand-key">分支:</span>
        <span class="expand-value">{{ row.Branch }}</span>
      </Col>
      <Col span="6">
        <span class="expand-key">版本:</span>
        <span class="expand-value">{{ row.Version }}</span>
      </Col>
    </Row>
    <Row>
      <Col span="6">
        <span class="expand-key">提单时间 :</span>
        <span class="expand-value">{{ row.TicketAt }}</span>
      </Col>
      <Col span="6">
        <span class="expand-key">审核时间:</span>
        <span class="expand-value">{{ row.AuditAt }}</span>
      </Col>
      <Col span="6">
        <span class="expand-key">上线时间:</span>
        <span class="expand-value">{{ row.DeployAt }}</span>
      </Col>
      <Col span="6">
        <span class="expand-key">完成时间:</span>
        <span class="expand-value">{{ row.DoneAt }}</span>
      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  props: {
    row: Object
  },
  computed: {
    audit_time: function () {
        let end = new Date(this.row.AuditAt)

        let begin = new Date(this.row.TicketAt)

        let duration = (end.getTime()-begin.getTime())/1000
        if (duration<0) {
          return 0
        }
        return duration
    },
    deploy_time: function () {
        let end = new Date(this.row.DoneAt)

        let begin = new Date(this.row.DeployAt)

        return (end.getTime()-begin.getTime())/1000
    }
  }
}
</script>