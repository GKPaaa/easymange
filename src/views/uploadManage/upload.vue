<template>
  <div class="bc-f pd-1024 br-8 mb-12 df">
    <div><a-input-search v-model:value="table.question" placeholder="请输入标题" enter-button="搜索" @search="searchcontent" />
    </div>
    <div class="fl-1"></div>
    <a-button type="primary" class="mr-8" @click="exportquestionlist">导出问题</a-button>
    <a-button type="primary" class="mr-8" danger @click="delquestion">批量删除</a-button>

  </div>
  <div class="bc-f pd-1024 br-8 mb-12 min-h-600 ">
    <a-table :columns="table.columns" rowKey="id" :row-selection="rowSelection" :data-source="table.dataSource"
      :pagination="false" :loading="table.loading">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'set'">
          <a-button type="link" class="cl-3978 " @click="addreason(record)">添加说明</a-button>
        </template>
        <template v-if="column.key === 'question'">
          <div class="overflow1" :title="record.question">{{ record.question }}</div>
        </template>

      </template>
    </a-table>
    <div class="df jc-fe mt-8" v-if="table.total > 0">
      <a-pagination v-model:current="table.pagecurrent" v-model:pageSize="table.pagesize"
        :page-size-options="pageSizeOptions" show-size-changer show-quick-jumper :total="table.total" @change="onChange"
        @showSizeChange="onShowSizeChange" />
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["openNewMenuItem", 'sonRouteRefresh', "confirm"])
import { onBeforeMount } from "vue";
import { questionlist, delquestionlist } from "@/apis/post";
import { exportquestion } from "@/apis/get";

import { ref } from "vue";
import { message } from "ant-design-vue";

const pageSizeOptions = ref(['10', '20', '30']); // 分页器单页数据选项


const table = ref({  // 表格相关数据
  loading: true,
  dataSource: [],
  checkarr: [],
  columns: [

    {
      title: '问题',
      dataIndex: 'question',
      key: 'question'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 160

    },
    {
      title: '操作',
      key: 'set',
      width: 140

    },
  ],
  pagesize: 10,
  pagecurrent: 1,
  total: 0,
  question: '',//搜索条件
})


onBeforeMount(() => {
  getdata()
})
const getdata = () => {  // 获取列表信息
  let data = {
    pageNum: table.value.pagecurrent,
    pageSize: table.value.pagesize,
    question: table.value.question,
    orders: [
      {
        asc: true,
        column: "id"
      }
    ]
  }
  questionlist(data).then(res => {
    table.value.dataSource = res.data.list
    table.value.total = res.data.total
    table.value.loading = false
  }).catch(error => {
    table.value.loading = false
  })
}
// 分页器发生改变
const onChange = () => {
  getdata()
}
const onShowSizeChange = () => {
  getdata()
}

// 添加问题说明
const addreason = (e) => {
  console.log(e);
  emit("openNewMenuItem", 22, "添加说明", { type: '22', id: e.id, question: e.question });

}


const rowSelection = {  // 表格选择
  onChange: (selectedRowKeys, selectedRows) => {
    table.value.checkarr = selectedRowKeys
  },
};
// 批量删除
const delquestion = () => {
  if (table.value.checkarr.length > 0) {
    table.value.loading = true
    let data = {
      ids: table.value.checkarr
    }
    delquestionlist(data).then(res => {
      if (res.success) {
        message.success('删除成功')
        table.value.checkarr = []
        table.value.pagecurrent = 1
        getdata()
      } else {
        message.error(res.message)
        table.value.loading = false

      }
    }).catch(error => {
      // console.log(error);
    })
  } else {
    message.warn('请选择要删除的内容')
  }
}
// 导出问题
const exportquestionlist = () => {
  let str = ''
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === "development") {

    str = "https://dingbot-test.bookuu.com/robot/backend/export/question";
  } else {
    str =
      window.location.protocol +
      "//" +
      window.location.hostname +
      ":" +
      window.location.port +
      "/robot/backend/export/question";
  }
  let a = document.createElement("a");
  a.setAttribute("href", str);
  a.click();
  a.remove()
  // exportquestion().then(res => {
  // console.log(res);
  // let a = document.createElement("a");
  // let blob = new Blob([res], {
  //   type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8'
  // })
  // let objectUrl = URL.createObjectURL(blob);
  // a.setAttribute("href", objectUrl);
  // a.setAttribute("download", "遗漏问题导出.xlsx");
  // a.click();
  // a.remove()
  // })
}
const searchcontent = () => {
  // 根据条件搜索
  table.value.question = table.value.question.trim()
  table.value.pagecurrent = 1
  getdata()

}

</script>

<style lang="scss" scoped></style>