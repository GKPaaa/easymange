<template>
  <div class="bc-f pd-1024 br-8 mb-12">
    <!-- <div class="df ai-ct fs-16 cl-3978 lh-24 fw-6 page-tip">新增任务</div> -->

    <div class="fs-24 cl-306C" v-if="contentedit.type == 12">
      <EditFilled /> 修改
    </div>
    <div class="fs-24 cl-306C" v-else-if="contentedit.type == 22">
      <PlusCircleFilled /> 添加说明
    </div>
    <div class="fs-24 cl-306C" v-else>
      <PlusCircleFilled /> 新增
    </div>
  </div>

  <div class="bc-f pd-1024 br-8 mb-12 min-h-600">
    <div class="df mt-16">
      <div class="w-80 cl-000085 ta-rt lh-38" v-if="contentedit.type == 22"><span class="cl-f522">*</span>问题：</div>

      <div class="w-80 cl-000085 ta-rt lh-38" v-else><span class="cl-f522">*</span>标题：</div>
      <a-input style="width: 420px;" v-model:value="contentedit.title" placeholder="请输入" />
    </div>

    <div class="df mt-16 tinymceEditor">
      <div class="w-80 cl-000085 ta-rt" v-if="contentedit.type == 22"><span class="cl-f522">*</span>添加说明：</div>
      <div class="w-80 cl-000085 ta-rt" v-else><span class="cl-f522">*</span>任务内容：</div>
      <!-- <TEditor ref="editor" v-model="contentedit.content" /> -->
      <editor v-model="contentedit.content" :init="init" :disabled="disabled" :id="tinymceId"></editor>

    </div>
    <a-button type="primary" class="ml-80 mt-16" @click="confirm">确定提交</a-button>
  </div>


  <!-- 指定一个容器 -->
  <div id="vditor"></div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { getcontentdetail, changecontentlist, answerquestion, uploadimg } from "@/apis/post";
import { EditFilled, PlusCircleFilled } from "@ant-design/icons-vue";
import { reactive, ref, onMounted, onBeforeMount, watch, onUnmounted, onUpdated } from "vue";
import TurndownService from 'turndown';

const turndownService = new TurndownService();


import debounce from "debounce";

import tinymce from "tinymce/tinymce";
import "tinymce/skins/content/default/content.css";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/themes/silver";
import "tinymce/themes/silver/theme";
import "tinymce/icons/default";
import "tinymce/models/dom";
import 'tinymce/plugins/image'// 插入上传图片插件
import "tinymce/icons/default/icons";
import "tinymce/plugins/table";
import "tinymce/plugins/lists";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/code";
import { message } from "ant-design-vue";


const props = defineProps({
  value: {
    type: String,
    default: () => {
      return "";
    },
  },
  baseUrl: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  plugins: {
    type: [String, Array],
    // default: "lists  table",
    default: "lists image",
  }, //必填
  toolbar: {
    type: [String, Array],
    default:
      "image codesample bold italic underline alignleft aligncenter alignright alignjustify | undo redo | formatselect | fontselect | fontsizeselect | forecolor backcolor | bullist numlist outdent indent | lists link table code | removeformat ",
  }, //必填
});
//用于接收外部传递进来的富文本
const tinymceId = ref(
  "vue-tinymce-" + +new Date() + ((Math.random() * 1000).toFixed(0) + "")
);
//定义一个对象 init初始化
const init = reactive({
  selector: "#" + tinymceId.value, //富文本编辑器的id,
  language_url: "/tinymce/langs/zh_CN.js", // 语言包的路径，具体路径看自己的项目，文档后面附上中文js文件
  language: "zh_CN", //语言
  skin_url: "/tinymce/skins/ui/oxide", // skin路径，具体路径看自己的项目
  height: 400, //编辑器高度
  branding: false, //是否禁用“Powered by TinyMCE”
  menubar: false, //顶部菜单栏显示
  promotion: false,  // 去除升级功能
  image_dimensions: false, //去除宽高属性
  plugins: props.plugins, //这里的数据是在props里面就定义好了的
  toolbar: props.toolbar, //这里的数据是在props里面就定义好了的
  font_formats:
    "Arial=arial,helvetica,sans-serif; 宋体=SimSun; 微软雅黑=Microsoft Yahei; Impact=impact,chicago;", //字体
  fontsize_formats: "11px 12px 14px 16px 18px 24px 36px 48px 64px 72px", //文字大小
  // paste_convert_word_fake_lists: false, // 插入word文档需要该属性
  paste_webkit_styles: "all",
  paste_merge_formats: true,
  nonbreaking_force_tab: false,
  paste_auto_cleanup_on_paste: false,
  // file_picker_types: "file",
  paste_data_images: false, // 不允许粘贴图片
  content_css: "/tinymce/skins/content/default/content.css", //以css文件方式自定义可编辑区域的css样式，css文件需自己创建并引入
  file_picker_callback: function (callback, value, meta) {
    if (meta.filetype == "image") {

      let input = document.createElement("input");
      input.type = "file";
      input.click();
      input.onchange = function (e) {
        let baseURL;

        let file = input.files[0];
        const formData = new FormData();
        formData.append("media", file);
        // console.log(file);
        // let data = {
        //   media: formData
        // }
        uploadimg(formData).then(res => {
          callback(res.message)
        })
        // formData.append("method", "upload.image.add");
        // formData.append(
        //   "token",
        //   window.localStorage.getItem("backtoken")
        // );
        // formData.append("type", "notice");
        // formData.append("file", file);
        // // fetch("http://pf.bookuu.cn//adminapi/index.php", {
        // fetch(baseURL, {
        //   method: "POST",
        //   body: formData,
        // })
        //   .then((response) => response.json())
        //   .then((data) => {
        //     if (data.status == "1") {
        //       callback(data.info.http_url);
        //     } else {
        //     }
        //   });
      };
    }
  },
});

