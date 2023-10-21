<template>
  <div class="bc-f pd-1024 br-8 mb-12 df ai-ct jc-ct" style="width:100vw;height:100vh">
    <a-result status="404" title="您暂无权限">
      <template #extra>
        <a-button type="primary" @click="back">返回登录页</a-button>
      </template>
    </a-result>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter()
const back = () => {
  router.push({ name: "login" })
}
</script>

<style lang="scss" scoped></style>