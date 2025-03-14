<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { message, Modal } from 'ant-design-vue'
import { FileAddOutlined } from '@ant-design/icons-vue'
import { loggedIn, nullOrEmpty, formatDate } from '../../common/helper'
import { makeRequest, PostMetadaResponse, PostMetadata, PostResponse } from '../../common/packetHandler'

const t = useI18n().t
const router = useRouter()

const loading = ref(false)

const posts: Ref<PostMetadata[]> = ref([])
const fetchPosts = async () => {
    try {
        loading.value = true
        const resp = await makeRequest(t, '/list/posts')
        if (resp.success && resp.response) {
            const data = resp.response as PostMetadaResponse
            if (data && Array.isArray(data.posts)) {
                posts.value = data.posts
            }
        }
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    if (!loggedIn.value) {
        message.info(t('pages.nodes.pleaseSignIn'))
        router.replace({ path: '/signin' })
        return
    }
    await fetchPosts()
})

const columns = ref([
    {
        title: t('pages.manage.posts.title'),
        dataIndex: 'title',
        key: 'title',
        sorter: (a: PostMetadata, b: PostMetadata) => ('' + (a.title || '')).localeCompare((b.title || '')),
    },
    {
        title: t('pages.manage.posts.category'),
        dataIndex: 'category',
        key: 'category',
        sorter: (a: PostMetadata, b: PostMetadata) => ('' + (a.category || '')).localeCompare((b.category || '')),
    },
    {
        title: t('pages.manage.posts.createdAt'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        sorter: (a: PostMetadata, b: PostMetadata) => ('' + a.createdAt).localeCompare(b.createdAt)
    },
    {
        title: t('pages.manage.posts.updatedAt'),
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        sorter: (a: PostMetadata, b: PostMetadata) => ('' + a.updatedAt).localeCompare(b.updatedAt)
    },
    {
        title: t('pages.manage.session.action'),
        dataIndex: 'action',
        key: 'action',
    }
])

const view = (record: PostMetadata) => {
    window.open(`/post/${record.postId}`)
}

const remove = async (record: PostMetadata) => {
    try {
        loading.value = true
        await makeRequest(t, '/admin', {
            action: 'deletePost',
            postId: record.postId
        })
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
        fetchPosts()
    }
}

const modalVisible = ref(false)
const modalLoading = ref(false)
const modalForm = ref({
    category: '',
    title: '',
    content: '',
    postId: -1,
})

const addOrEdit = async () => {
    if (nullOrEmpty(modalForm.value.category) || nullOrEmpty(modalForm.value.title) || nullOrEmpty(modalForm.value.content)) {
        Modal.error({
            centered: true,
            title: t('pages.manage.posts.addOrEdit'),
            content: t('pages.peering.inputValid'),
        })
        return
    }
    try {
        loading.value = true
        modalLoading.value = true
        const data = {
            action: 'setPost',
            type: modalForm.value.postId !== -1 ? 'update' : 'add',
            category: modalForm.value.category,
            title: modalForm.value.title,
            content: modalForm.value.content
        }
        if (modalForm.value.postId !== -1) Object.assign(data, { postId: modalForm.value.postId })
        await makeRequest(t, '/admin', data)
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
        modalLoading.value = false
        modalVisible.value = false
        fetchPosts()
    }
}

const showAddOrEdit = async (record?: PostMetadata) => {
    modalVisible.value = true
    if (!record) {
        modalForm.value.category = ''
        modalForm.value.title = ''
        modalForm.value.content = ''
        modalForm.value.postId = -1
    } else {
        modalForm.value.category = record.category
        modalForm.value.title = record.title
        modalForm.value.postId = record.postId
        modalForm.value.content = ''
        try {
            modalLoading.value = true
            const resp = await makeRequest(t, `/list/post/${record.postId}`)
            if (resp.success && resp.response) {
                const data = resp.response as PostResponse
                if (data && data.content) modalForm.value.content = data.content
            }
        } catch (error) {
            message.error(t('pages.signIn.errorOccurred'))
            console.error(error)
            return
        } finally {
            modalLoading.value = false
        }
    }
}
</script>

<template>
    <div class="buttons">
        <a-button @click="showAddOrEdit()">
            <template #icon>
                <file-add-outlined />
            </template>
            {{ t('pages.manage.posts.add') }}
        </a-button>
    </div>
    <a-table :columns="columns" :data-source="posts" :loading="loading" bordered size="small"
        :scroll="{ x: 'max-content' }">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'createdAt'">
                <span>
                    {{ formatDate(record.createdAt) }}
                </span>
            </template>
            <template v-if="column.key === 'updatedAt'">
                <span>
                    {{ formatDate(record.updatedAt) }}
                </span>
            </template>
            <template v-if="column.key === 'action'">
                <span>
                    <a @click="view(record)">{{ t('pages.manage.posts.view') }}</a>
                    <a-divider type="vertical" />
                    <a @click="showAddOrEdit(record)">{{ t('pages.manage.posts.edit') }}</a>
                    <a-divider type="vertical" />
                    <a-popconfirm placement="bottomRight" @confirm="remove(record)">
                        <template #title>
                            <p>{{ t('pages.manage.session.areYouSure') }}</p>
                        </template>
                        <a>{{ t('pages.manage.session.remove') }}</a>
                    </a-popconfirm>
                </span>
            </template>
        </template>
    </a-table>
    <a-modal v-model:open="modalVisible" :title="t('pages.manage.posts.addOrEdit')" centered>
        <a-spin :spinning="modalLoading">
            <a-form :model="modalForm" class="modalForm">
                <a-form-item name="category" :label="t('pages.manage.posts.category')">
                    <a-input v-model:value="modalForm.category" :placeholder="t('pages.manage.posts.category')" />
                </a-form-item>
                <a-form-item name="title" :label="t('pages.manage.posts.title')">
                    <a-input v-model:value="modalForm.title" :placeholder="t('pages.manage.posts.title')" />
                </a-form-item>
                <a-form-item name="content" :label="t('pages.manage.posts.content')">
                    <a-textarea :rows="8" v-model:value="modalForm.content"
                        :placeholder="t('pages.manage.posts.content')" />
                </a-form-item>
            </a-form>
        </a-spin>
        <template #footer>
            <a-spin :spinning="modalLoading">
                <a-button style="margin-right:10px" type="primary" @click="addOrEdit()">{{ t('pages.manage.config.save')
                    }}</a-button>
                <a-button @click="modalVisible = false">{{ t('pages.manage.posts.close') }}</a-button>
            </a-spin>
        </template>
    </a-modal>
</template>

<style scoped>
.buttons {
    margin: 20px;
}
</style>
