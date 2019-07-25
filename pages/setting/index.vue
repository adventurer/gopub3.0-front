<template>
  <Row>
    <Col span="6">
      <Card title="repostory" icon="logo-github" :padding="0" shadow>
        <CellGroup>
          <Cell title="IP" extra="192.168.1.204" />
          <Cell title="port" extra="3000" />
          <Cell title="jump to" to="http://192.168.1.204:3000" target="_blank" selected />
        </CellGroup>
      </Card>
    </Col>
    
  </Row>
</template>
<script>
export default {
  data() {
    return {
      switchValue: true
    }
  }
}
</script>