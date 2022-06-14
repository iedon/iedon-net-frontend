export default {
    header: {
        home: '首页',
        nodes: '网络节点',
        privacy: '隐私声明',
        privacyPolicyContent: '此站点需要 JavaScript 和 localStorage 技术才能工作。\n我们不收集任何个人信息。\n但我们可能会记录您的 IP 地址、会话状态以进行调试。',
        signIn: '登录',
        signOut: '退出登录',
        signOutConfirm: '您真的要退出登录吗？',
    },
    packetHandler: {
        fetchException: '未能获取数据。',
        errMsg400_BAD_REQUEST: '您的请求无效。\n检查您的输入格式，然后重试。',
        errMsg404: '抱歉，您请求的资源当前不可用。',
        errMsg405_METHOD_NOT_ALLOWED: '您的请求方法不被允许。',
        errMsg500_SERVER_ERROR: '抱歉，我们的服务器遇到了一些问题。\n请重试或联系我们。',
        errMsg502_503: '抱歉，我们的服务不可用或正在维护中。\n请重试或联系我们。',
        err_UNAUTHORIZED: '您需要先登录才能访问此资源。',
        err_ROUTER_NOT_AVAILABLE: '抱歉，您请求的路由器不可用。\n请重试或联系我们。',
        err_ROUTER_OPERATION_FAILED: '抱歉，配置会话时出现问题。\n请重试或联系我们。'
    },
    pages: {
        signIn: {
            step1: '查询',
            step2: '选择',
            step3: '验证',
            step4: '欢迎',
            step1Introduction: '请确保您的对象已经被 DN42 社区合并并且能够被从 WHOIS 数据库中查询。',
            asn: 'AS 号码',
            pleaseInput: '请输入或检查',
            signIn: '登录',
            couldNotFindAuthMethod: '抱歉，我们无法从数据库中查询您的 AS 的登录方式。\n可能的原因有：\n1. 您的对象尚未被合并和同步。或者，发生了一些错误。\n2. 我们无法从 admin-c 和 mntner 中找到有效的验证条目信息。\n3. 您的验证方法不被我们的系统支持。\n请联系我们以帮助解决此问题，谢谢。',
            hi: '你好 ',
            signUp: '点击这里以了解「四十二式分布网」',
            queryingSignInMethod: '正在查询支持的登录方式...',
            authenticateWith: '以此方法登录',
            useSitePassword: '使用您在本站点的密码。',
            continue: '向下一页移动',
            step2Introduction: '我们找到了下述您的 AS 可选的验证方式。\n轻扫下述列表来查看详细信息，并选择一个您偏好的登录方式。',
            pleaseWait: '请稍候',
            errorOccurred: '抱歉，发生了一个错误。\n请联系我们以帮助改进这个问题。',
            step3Introduction: '请输入挑战信息。\n如果您使用密码验证，请在下方输入本站的密码。\n如果您使用 PGP 密钥验证，请使用您的密钥, 以纯文本明文方式签署提示信息中的消息并将它粘贴在下方。\n如果您使用 SSH 密钥验证方式，请先将它转化为 PEM 格式，然后做和 PGP 验证一样的操作。',
            challengeHint: '输入密码，查收邮件，或明文签署(clear sign)',
            challengeText: '挑战文本',
            challengeTextPlaceholder: '站点密码，您收到的邮件中的验证码或经过格式包装的签名信息',
            pgpPublicKey: 'PGP 公钥',
            signInFailed: '登录失败',
            welcomeBack: '欢迎回来，',
            step4Introduction: '现在可以管理您的互联会话和配置新的对等连接了。',
            manageSessions: '管理我的互联会话',
            topPage: '进入首页'
        },
        posts: {
            pleaseWait: '请稍候',
        },
        nodes: {
            nodes: '网络节点',
            copied: '已复制详细信息',
            pleaseSignIn: '请先登录。',
            statusOpen: '可以互联。',
            statusOpenManuallyReview: '可以互联，人工审核。',
            statusClosed: '不再接受新连接。',
            statusFull: '不可互联 (连接已满)。',
            statusCapacity: '容量'
        },
        peering: {
            couldNotGetData: '未能读取节点数据。',
            step1: '功能选定',
            step2: '接口属性',
            step3: '会话设置',
            step4: '完成互联',
            linkType: '链路类型',
            interface: '接口',
            bgpExtensions: 'BGP 扩展',
            openvpn: 'OpenVPN 隧道',
            wireguard: 'WireGuard 隧道',
            ipsec: 'IPSec 隧道',
            gre: 'GRE 隧道',
            direct: '直接使用以太网',
            'mp-bgp': 'Multi-protocol BGP',
            'extended-nexthop': 'Extended Nexthop',
            step1Introduction: '此节点支持以下特性。\n选择一个或多个您想要启用的功能。',
            step2Introduction: '此信息将帮助您设置接口。',
            useIpv4: '使能 IPv4',
            useIpv6: '使能 IPv6 ULA',
            useIpv6LinkLocal: '使用 IPv6 Link Local',
            endpoint: '隧道端点',
            credential: '隧道机密或公钥',
            mustEnableAtleastOneProtocol: '您必须至少启用一种 IP 协议。',
            mustEnterTunnelInformation: '您必须输入隧道信息，包括端点和机密。',
            inputValid: '您的信息不正确。请检查并重试。',
            back: '返回修改',
            step3Introduction: '您的申请表。请检查。',
            ipv4: 'DN42 IPv4',
            ipv6: 'DN42 IPv6',
            asn: '对端 ASN',
            ipv6LinkLocal: 'IPv6 Link Local',
            tunnelEndpointHint: '您的隧道端点。格式: [主机名或 IP]:端口号',
            tunnelCredentialHint: '您的隧道机密或公钥。',
            thankYou: '非常感谢',
            step4Introduction: '我们正在设置您的会话。请稍后过来检查您的互联状态。',
            step4IntroductionReview: '此会话需要人工审核和开通。我们将尽快处理您的请求。'
        },
        manage: {
            mySessions: '我的会话',
            myAccount: '我的帐户',
            manageSessions: '管理会话',
            managePosts: '管理文章',
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
                newPeeringSession: '新建互联会话',
                statusCode: {
                    '-1': '等候审核',
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
                setYourPassword: '设置您在此站点的密码',
                password: '密码',
                confirmPassword: '确认密码',
                setPassword: '设置密码',
                successSetPassword: '您成功设置或清除了在此站点的密码。'
            },
            config: {
                changeConfig: '改变此站点的设置',
                save: '保存',
                netAsn: '管理员 ASN',
                netName: '网络名称',
                netDesc: '网络描述',
                footerText: '尾部文本',
                maintenanceText: '维护文本'
            },
            posts: {
                title: '标题',
                category: '分类',
                updatedAt: '更新于',
                createdAt: '创建于',
                addOrEdit: '添加或编辑文章',
                add: '添加文章',
                view: '查看',
                edit: '编辑',
                content: '正文',
                close: '关闭'
            },
            nodes: {
                sessionCapacity: '会话容量',
                openPeering: '开放互联',
                autoPeering: '自动互联',
                public: '公开 (可见)',
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
