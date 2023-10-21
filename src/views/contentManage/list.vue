<template>
  <div class="bc-f pd-1024 br-8 mb-12 df ai-ct">
    <div><a-input-search v-model:value="table.title" placeholder="请输入标题" enter-button="搜索" @search="searchcontent" />
    </div>
    <div class="fl-1"></div>
    <!-- <a-button type="primary" class="mr-8" @click="searchcontent">搜索</a-button> -->
    <a-button type="primary" class="mr-8" @click="changecontent">新增</a-button>
    <!-- <a-button type="primary" @click="importcontent">批量导入</a-button> -->
    <a-upload class="mr-8" name="file" accept=".xlsx,.xls" :before-upload="beforeUpload" :customRequest="customRequest">
      <a-button type="primary">
        批量导入
      </a-button>
    </a-upload>
    <a-button type="primary" class="mr-8" danger @click="delcontent">批量删除</a-button>



  </div>
  <div class="bc-f pd-1024 br-8 min-h-600  mb-12 ">
    <a-table :columns="table.columns" rowKey="id" :row-selection="rowSelection" :data-source="table.dataSource"
      :pagination="false" :loading="table.loading">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'set'">
          <a-button type="link" class="cl-3978 " @click="detailcontent(record)">查看详情</a-button>
          <a-button type="link" class="cl-3978 " @click="changecontent1(record)">修改</a-button>
          <!-- <a-button type="link" @click="detailcontent(record.id)">查看详情</a-button> -->
        </template>
        <template v-if="column.key === 'title'">
          <div :title="record.title" class="overflow1">{{ record.title }}</div>
        </template>
      </template>
    </a-table>
    <div class="df jc-fe mt-8" v-if="table.total > 0">
      <a-pagination v-model:current="table.pagecurrent" v-model:pageSize="table.pagesize"
        :page-size-options="pageSizeOptions" show-size-changer show-quick-jumper :total="table.total" @change="onChange"
        @showSizeChange="onShowSizeChange" />
    </div>

  </div>
  <!-- 新增内容 -->
  <a-drawer width="800px" v-model:open="detail.open" :title="detail.title" placement="right"
    @after-open-change="afterOpenChange">
    <div class="df mb-16 fs-18">
      <p class="w-94 ta-rt">标题：</p>
      <div class="w-680">{{ detail.title }}</div>
    </div>
    <div class="df mb-16 fs-18">
      <p class="w-94 ta-rt">内容：</p>
      <div class="w-680  " id="detailcontenthtml" v-html="detail.content"></div>
    </div>
    <div class="df mb-16 fs-18">
      <p class="w-94 ta-rt">创建时间：</p>
      <div class="w-680">{{ detail.createTime }}</div>
    </div>
    <div class="df fs-18">
      <p class="w-94 ta-rt">更新时间：</p>
      <div class="w-680">{{ detail.updateTime }}</div>
    </div>
  </a-drawer>
</template>

<script setup>
import { getcontentlist, delcontentlist, getcontentdetail, importcontentlist } from "@/apis/post";
import { message } from "ant-design-vue";
import debounce from "debounce";
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const emit = defineEmits(["openNewMenuItem", 'sonRouteRefresh', 'confirm'])
const pageSizeOptions = ref(['10', '20', '30']);


const table = ref({  // 表格相关数据
  loading: true,
  dataSource: [],
  checkarr: [],
  columns: [
    // {
    //   title: 'id',
    //   dataIndex: 'id',
    //   width: '20%',
    // },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: '操作',
      key: 'set',
      width: 220

    },
  ],
  pagesize: 10,
  pagecurrent: 1,
  total: 0,
  title: ''

})
const detail = ref({   // 新增内容相关数据
  open: false,
  title: '',
  content: '',
  createTime: '',
  id: '',
  updateTime: ''
})

onBeforeMount(() => {
  getdata()
})
const getdata = () => {  // 获取列表信息
  let data = {
    pageNum: table.value.pagecurrent,
    pageSize: table.value.pagesize,
    title: table.value.title,
    orders: [
      {
        asc: true,
        column: "id"
      }
    ]
  }
  getcontentlist(data).then(res => {
    table.value.dataSource = res.data.list
    table.value.total = res.data.total
    table.value.loading = false
  }).catch(error => {
    table.value.loading = false
  })
}



const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    table.value.checkarr = selectedRowKeys
  },

};
// 批量删除内容
const delcontent = debounce(() => {
  if (table.value.checkarr.length > 0) {
    table.value.loading = true
    let data = {
      ids: table.value.checkarr
    }
    delcontentlist(data).then(res => {
      console.log(res);
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

}, 500)
// 新增和修改内容
const changecontent = () => {
  emit("openNewMenuItem", 12, "内容编辑");
}
const changecontent1 = (e) => {
  emit("openNewMenuItem", 12, "内容编辑", { type: '12', id: e.id });
}

// 查看新增内容
const detailcontent = (e) => {
  detail.value.id = e.id
  getcontentdetail('id=' + detail.value.id).then(res => {
    if (res.success) {
      detail.value.title = e.title
      // detail.value.content = res.data.content
      detail.value.content = res.data.viewContent

      detail.value.createTime = res.data.createTime
      detail.value.updateTime = res.data.updateTime
      detail.value.open = true
    }
  }).catch(error => {
    // console.log(error);
  })

}
const afterOpenChange = bool => {
  // console.log('open', bool);
};
// 分页器发生改变
const onChange = () => {
  getdata()
}
const onShowSizeChange = () => {
  getdata()
}
// 搜索
const searchcontent = () => {
  table.value.title = table.value.title.trim()
  table.value.pagecurrent = 1
  getdata()
}

// 批量导入
const beforeUpload = (file) => {
  // console.log(file);
}
// 自定义导入excel 
const customRequest = debounce((file) => {
  table.value.loading = true

  let formData = new FormData();
  formData.append("file", file.file);
  importcontentlist(formData).then(res => {
    if (res.success) {
      message.success('上传成功')
      getdata()
    } else {
      message.error(res.message)
      table.value.loading = false

    }
  })

}, 500)


</script>

<style  lang="less">
#detailcontenthtml {
  img {
    max-width: 680px;
    display: block;
    margin: auto;
  }
}
</style>