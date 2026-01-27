<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { SendOutlined } from '@ant-design/icons-vue'
import { splitMessageToVNodes } from '../../common/helper'
import config from '../../config'

const props = defineProps<{
    queryAsn: Function,
    loading: boolean
}>()

const t = useI18n().t
const asnForm = ref({ asn: Number(localStorage.getItem('lastAsn') || '424242') })
const isLoading = computed(() => props.loading)
</script>

<template>
    <a-spin :tip="`${t('pages.signIn.queryingSignInMethod')}`" :spinning="isLoading">
        <a-alert :message="splitMessageToVNodes(t('pages.signIn.step1Introduction'))" type="info" />
        <br />
        <a-form :model="asnForm"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
        >
            <a-form-item class="asnForm" name="asn"
                :rules="[{ required: true, message: `${t('pages.signIn.pleaseInput')} ${t('pages.signIn.asn')}` }]"
            >
                <a-input-search style="width:320px" type="number" v-model:value="asnForm.asn" @search="queryAsn(asnForm.asn)" size="large" addon-before="AS" placeholder="424242〇〇〇〇" :disabled="loading">
                    <template #enterButton>
                        <a-button type="primary" :disabled="loading">
                            <template #icon>
                                <send-outlined />
                            </template>
                            {{ t('pages.signIn.signIn') }}
                        </a-button>
                    </template>
                </a-input-search>
            </a-form-item>
        </a-form>

        <a-divider class="open-auth" orientation="center">{{ t('pages.signIn.youCanAlso') }}</a-divider>

        <form class="kioubit-auth-form" action="https://dn42.g-load.eu/auth/">
            <link rel="stylesheet" href="../../assets/openAuth/kioubit/auth.css">
            <input type="hidden" name="return" :value="`${config.openAuthCallback.kioubit}`">
            <button type="submit" class="kioubit-btn-dark">
                <img class="kioubit-btn-logo" width="20" height="20" type="image/svg+xml" src="../../assets/openAuth/kioubit/auth.svg">
                {{ t('pages.signIn.authWithKioubit') }}
            </button>
        </form>

        <div class="signup"><a href="https://dn42.jp" target="_blank">{{ t('pages.signIn.signUp') }}</a></div>
    </a-spin>
</template>

<style scoped>
.asnForm {
    margin: 50px auto;
    display: flex;
    justify-content: center;
}
.open-auth {
    margin-top: 100px;
    font-size: 1em;
}
.signup {
    text-align: center;
}
.kioubit-auth-form {
    margin: 30px auto;
}
.kioubit-btn-dark {
    margin: 0 auto;
    font-size: 12px !important;
    cursor: pointer;
}
.kioubit-btn-logo {
    margin-right: 5px !important;
}
.kioubit-btn-dark,.kioubit-btn-light{font-weight:400;font-size:1rem;line-height:1.5;padding:.5em;display:flex;transition:color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out}.kioubit-btn-dark{color:#fff;background-color:#343a40;vertical-align:middle;border:1px solid transparent;border-radius:.4rem;align-items:center}.kioubit-btn-dark:hover{color:#fff;background-color:#651fff;border-color:#1d2124}.kioubit-btn-dark:focus,.kioubit-btn-light:focus{outline:0;box-shadow:0 0 0 .2rem rgba(82,88,93,.5)}.kioubit-btn-light{color:#fafafa;background-color:#2962ff;border:1px solid transparent;border-radius:.4rem;align-items:center}.kioubit-btn-light:hover{color:#fff;background-color:#311b92;border-color:#1d2124}.kioubit-btn-logo{margin-right:.5em;}
</style>
