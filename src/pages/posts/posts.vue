<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { StarFilled, NumberOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { makeRequest, Post, PostMetadaResponse, PostMetadata } from '../../common/packetHandler'
import { postCache, formatDate, themeName, VAR_SIZE_LG } from '../../common/helper'
import MenuTrigger from '../../components/MenuTrigger.vue'
import './post.css'

//@ts-ignore
import markdown_it from 'markdown-it'
//@ts-ignore
import mila from 'markdown-it-link-attributes'

const t = useI18n().t
const router = useRouter()
const desiredPostId = router.currentRoute.value.params.id as string || null

const md = new markdown_it({
    html: true
})
md.use(mila, {
  attrs: {
    target: "_blank"
  },
})

const loading = ref(false)
const currentPost: Ref<Post | null> = ref(null)

const postMetadata: Ref<{ [index: string]: PostMetadata[] }> = ref({})

const selectedKeys: Ref<string[]> = ref([])
const openKeys: Ref<string[]> = ref([])
const collapsed: Ref<boolean> =  ref(false)

const loadingPost: Ref<PostMetadata | null> = ref(null)
const fetchPost = async (post: PostMetadata) => {
    if (currentPost.value?.postId === post.postId) return
    try {
        const cache = postCache.get(`post_${post.postId}`)
        if (!cache) {
            loadingPost.value = post
        } else {
            try {
                currentPost.value = cache
                if (cache.updatedAt === postMetadata.value[cache.category].find(p => p.postId === cache.postId)?.updatedAt) return
            } catch (error) {
                console.error(error)
            }
        }
        
        currentPost.value = (await makeRequest(t, '/list', {
            type: 'post',
            postId: post.postId
        })) as Post | null || null

        if (currentPost.value) postCache.set(`post_${post.postId}`, currentPost.value)
    } catch (error) {
        console.error(error)
    } finally {
        loadingPost.value = null
    }
}

const preprocessPostMetadata = async (newPostMetadata: PostMetadata[]) => {
    postMetadata.value = {}
    newPostMetadata.forEach(p => {
        if (!postMetadata.value[p.category]) postMetadata.value[p.category] = []
        postMetadata.value[p.category].push(p)
    })
    try {
        openKeys.value = []
        for (const category in postMetadata.value) openKeys.value.push(category)
        let foundDesiredPost = false
        for (const category in postMetadata.value) {
            if (desiredPostId !== null) {
                const desiredPost = postMetadata.value[category].find(c => c.postId === Number(desiredPostId))
                if (desiredPost) {
                    foundDesiredPost = true
                    selectedKeys.value = [ `post_${desiredPostId}` ]
                    await fetchPost(desiredPost)
                    break
                }
                continue
            }
        }
        if (!foundDesiredPost) {
            router.replace({
                path: '/'
            })
            for (const category in postMetadata.value) {
                selectedKeys.value = [ `post_${postMetadata.value[category][0].postId}` ]
                await fetchPost(postMetadata.value[category][0])
                break
            }
        }
    } catch (error) {
        console.error(error)
    }
}

const fetchPosts = async () => {
    let originalCollapsedStatus = collapsed.value
    try {
        loading.value = true
        collapsed.value = false

        const resp = await makeRequest(t, '/list', {
            type: "posts",
        }) as PostMetadaResponse

        if (Array.isArray(resp.posts)) {
            localStorage.setItem('posts', JSON.stringify(resp.posts))
            await preprocessPostMetadata(resp.posts)
        }
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
        collapsed.value = originalCollapsedStatus
    }
}

onMounted(async () => {
    try {
        const oldPosts = localStorage.getItem('posts')
        if (oldPosts) await preprocessPostMetadata(JSON.parse(oldPosts))
    } catch (error) {
        console.error(error)
    }
    await fetchPosts()
})

const navigateTo = async (post: PostMetadata) => {
    router.push({
        path: `/post/${post.postId}`
    })
    window.scrollTo(0, 0)
    const width  = window.innerWidth || document.documentElement.clientWidth || 
document.body.clientWidth
    if (width < VAR_SIZE_LG) {
        collapsed.value = true
    }
    await fetchPost(post)
}

const toggleMenu = () => {
    collapsed.value = !collapsed.value
    window.scrollTo(0, 0)
}
</script>

<template>
    <section id="wrapper">
        <a-layout-sider :class="`sider ${themeName}`" width="300" collapsible v-model:collapsed="collapsed" :trigger="null" breakpoint="lg" :collapsedWidth="40" v-show="!collapsed">
            <a-spin :spinning="loading && openKeys.length === 0">
                <div v-if="loading && openKeys.length === 0" class="pad"></div>
                <a-menu class="menu" v-else mode="inline" v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys">
                    <a-sub-menu v-for="(_, category) in postMetadata" :key="category">
                        <template #icon>
                            <star-filled />
                        </template>
                        <template #title>
                            <b>{{ category }}</b>
                        </template>
                        <a-menu-item v-for="meta in postMetadata[category]" :key="`post_${meta.postId}`" @click="navigateTo(meta)">
                            <template #icon>
                                <loading-outlined v-if="loadingPost && loadingPost.postId === meta.postId" />
                                <number-outlined v-else/>
                            </template>
                            {{ meta.title }}
                        </a-menu-item>
                    </a-sub-menu>
                </a-menu>
            </a-spin>
        </a-layout-sider>
        <a-layout-content class="content">      
            <h1 class="header">
                {{ loadingPost ? loadingPost.title : (currentPost?.title || '') }}
            </h1>
            <a-divider orientation="right">{{ loadingPost ? formatDate(loadingPost.updatedAt) : (currentPost ? formatDate(currentPost.updatedAt) : '') }}</a-divider>
            <a-skeleton active :loading="loadingPost !== null">
                <article id="post" v-if="currentPost" v-html="md.render(currentPost.content)"></article>
            </a-skeleton>
        </a-layout-content>
        <menu-trigger :trigger="collapsed" @click="toggleMenu" />
    </section>
</template>

<style scoped>
#wrapper {
    width: 100%;
    display: flex;
}
.sider {
    min-height: 500px;
}
.sider.light {
    background-color: #fafafa;
}
.sider.dark {
    background-color: #1d1d1d;
}
.sider .pad {
    margin: 200px auto;
}
.menu {
    height: 100%;
    border-right: none;
}
.content {
    padding: 0 30px;
    min-height: 500px;
    user-select: text;
    overflow: hidden;
}
.content .header {
    font-size: 28px;
    letter-spacing: 0.5px;
    text-align: center;
    font-weight: normal;
}
</style>
