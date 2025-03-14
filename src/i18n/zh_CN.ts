export default {
  header: {
    home: '首页',
    nodes: 'Peering',
    signIn: '登录',
    signOut: '登出',
    signOutConfirm: '您确定要登出吗？',
  },
  notification: {
    error: '错误',
    info: '信息',
    warning: '警告',
    success: '成功',
    maintenance: '维护信息'
  },
  packetHandler: {
    fetchException: '数据获取失败。',
    errMsg400_BAD_REQUEST: '您的请求无效。\n请检查输入格式并重试。',
    errMsg404: '抱歉，您请求的资源目前不可用。',
    errMsg405_METHOD_NOT_ALLOWED: '您的请求方法不被允许。',
    errMsg500_SERVER_ERROR: '抱歉，服务器遇到问题。\n请稍后再试，或随时联系我们。',
    errMsg502_503: '抱歉，服务暂不可用或正在维护中。\n请稍后再试，或随时联系我们。',
    err_UNAUTHORIZED: '访问此资源前需要先登录。',
    err_ROUTER_NOT_AVAILABLE: '抱歉，您请求的路由器不可用。\n请稍后再试，或随时联系我们。',
    err_ROUTER_OPERATION_FAILED: '抱歉，配置会话时发生错误。\n请稍后再试，或随时联系我们。'
  },
  pages: {
    signIn: {
      step1: '查询',
      step2: '选择',
      step3: '验证',
      step4: '欢迎',
      step1Introduction: '请确保您的对象已被 DN42 社区合并，并可在 WHOIS 数据库中查询到。',
      asn: 'AS 编号',
      pleaseInput: '请输入或检查',
      signIn: '登录',
      couldNotFindAuthMethod: '抱歉，无法从您的 AS 检索到可能的认证方法。\n可能原因：\n1. 您的对象未合并或同步，或发生了错误。\n2. 未找到 admin-c 和 mntner 的有效条目。\n3. 您的认证方法不被系统支持。\n如需帮助，请随时联系我们。谢谢。',
      hi: '您好，',
      youCanAlso: '您还可以',
      authWithKioubit: '通过 Kioubit.dn42 登录',
      signUp: '点击这里了解更多关于 DN42 的信息',
      queryingSignInMethod: '正在查询登录方法...',
      authenticateWith: '认证方式',
      useSitePassword: '使用此网站的密码。',
      continue: '继续',
      step2Introduction: '我们从您的 AS 中找到以下支持的认证方法。\n点击下方方法查看详情，选择您想继续的方式。',
      errorOccurred: '抱歉，发生了错误。\n请重试，或随时联系我们。',
      pleaseWait: '请稍候',
      step3Introduction: '请输入验证文本。\n如果使用密码登录，请输入您的密码。\n如果使用 PGP 密钥登录，请粘贴您的与选择认证方式一致的完整公开密钥，对挑战消息进行签名，然后将输出的签署内容粘贴至此。\n若使用 SSH 密钥登录，请连接我们的 SSH 服务器以验证您的密钥，并粘贴挑战文本。参考以下命令。',
      challengeHint: '密码，接收电子邮件，PGP 签名或 SSH 连接至',
      challengeText: '验证文本',
      challengeTextPlaceholder: '站点密码、SSH / 电子邮件认证码或 PGP 明文签名',
      pgpPublicKey: 'PGP 公开密钥',
      signInFailed: '登录失败',
      welcomeBack: '欢迎回来，',
      step4Introduction: '您现在可以管理会话并配置新的对等连接。',
      manageSessions: '管理对等会话',
      topPage: '首页',
      authMethods: [
        '使用密码',
        '使用 PGP 密钥明文签署',
        '验证您的 SSH 密钥',
        '邮件发送验证文本'
      ],
      authMethodsTiny: [
        '密码认证',
        'PGP 认证',
        'SSH 认证',
        '邮件认证'
      ]
    },
    posts: {
      pleaseWait: '请稍候',
    },
    nodes: {
      search: '按名称或 IP 地址搜索...',
      nodes: 'BGP 网络节点',
      copied: '详情已复制',
      pleaseSignIn: '请先登录。',
      statusOpen: '开放中',
      statusOpenManuallyReview: '开放中 (需人工审核)',
      statusClosed: '新用户关闭',
      statusFull: '满员已关闭',
      statusCapacity: '容量'
    },
    peering: {
      couldNotGetData: '无法获取节点数据。',
      step1: '功能',
      step2: '接口',
      step3: '设置',
      step4: '完成',
      linkType: '连接类型',
      interface: '接口',
      bgpExtensions: 'BGP 扩展',
      openvpn: 'OpenVPN 隧道',
      wireguard: 'WireGuard 隧道',
      ipsec: 'IPSec 隧道',
      gre: 'GRE 隧道',
      direct: '直接以太网',
      'mp-bgp': '多协议 BGP',
      'extended-nexthop': '扩展下一跳',
      step1Introduction: '此节点支持以下功能。\n请选择您想使用的功能。',
      step2Introduction: '在配置接口时会有所帮助。',
      useIpv4: '启用 IPv4',
      useIpv6: '使用 IPv6 ULA',
      useIpv6LinkLocal: '使用 IPv6 本地链路',
      endpoint: '端点',
      credential: '公共密钥',
      mustEnableAtleastOneProtocol: '必须至少启用一种 IP 协议。',
      mustEnterTunnelInformation: '必须输入隧道信息，包括端点和凭证。',
      inputValid: '您的信息无效。请检查并重试。',
      back: '返回修改',
      backTop: '返回所有节点页面',
      step3Introduction: '您的对等连接申请，请确认。',
      ipv4: 'DN42 IPv4',
      ipv6: 'DN42 IPv6',
      asn: '对等 ASN',
      ipv6LinkLocal: 'IPv6 链路本地',
      tunnelEndpointHint: '(可选) 您的隧道端点。格式：主机名或 IP:端口',
      tunnelCredentialHint: '您的隧道凭证或公共密钥。',
      thankYou: '感谢您',
      step4Introduction: '我们正在配置您的会话。请稍后查看对等状态。',
      step4IntroductionReview: '此会话需要人工审核。我们将尽快处理您的请求。',
    },
    manage: {
      mySessions: '我的会话',
      myAccount: '我的账户',
      manageSessions: '管理会话',
      managePosts: '管理帖子',
      manageConfig: '站点设置',
      manageNodes: '管理节点',
      settings: '设置',
      allSessions: '所有会话',
      session: {
        search: '按 ASN 或 IP 地址搜索...',
        node: '节点',
        type: '接口类型',
        status: '状态',
        action: '操作',
        info: '信息',
        newPeeringSession: '新建对等会话',
        statusCode: {
          '-1': '待审核',
          '0': '已禁用',
          '1': '已启用'
        },
        enable: '启用',
        disable: '禁用',
        remove: '删除',
        approve: '批准',
        areYouSure: '您确定吗？',
        ok: '确定'
      },
      account: {
        setYourPassword: '设置此站点的密码',
        password: '密码',
        confirmPassword: '确认密码',
        setPassword: '设置密码',
        successSetPassword: '您已成功设置或清除密码。'
      },
      config: {
        changeConfig: '更改此站点的配置',
        save: '保存',
        netAsn: '管理员 ASN',
        netName: '网络名称',
        netDesc: '网络描述',
        footerText: '页脚文本',
        maintenanceText: '维护文本'
      },
      posts: {
        title: '标题',
        category: '分类',
        updatedAt: '更新时间',
        createdAt: '创建时间',
        addOrEdit: '添加或编辑帖子',
        add: '添加帖子',
        view: '查看',
        edit: '编辑',
        content: '内容',
        close: '关闭'
      },
      nodes: {
        sessionCapacity: '会话容量',
        openPeering: '开放对等连接',
        autoPeering: '自动对等连接',
        public: '公开 (可见性)',
        location: '位置',
        description: '描述',
        name: '名称',
        addOrEdit: '添加或编辑节点',
        add: '添加节点',
        callbackUrl: '回调 URL'
      }
    }
  }
}
