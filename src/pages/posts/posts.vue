<script setup lang="ts">
import { onMounted, Ref, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { makeRequest, PostMetadaResponse, PostMetadata, PostResponse } from '../../common/packetHandler'
import { postCache, formatDate } from '../../common/helper'
import './post.css'

//@ts-ignore
import markdown_it from 'markdown-it'
//@ts-ignore
import mila from 'markdown-it-link-attributes'

const t = useI18n().t
const router = useRouter()
const desiredPostId = ref<string | null>(router.currentRoute.value.params.id as string || null)

const md = new markdown_it({
    html: true
})
md.use(mila, {
    attrs: {
        target: "_blank"
    },
})

const loading = ref(false)
const currentPost: Ref<PostResponse | null> = ref(null)
const postMetadata: Ref<{ [index: string]: PostMetadata[] }> = ref({})
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

        const resp = await makeRequest(t, `/list/post/${post.postId}`)
        if (resp.success && resp.response) {
            const data = resp.response as PostResponse
            if (data) {
                currentPost.value = data
                postCache.set(`post_${post.postId}`, currentPost.value)
            }
        }

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
        let foundDesiredPost = false
        for (const category in postMetadata.value) {
            if (desiredPostId.value !== null) {
                const desiredPost = postMetadata.value[category].find(c => c.postId === Number(desiredPostId.value))
                if (desiredPost) {
                    foundDesiredPost = true
                    await fetchPost(desiredPost)
                    break
                }
                continue
            }
        }
        if (!foundDesiredPost) {
            // If no specific post is requested, load the first available post
            for (const category in postMetadata.value) {
                await fetchPost(postMetadata.value[category][0])
                break
            }
        }
    } catch (error) {
        console.error(error)
    }
}

const fetchPosts = async () => {
    try {
        loading.value = true

        const resp = await makeRequest(t, '/list/posts')
        if (resp.success && resp.response) {
            const data = resp.response as PostMetadaResponse
            if (Array.isArray(data.posts)) {
                localStorage.setItem('posts', JSON.stringify(data.posts))
                await preprocessPostMetadata(data.posts)
            }
        }
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
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

// Function to load a specific post by ID
const loadPostById = async (postId: string | null) => {
    if (!postId) return
    
    // Find the post in the metadata
    for (const category in postMetadata.value) {
        const post = postMetadata.value[category].find(p => p.postId === Number(postId))
        if (post) {
            await fetchPost(post)
            return
        }
    }
}

// Watch for route parameter changes
watch(() => router.currentRoute.value.params.id, async (newPostId) => {
    const postId = newPostId as string || null
    desiredPostId.value = postId
    
    if (postId && Object.keys(postMetadata.value).length > 0) {
        await loadPostById(postId)
    }
})
</script>

<template>
    <div class="posts-page">
        <div class="content">
            <h1 class="header">
                {{ loadingPost ? loadingPost.title : (currentPost?.title || '') }}
            </h1>
            <a-divider orientation="right">
                {{ loadingPost ? formatDate(loadingPost.updatedAt) : (currentPost ? formatDate(currentPost.updatedAt) : '') }}
            </a-divider>
            <a-skeleton active :loading="loadingPost !== null">
                <article id="post" v-if="currentPost" v-html="md.render(currentPost.content)"></article>
            </a-skeleton>
        </div>
    </div>
</template>

<style scoped>
.posts-page {
    width: 100%;
    min-height: 100vh;
    background: #f5f5f5;
    padding: 20px;
}

.dark .posts-page {
    background: #0f0f0f;
}

.content {
    background-color: #fff;
    padding: 40px;
    user-select: text;
    border-radius: 8px;
}

.dark .content {
    background: #1a1a1a;
}

.header {
    font-size: 32px;
    letter-spacing: 0.5px;
    text-align: center;
    font-weight: 600;
    margin-bottom: 20px;
    color: #1a1a1a;
    margin-top: 0px;
}

.dark .header {
    color: #e2e8f0;
}

#post {
    line-height: 1.8;
    font-size: 16px;
    color: #333;
}

.dark #post {
    color: #d1d5db;
}

/* Responsive Design */
@media (max-width: 768px) {
    .posts-page {
        padding: 12px;
    }
    
    .content {
        padding: 24px 20px;
        border-radius: 8px;
    }
    
    .header {
        font-size: 24px;
    }
}

@media (max-width: 480px) {
    .posts-page {
        padding: 8px;
    }
    
    .content {
        padding: 20px 16px;
    }
    
    .header {
        font-size: 24px;
    }
}
</style>
