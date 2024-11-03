export default { 
  header: {
      home: '首頁',
      nodes: 'BGP',
      signIn: '登入',
      signOut: '登出',
      signOutConfirm: '您確定要登出嗎？',
  },
  packetHandler: {
      fetchException: '資料獲取失敗。',
      errMsg400_BAD_REQUEST: '您的請求無效。\n請檢查輸入格式後重試。',
      errMsg404: '抱歉，您請求的資源目前無法取得。',
      errMsg405_METHOD_NOT_ALLOWED: '您的請求方法不被允許。',
      errMsg500_SERVER_ERROR: '抱歉，伺服器遇到問題。\n請稍後再試，或隨時與我們聯絡。',
      errMsg502_503: '抱歉，服務暫時無法使用或正在維護中。\n請稍後再試，或隨時與我們聯絡。',
      err_UNAUTHORIZED: '您需要先登入才能訪問此資源。',
      err_ROUTER_NOT_AVAILABLE: '抱歉，您請求的路由器無法使用。\n請稍後再試，或隨時與我們聯絡。',
      err_ROUTER_OPERATION_FAILED: '抱歉，配置會話時發生錯誤。\n請稍後再試，或隨時與我們聯絡。'
  },
  pages: {
      signIn: {
          step1: '查詢',
          step2: '選擇',
          step3: '驗證',
          step4: '歡迎',
          step1Introduction: '請確保您的物件已由 DN42 社群合併，並可在 WHOIS 資料庫中查詢到。',
          asn: 'AS 號碼',
          pleaseInput: '請輸入或檢查',
          signIn: '登入',
          couldNotFindAuthMethod: '抱歉，無法從您的AS中檢索到可能的認證方式。\n可能的原因有：\n1. 您的物件尚未合併或同步，或發生錯誤。\n2. 找不到 admin-c 和 mntner 的有效條目。\n3. 您的認證方式不受系統支援。\n如需協助，請隨時與我們聯絡。謝謝。',
          hi: '您好，',
          signUp: '點此了解更多有關 DN42 的資訊',
          queryingSignInMethod: '正在查詢登入方式...',
          authenticateWith: '認證方式',
          useSitePassword: '使用本網站的密碼。',
          continue: '繼續',
          step2Introduction: '我們從您的 AS 中找到以下支援的認證方法。\n點擊下方方法查看詳情，選擇您想繼續使用的方式。',
          errorOccurred: '抱歉，發生錯誤。\n請重試或隨時與我們聯絡。',
          pleaseWait: '請稍候',
          step3Introduction: '請輸入驗證文字。\n若使用密碼登入，請輸入您的密碼。\n若使用 PGP 密鑰登入，請貼上您的完整公開密鑰，並對挑戰訊息進行簽名，然後將輸出與具有相同指紋的公開密鑰貼到此處。\n若使用 SSH 密鑰登入，請連接我們的 SSH 伺服器以驗證您的密鑰，並貼上挑戰文字。參考下方指令。',
          challengeHint: '密碼，SSH / 電子郵件中的驗證碼，PGP 簽名',
          challengeText: '驗證文字',
          challengeTextPlaceholder: '站點密碼、SSH / 電子郵件驗證碼或明文簽名',
          pgpPublicKey: 'PGP 公開密鑰',
          signInFailed: '登入失敗',
          welcomeBack: '歡迎回來，',
          step4Introduction: '您現在可以管理會話並配置新的對等連線。',
          manageSessions: '管理對等會話',
          topPage: '首頁',
          authMethods: [
            '使用密碼',
            '使用 PGP 密鑰清簽',
            '驗證您的 SSH 密鑰',
            '發送驗證文字至電子郵件'
          ],
          authMethodsTiny: [
            '密碼認證',
            'PGP 認證',
            'SSH 認證',
            '電子郵件認證'
          ]
      },
      posts: {
          pleaseWait: '請稍候',
      },
      nodes: {
          search: '按名稱或 IP 地址搜尋...',
          nodes: 'BGP 網路節點',
          copied: '詳細信息已複製',
          pleaseSignIn: '請先登入。',
          statusOpen: '開放中',
          statusOpenManuallyReview: '開放中 (需人工審核)',
          statusClosed: '新用戶關閉',
          statusFull: '滿員已關閉',
          statusCapacity: '容量'
      },
      peering: {
          couldNotGetData: '無法獲取節點資料。',
          step1: '功能',
          step2: '介面',
          step3: '設置',
          step4: '完成',
          linkType: '連線類型',
          interface: '介面',
          bgpExtensions: 'BGP 擴展',
          openvpn: 'OpenVPN 隧道',
          wireguard: 'WireGuard 隧道',
          ipsec: 'IPSec 隧道',
          gre: 'GRE 隧道',
          direct: '直接乙太網',
          'mp-bgp': '多協議 BGP',
          'extended-nexthop': '擴展下一跳',
          step1Introduction: '此節點支援以下功能。\n請選擇您想使用的功能。',
          step2Introduction: '在配置介面時會有所幫助。',
          useIpv4: '啟用 IPv4',
          useIpv6: '使用 IPv6 ULA',
          useIpv6LinkLocal: '使用 IPv6 本地鏈路',
          endpoint: '端點',
          credential: '公共密鑰',
          mustEnableAtleastOneProtocol: '必須至少啟用一種 IP 協議。',
          mustEnterTunnelInformation: '必須輸入隧道資訊，包括端點和憑證。',
          inputValid: '您的資訊無效。請檢查後重試。',
          back: '返回修改',
          backTop: '返回所有節點頁面',
          step3Introduction: '您的對等連線申請，請確認。',
          ipv4: 'DN42 IPv4',
          ipv6: 'DN42 IPv6',
          asn: '對等ASN',
          ipv6LinkLocal: 'IPv6 鏈路本地',
          tunnelEndpointHint: '(可選) 您的隧道端點。格式：主機名或 IP:端口',
          tunnelCredentialHint: '您的隧道憑證或公共密鑰。',
          thankYou: '謝謝您',
          step4Introduction: '我們正在配置您的會話。請稍後查看對等狀態。',
          step4IntroductionReview: '此會話需要人工審核。我們將盡快處理您的請求。',
      },
      manage: {
          mySessions: '我的會話',
          myAccount: '我的帳戶',
          manageSessions: '管理會話',
          managePosts: '管理帖子',
          manageConfig: '網站設定',
          manageNodes: '管理節點',
          settings: '設定',
          allSessions: '所有會話',
          session: {
              search: '按 ASN 或 IP 地址搜尋...',
              node: '節點',
              type: '介面類型',
              status: '狀態',
              action: '操作',
              info: '資訊',
              newPeeringSession: '新建對等會話',
              statusCode: {
                  '-1': '待審核',
                  '0': '已禁用',
                  '1': '已啟用'
              },
              enable: '啟用',
              disable: '禁用',
              remove: '刪除',
              approve: '批准',
              areYouSure: '您確定嗎？',
              ok: '確定'
          },
          account: {
              setYourPassword: '設置此網站的密碼',
              password: '密碼',
              confirmPassword: '確認密碼',
              setPassword: '設置密碼',
              successSetPassword: '您已成功設置或清除密碼。'
          },
          config: {
              changeConfig: '更改此網站的配置',
              save: '保存',
              netAsn: '管理 ASN',
              netName: '網路名稱',
              netDesc: '網路描述',
              footerText: '頁腳文字',
              maintenanceText: '維護文字'
          },
          posts: {
              title: '標題',
              category: '分類',
              updatedAt: '更新時間',
              createdAt: '創建時間',
              addOrEdit: '添加或編輯帖子',
              add: '添加帖子',
              view: '查看',
              edit: '編輯',
              content: '內容',
              close: '關閉'
          },
          nodes: {
              sessionCapacity: '會話容量',
              openPeering: '開放對等連線',
              autoPeering: '自動對等連線',
              public: '公開 (可見性)',
              location: '位置',
              description: '描述',
              name: '名稱',
              addOrEdit: '添加或編輯節點',
              add: '添加節點',
              callbackUrl: '回調 URL'
          }
      }
  }
}
