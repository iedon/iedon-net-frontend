export default {
    header: {
        home: '主頁',
        nodes: 'BGP',
        signIn: '登入',
        signOut: '登出',
        signOutConfirm: '您真的要登出嗎？',
    },
    packetHandler: {
        fetchException: '未能獲取數據。',
        errMsg400_BAD_REQUEST: '您的請求無效。\n檢視您的輸入格式，然後重試。',
        errMsg404: '抱歉，您請求的資源當前不可用。',
        errMsg405_METHOD_NOT_ALLOWED: '您的請求方法不被允許。',
        errMsg500_SERVER_ERROR: '抱歉，我們的伺服器遇到了一些問題。\n請重試或聯繫我們。',
        errMsg502_503: '抱歉，我們的服務不可用或正在維護中。\n請重試或聯繫我們。',
        err_UNAUTHORIZED: '您需要先登入才能訪問此資源。',
        err_ROUTER_NOT_AVAILABLE: '抱歉，您請求的路由器不可用。\n請重試或聯繫我們。',
        err_ROUTER_OPERATION_FAILED: '抱歉，配置連線時出現問題。\n請重試或聯繫我們。'
    },
    pages: {
        signIn: {
            step1: '查詢',
            step2: '選擇',
            step3: '驗證',
            step4: '歡迎',
            step1Introduction: '請確保您的物件已被 DN42 社區合併，可以從 WHOIS 數據庫中查詢。',
            asn: 'AS 號碼',
            pleaseInput: '請輸入或檢視',
            signIn: '登入',
            couldNotFindAuthMethod: '抱歉，我們無法從數據庫中查詢您的 AS 的登入方式。 \n可能的原因有：\n1. 您的物件尚未被合併和同步。或者，發生了一些錯誤。\n2. 我們無法從 admin-c 和 mntner 中找到有效的驗證條目訊息。\n3. 您的驗證方法不被我們的系統支援。\n請聯繫我們以幫助解決此問題，謝謝。',
            hi: '哈羅 ',
            signUp: '點按這里來了解「肆拾贰式分散網」',
            queryingSignInMethod: '正在查詢支援的登入方式...',
            authenticateWith: '以這個方法登入',
            useSitePassword: '使用您在這個站點的密碼。',
            continue: '向下一页移动',
            step2Introduction: '我們找到了下述您的 AS 可選的驗證方式。\n輕掃下述列表來檢視詳細訊息，併選擇一個您偏好的登入方式。',
            pleaseWait: '請稍等',
            errorOccurred: '抱歉，發生了一個錯誤。\n請聯繫我們以幫助改進這個問題。',
            step3Introduction: '請輸入挑戰訊息。\n如果您使用密碼驗證，請在下方輸入本站的密碼。\n如果您使用 PGP 密鑰驗證，請使用您的密鑰，以純文本明文簽署提示訊息中的消息並將它粘貼在下方。\n如果您使用 SSH 密鑰驗證方式，請先將它轉化為 PEM 格式，然後做和 PGP 驗證一樣的操作。',
            challengeHint: '輸入密碼，檢視電郵，或明文簽署(clear sign)',
            challengeText: '挑戰文本',
            challengeTextPlaceholder: '站點密碼，您收到的電郵中的驗證碼或經過格式包裝的簽名訊息',
            pgpPublicKey: 'PGP 公鑰',
            signInFailed: '登入失敗了',
            welcomeBack: '歡迎回來，',
            step4Introduction: '現在可以管理您已有的連線和設定新的對等連線了。',
            manageSessions: '管理我的對等連線',
            topPage: '進入主頁'
        },
        posts: {
            pleaseWait: '請稍等',
        },
        nodes: {
            search: '按 節點名字 或 IP 位址檢索...',
            nodes: 'BGP 網路節點',
            copied: '已拷貝詳細訊息',
            pleaseSignIn: '您需要先登入。',
            statusOpen: '可以連線。',
            statusOpenManuallyReview: '可以連線，手動審核。',
            statusClosed: '不再接受新連線。',
            statusFull: '不可互聯 (連線已滿)。',
            statusCapacity: '容量'
        },
        peering: {
            couldNotGetData: '未能讀取節點數據。',
            step1: '功能選定',
            step2: '介面內容',
            step3: '連線設定',
            step4: '完成連線',
            linkType: '介面種類',
            interface: '介面',
            bgpExtensions: 'BGP 擴展',
            openvpn: 'OpenVPN 隧道',
            wireguard: 'WireGuard 隧道',
            ipsec: 'IPSec 隧道',
            gre: 'GRE 隧道',
            direct: '直接使用乙太網',
            'mp-bgp': 'Multi-protocol BGP',
            'extended-nexthop': 'Extended Nexthop',
            step1Introduction: '這個節點支援以下特性。\n選擇一個或多個您想要啟用的功能。',
            step2Introduction: '這則訊息将帮助您設定介面。',
            useIpv4: '啟用 IPv4',
            useIpv6: '啟用 IPv6 ULA',
            useIpv6LinkLocal: '使用 IPv6 Link Local',
            endpoint: '隧道端點',
            credential: '隧道憑證或公鑰',
            mustEnableAtleastOneProtocol: '您必須至少啟用一種 IP 協定。',
            mustEnterTunnelInformation: '您必須輸入隧道訊息，包括端點和憑證。',
            inputValid: '您的訊息不正確。請檢視並重試。',
            back: '返回修改',
            backTop: '返回到所有節點頁',
            step3Introduction: '您的申請表。請檢視。',
            ipv4: 'DN42 IPv4',
            ipv6: 'DN42 IPv6',
            asn: '對端 ASN',
            ipv6LinkLocal: 'IPv6 Link Local',
            tunnelEndpointHint: '(可空) 您的隧道端點。格式: [主機名或 IP]:端口號',
            tunnelCredentialHint: '您的隧道機密或公鑰。',
            thankYou: '非常感謝',
            step4Introduction: '我們正在設定與您的連線。請稍後過來檢視您的連線狀態。',
            step4IntroductionReview: '這個連線需要人工審核和開通。我們將盡快處理您的請求。'
        },
        manage: {
            mySessions: '我的連線',
            myAccount: '我的帳戶',
            manageSessions: '管理連線',
            managePosts: '管理文章',
            manageConfig: '站點設定',
            manageNodes: '管理節點',
            settings: '設定',
            allSessions: '所有連線',
            session: {
                search: '按 ASN 或 IP 位址檢索...',
                node: '節點',
                type: '介面種類',
                status: '狀態',
                action: '動作',
                info: '訊息',
                newPeeringSession: '建立新的連線',
                statusCode: {
                    '-1': '等候審核',
                    '0': '停用',
                    '1': '開啟'
                },
                enable: '開啟',
                disable: '停用',
                remove: '移除',
                approve: '批准',
                areYouSure: '您確定嗎？',
                ok: '確認'
            },
            account: {
                setYourPassword: '設定您在這個站點的密碼',
                password: '密碼',
                confirmPassword: '確認密碼',
                setPassword: '設定密碼',
                successSetPassword: '您成功設定或消除了在這個站點的密碼。'
            },
            config: {
                changeConfig: '更改這個站點的設定',
                save: '套用',
                netAsn: '網路 ASN',
                netName: '網路名字',
                netDesc: '網路介紹',
                footerText: '底部訊息',
                maintenanceText: '檢修訊息'
            },
            posts: {
                title: '標題',
                category: '分類',
                updatedAt: '更新於',
                createdAt: '創建於',
                addOrEdit: '添加或修改文章',
                add: '添加文章',
                view: '檢視',
                edit: '修改',
                content: '正文',
                close: '關閉'
            },
            nodes: {
                sessionCapacity: '連線容量',
                openPeering: '開放連線',
                autoPeering: '自動連線',
                public: '公開 (可視)',
                location: '位置',
                description: '介紹',
                name: '名字',
                addOrEdit: '添加或修改節點',
                add: '添加節點',
                callbackUrl: '回呼 URL'
            }
        }
    }
}
