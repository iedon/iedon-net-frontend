<script setup lang="ts">
import { onMounted, Ref, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import {
  ApiOutlined,
  ReloadOutlined,
  GlobalOutlined,
} from "@ant-design/icons-vue";
import { isAdmin, loggedIn, sessionMgmtSearchText } from "../../common/helper";
import {
  makeRequest,
  RouterMetadata,
  RoutersResponse,
  SessionMetadata,
  SessionsResponse,
  SessionStatus,
} from "../../common/packetHandler";
import SessionTable from "../../components/SessionTable.vue";
import { showMyConnectivityInMap } from "../../common/helper";

const t = useI18n().t;
const router = useRouter();
const loading = ref(false);

interface Session extends SessionMetadata {
  routerJoined?: RouterMetadata;
}

const sessions: Ref<Session[]> = ref([]);
const routers: Ref<RouterMetadata[]> = ref([]);
const searchKeywords = sessionMgmtSearchText;

const fetchSessions = async () => {
  try {
    loading.value = true;

    let resp = await makeRequest(t, "/list/routers");
    if (resp.success && resp.response) {
      const data = resp.response as RoutersResponse;
      if (data && Array.isArray(data.routers)) {
        routers.value = data.routers.sort((a, b) =>
          ("" + a.name).localeCompare(b.name)
        );
        localStorage.setItem("routers", JSON.stringify(routers.value));
      }
    }

    resp = await makeRequest(t, "/session", {
      action: "enum",
    });
    if (resp.success && resp.response) {
      const data = resp.response as SessionsResponse;
      const newData: Session[] = [];
      if (data && Array.isArray(data.sessions)) {
        data.sessions.forEach((s) =>
          newData.push({
            ...s,
            routerJoined: routers.value.find((r) => r.uuid === s.router),
          })
        );
        sessions.value = newData;
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  if (!loggedIn.value) {
    message.info(t("pages.nodes.pleaseSignIn"));
    router.replace({ path: "/signin" });
    return;
  }
  await fetchSessions();
});

const simpleActionHandler = async (
  session: Session,
  action: "delete" | "enable" | "disable"
) => {
  try {
    loading.value = true;

    await makeRequest(t, "/session", {
      action,
      router: session.router,
      session: session.uuid,
    });
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
    fetchSessions();
  }
};

const handleEnable = (session: Session) =>
  simpleActionHandler(session, "enable");
const handleDisable = (session: Session) =>
  simpleActionHandler(session, "disable");
const handleRemove = (session: Session) =>
  simpleActionHandler(session, "delete");

const handleViewMetrics = (session: Session, event: MouseEvent) => {
  event.stopPropagation();
  if (
    session.status === SessionStatus.QUEUED_FOR_DELETE ||
    (session.status === SessionStatus.PENDING_APPROVAL && !isAdmin.value)
  ) {
    message.error(t(`pages.manage.session.statusCode['${session.status}']`));
    return;
  }
  router.push({
    path: `/manage/metrics/${session.router}/${session.uuid}`,
  });
};

const handleEdit = (session: Session) => {
  router.push({
    path: `/nodes/${session.router}/edit/${session.uuid}`,
  });
};

const redirectToNodes = () => {
  router.push({ path: "/nodes" });
};
</script>

<template>
  <div class="buttons">
    <a-button @click="redirectToNodes">
      <template #icon>
        <api-outlined />
      </template>
      {{ t("pages.manage.session.newPeeringSession") }}
    </a-button>
    <a-button @click="showMyConnectivityInMap">
      <template #icon>
        <global-outlined />
      </template>
      {{ t("pages.manage.session.showMyConnectivityInMap") }}
    </a-button>
    <a-button @click="fetchSessions" :loading="loading" class="refresh-button">
      <template #icon>
        <reload-outlined />
      </template>
      {{ t("pages.metrics.refresh") }}
    </a-button>
    <a-input-search
      v-model:value="searchKeywords"
      :placeholder="t('pages.manage.session.search')"
      class="searchBox"
      enter-button
    />
  </div>
  <session-table
    :sessions="sessions"
    :loading="loading"
    :show-asn="false"
    :show-actions="true"
    :is-admin-mode="false"
    :search-keywords="searchKeywords"
    @view-metrics="handleViewMetrics"
    @enable="handleEnable"
    @disable="handleDisable"
    @remove="handleRemove"
    @edit="handleEdit"
  />
</template>

<style scoped>
.buttons {
  margin: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.refresh-button {
  margin-right: auto;
}

.searchBox {
  max-width: 500px;
  min-width: 150px;
}
</style>
