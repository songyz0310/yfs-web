// translate router.meta.title, be used in breadcrumb sidebar tagsview
export function generateTitle(title) {
    const hasKey = this.$te('route.' + title)

    if (hasKey) {
        // $t :this method from vue-i18n, inject in @/lang/index.js
        const translatedTitle = this.$t('route.' + title)

        return translatedTitle
    }
    return title
}

//封装全局的国际化获取方法
export function i18nMsg(key, defMsg) {
    if (window.vm && key) {
        if (window.vm.$t(key) === key) {
            console.error("存在未国际化的Key：" + key)
        }

        return window.vm.$t(key) || defMsg || "";
    } else {
        return defMsg || "";
    }
}