<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { SendOutlined } from '@ant-design/icons-vue'
import { splitMessageToVNodes } from '../../common/helper'

const props = defineProps<{
    queryAsn: Function,
    loading: boolean
}>()

const t = useI18n().t
const asnForm = ref({ asn: 424242 })
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
            <a-form-item name="asn" :label="t('pages.signIn.asn')"
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

            <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                <a href="https://dn42.dev" target="_blank">{{ t('pages.signIn.signUp') }}</a>
            </a-form-item>
        </a-form>
    </a-spin>
</template>

<style scoped>
</style>