const emit = defineEmits(["openNewMenuItem", "confirm"])
const router = useRouter()
const contentedit = ref({  // 内容编辑或新增
  id: null,
  title: '',
  content: "",
  type: null
})
onBeforeMount(() => {
  contentedit.value.id = router.currentRoute.value.query.id
  contentedit.value.type = router.currentRoute.value.query.type
  if (contentedit.value.id !== null && contentedit.value.type == 12) {
    // getdata()
  } else if (contentedit.value.id !== null && contentedit.value.type == 22) {
    contentedit.value.title = router.currentRoute.value.query.question
  }

})
onMounted(() => {

})

const getdata = () => {

  getcontentdetail('id=' + router.currentRoute.value.query.id).then(res => {
    if (res.success) {
      // contentedit.value.content = res.data.content
      contentedit.value.content = res.data.viewContent
      contentedit.value.title = res.data.title
    }
  })
}  // 获取数据

// 确定修改或者新增

const confirm = debounce(() => {
  let markdown = turndownService.turndown(contentedit.value.content)

  if (contentedit.value.title && contentedit.value.content) {
    if (contentedit.value.id && contentedit.value.type == 12) { // 编辑内容
      let data = {
        id: contentedit.value.id,
        title: contentedit.value.title,
        content: markdown,
        viewContent: contentedit.value.content
      }
      changecontentlist(data).then(res => {
        if (res.success) {
          message.success('修改成功')
          setTimeout(() => {
            emit("openNewMenuItem", 11, "内容列表");
            emit('confirm', '12')
          }, 1000);
        } else {
          message.error(res.message)
        }
      })

    } else if (contentedit.value.id && contentedit.value.type == 22) {
      let data = {
        id: contentedit.value.id,
        question: contentedit.value.title,
        // content: contentedit.value.content
        content: markdown,
        viewContent: contentedit.value.content
      }
      answerquestion(data).then(res => {
        if (res.success) {
          message.success(res.message)
          setTimeout(() => {
            emit("openNewMenuItem", 21, "问题列表");
            emit('confirm', '22')
          }, 1000);
        } else {
          message.error(res.message)

        }
      })
      //添加说明
    } else {
      //新增内容
      let data = {
        title: contentedit.value.title,
        // content: contentedit.value.content
        content: markdown,
        viewContent: contentedit.value.content
      }
      changecontentlist(data).then(res => {
        if (res.success) {
          message.success('新增成功')
          setTimeout(() => {
            emit("openNewMenuItem", 11, "内容列表");
            emit('confirm', '12')
          }, 1000);
        } else {
          message.error(res.message)
        }
      })

    }
  } else {
    message.warn('请输入必填项')
  }

}, 500)

// 监听路由参数发生变化
watch(
  () => router.currentRoute.value,
  (newValue) => {
    contentedit.value.id = router.currentRoute.value.query.id
    contentedit.value.type = router.currentRoute.value.query.type
    if (newValue.query.type == 22) {
      contentedit.value.title = ''
      contentedit.value.content = ''
      contentedit.value.title = router.currentRoute.value.query.question
    } else if (newValue.query.type == 12) {
      getdata()
    }
  },
  { immediate: true }
)

</script>

<style scoped></style>

