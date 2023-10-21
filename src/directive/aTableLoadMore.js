// Ant Design Vue表格滚动下拉加载

export default {
    install(Vue) {
        Vue.mixin({
            directives: {
                loadmore: {
                    mounted(el, binding) {
                        let bindTime;
                        let antiShake;

                        clearTimeout(bindTime)
                        bindTime = window.setTimeout(function () {
                            let selectWrap = el.querySelector(".ant-table-body");
                            if (!selectWrap) selectWrap = el.querySelector(".el-table__body-wrapper");
                            var lastScrollTop = 0;
                            selectWrap.addEventListener("scroll", function () {
                                let offsetValue = 5;
                                if (this.scrollTop == 0) {
                                    binding.value('up', this);
                                    return false;
                                }
                                if (lastScrollTop != this.scrollTop) {
                                    lastScrollTop = this.scrollTop;
                                    const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight;
                                    if (scrollDistance <= offsetValue) {
                                        // 防抖
                                        clearTimeout(antiShake);
                                        antiShake = window.setTimeout(function () { binding.value('down', this); }, 500)
                                    } else {
                                        clearTimeout(antiShake);
                                    }
                                }
                            }, false);
                        }, 200);
                    }
                }
            }
        });
    }
}