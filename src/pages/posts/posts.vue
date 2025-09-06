<script setup lang="ts">
import { onMounted, Ref, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { makeRequest, PostMetadaResponse, PostMetadata, PostResponse } from '../../common/packetHandler'
import { postCache, formatDate, registerPageTitle } from '../../common/helper'
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
        registerPageTitle(post.title)
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
                registerPageTitle(data.title)
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
        <!-- Hero Section -->
        <section class="hero-section">
            <div class="hero-container">
                <div class="hero-content">
                    <div class="hero-text">
                        <h1 class="hero-title">
                            {{ loadingPost ? loadingPost.title : (currentPost?.title || '') }}
                        </h1>
                        <p class="hero-subtitle">
                            {{ loadingPost ? formatDate(loadingPost.updatedAt) : (currentPost ? formatDate(currentPost.updatedAt) : '') }}
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Content Section -->
        <section class="content-section">
            <div class="content-container">
                <a-skeleton active :loading="loadingPost !== null">
                    <article id="post" v-if="currentPost" v-html="md.render(currentPost.content)"></article>
                </a-skeleton>
            </div>
        </section>
    </div>
</template>

<style scoped>
.posts-page {
    width: 100%;
    min-height: 100vh;
}

/* Hero Section */
.hero-section {
    padding: 4rem 0 3rem;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    position: relative;
    overflow: hidden;
}

.dark .hero-section {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%);
}

.hero-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.hero-content {
    text-align: center;
}

.hero-title {
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 1.5rem 0;
    line-height: 1.2;
    color: #1a1a1a;
    word-wrap: break-word;
}

.dark .hero-title {
    color: #ffffff;
}

.hero-subtitle {
    font-size: 1rem;
    color: #666;
    margin: 0;
    line-height: 1.6;
    font-weight: 500;
}

.dark .hero-subtitle {
    color: #aaa;
}

/* Content Section */
.content-section {
    background: #fff;
}

.dark .content-section {
    background: #1a1a1a;
}

.content-container {
    max-width: 1280px;
    margin: 0 auto;
}

#post {
    line-height: 1.8;
    font-size: 16px;
    color: #333;
    padding: 2rem;
    user-select: text;
}

.dark #post {
    color: #d1d5db;
}

/* Responsive Design */
@media (max-width: 768px) {
    .hero-section {
        padding: 2rem 0;
    }
    
    .hero-container,
    .content-container {
        padding: 0 1rem;
    }
    
    .hero-title {
        font-size: 1.5rem;
    }
    
    .hero-subtitle {
        font-size: 1rem;
    }
    
    #post {
        padding: 2rem 1.5rem;
        border-radius: 8px;
        margin: 0;
    }
}

@media (max-width: 480px) {
    .hero-container,
    .content-container {
        padding: 0 0.5rem;
    }
    
    .hero-title {
        font-size: 2rem;
    }
    
    .hero-subtitle {
        font-size: 1rem;
    }
    
    #post {
        padding: 1.5rem 1rem;
    }
}
</style>
