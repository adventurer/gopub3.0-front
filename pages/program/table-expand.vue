<style scoped>
.expand-row {
  margin-bottom: 16px;
}
</style>
<template>
  <div>
    <Row class="expand-row">
      <Col span="12">
        <span class="expand-key">上线用仓库:</span>
        <span class="expand-value">{{ row.Repo }}</span>
      </Col>
      <Col span="12">
        <span class="expand-key">真实仓库 :</span>
        <span class="expand-value">{{ row.RepoReal }}</span>
      </Col>
      <template v-for="item in row.DeployStep">
        <Col span="6" style="margin-top:10px;">
          <span class="expand-key">步骤 : {{ item.Title }}</span>
        </Col>
        <Col span="18" style="margin-top:10px;">
          <span class="expand-value">操作：{{ item.Action }}</span>
        </Col>
      </template>
    </Row>
    <Row></Row>
  </div>
</template>
<script>
export default {
  props: {
    row: Object
  }
}
</script>