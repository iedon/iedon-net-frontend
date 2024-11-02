export default {
  header: {
    home: 'ホーム',
    nodes: 'BGP',
    signIn: 'ログイン',
    signOut: 'ログアウト',
    signOutConfirm: '本当にログアウトしますか？',
  },
  packetHandler: {
    fetchException: 'データの取得に失敗しました。',
    errMsg400_BAD_REQUEST: 'リクエストが無効です。\n入力形式を確認してもう一度お試しください。',
    errMsg404: '申し訳ありませんが、お探しのリソースは現在利用できません。',
    errMsg405_METHOD_NOT_ALLOWED: 'リクエスト方法は許可されていません。',
    errMsg500_SERVER_ERROR: '申し訳ありませんが、サーバーで問題が発生しました。\nもう一度お試しいただくか、お気軽にご連絡ください。',
    errMsg502_503: '申し訳ありませんが、サービスは利用できないかメンテナンス中です。\nもう一度お試しいただくか、お気軽にご連絡ください。',
    err_UNAUTHORIZED: 'このリソースにアクセスするにはログインが必要です。',
    err_ROUTER_NOT_AVAILABLE: '申し訳ありませんが、ご指定のルーターは利用できません。\nもう一度お試しいただくか、お気軽にご連絡ください。',
    err_ROUTER_OPERATION_FAILED: '申し訳ありませんが、セッションの設定中にエラーが発生しました。\nもう一度お試しいただくか、お気軽にご連絡ください。'
  },
  pages: {
    signIn: {
      step1: 'クエリ',
      step2: '選択',
      step3: 'チャレンジ',
      step4: 'ようこそ',
      step1Introduction: 'DN42コミュニティによってオブジェクトが既にマージされ、WHOISデータベースでクエリ可能であることを確認してください。',
      asn: 'AS番号',
      pleaseInput: '入力または確認してください',
      signIn: 'ログイン',
      couldNotFindAuthMethod: '申し訳ありませんが、ASから利用可能な認証方法を取得できませんでした。\n考えられる理由:\n1. オブジェクトがマージおよび同期されていない、またはエラーが発生しました。\n2. admin-cまたはmntnerに有効なエントリが見つかりませんでした。\n3. 使用可能な認証方法が当システムでサポートされていません。\n詳しいサポートが必要な場合は、お気軽にお問い合わせください。ありがとうございます。',
      hi: 'こんにちは、',
      signUp: 'DN42についてさらに詳しく知るにはこちらをクリック',
      queryingSignInMethod: 'サインイン方法を取得中...',
      authenticateWith: '認証方法',
      useSitePassword: 'このサイトのパスワードを使用します。',
      continue: '続ける',
      step2Introduction: 'ASから以下のサポートされている認証方法が見つかりました。\n詳細を表示するには、下記の方法をタップしてください。\n続行する方法を選んでください。',
      errorOccurred: '申し訳ありませんが、エラーが発生しました。\nもう一度お試しいただくか、お気軽にご連絡ください。',
      pleaseWait: 'お待ちください',
      step3Introduction: 'チャレンジテキストを入力してください。\nパスワードでサインインする場合は、サイトのパスワードを入力してください。\nPGPキーでサインインする場合、完全な公開鍵を貼り付け、クリアサインモードでチャレンジメッセージをテキストアーマードで署名し、出力と公開鍵を同じ指紋でここに貼り付けてください。\nSSHキーでサインインする場合は、SSHサーバーに接続してキーを検証し、チャレンジテキストを貼り付けてください。下記のコマンドも参照できます。',
      challengeHint: 'パスワード、メールの認証コード、PGP署名、または接続',
      challengeText: 'チャレンジテキスト',
      challengeTextPlaceholder: 'サイトのパスワード、SSH / メールの認証コード、またはPEM形式の署名済みメッセージ（アーマード）',
      pgpPublicKey: 'PGP公開鍵',
      signInFailed: 'ログインに失敗しました',
      welcomeBack: 'お帰りなさい、',
      step4Introduction: 'セッションを管理し、新しいピアリングを設定できます。',
      manageSessions: 'ピアリングセッションを管理する',
      topPage: 'トップページ',
      authMethods: [
        'パスワードを使用',
        'PGPキーによるクリアサイン（ASCIIアーマード）',
        'SSHキーを検証',
        'メールでチャレンジテキストを受け取る'
      ],
      authMethodsTiny: [
        'パスワード認証',
        'PGP認証',
        'SSH認証',
        'メール認証'
      ]
    },
    posts: {
      pleaseWait: 'お待ちください',
    },
    nodes: {
      search: '名前またはIPアドレスで検索...',
      nodes: 'BGPネットワークノード',
      copied: '詳細がコピーされました',
      pleaseSignIn: 'まずログインしてください。',
      statusOpen: '開放中',
      statusOpenManuallyReview: '開放中（スタッフによる確認）',
      statusClosed: '新規の方はクローズ中',
      statusFull: '満員のためクローズ中',
      statusCapacity: '容量'
    },
    peering: {
      couldNotGetData: 'ノードデータを取得できませんでした。',
      step1: '機能',
      step2: 'インターフェース',
      step3: 'セットアップ',
      step4: '完了',
      linkType: 'リンクタイプ',
      interface: 'インターフェース',
      bgpExtensions: 'BGP拡張機能',
      openvpn: 'OpenVPNトンネル',
      wireguard: 'WireGuardトンネル',
      ipsec: 'IPSecトンネル',
      gre: 'GREトンネル',
      direct: '直接イーサネット',
      'mp-bgp': 'マルチプロトコルBGP',
      'extended-nexthop': '拡張ネクストホップ',
      step1Introduction: 'このノードは以下の機能をサポートしています。\n利用したいものを選んでください。',
      step2Introduction: 'インターフェース設定時に役立ちます。',
      useIpv4: 'IPv4を有効にする',
      useIpv6: 'IPv6 ULAを使用する',
      useIpv6LinkLocal: 'IPv6リンクローカルを使用する',
      endpoint: 'エンドポイント',
      credential: '公開鍵',
      mustEnableAtleastOneProtocol: '少なくとも1つのIPプロトコルを有効にする必要があります。',
      mustEnterTunnelInformation: 'エンドポイントと認証情報を含むトンネル情報を入力してください。',
      inputValid: '入力情報が無効です。確認してもう一度お試しください。',
      back: '修正に戻る',
      backTop: 'すべてのノードページに戻る',
      step3Introduction: 'ピアリングの申請内容をご確認ください。',
      ipv4: 'DN42 IPv4',
      ipv6: 'DN42 IPv6',
      asn: 'ピアASN',
      ipv6LinkLocal: 'IPv6リンクローカル',
      tunnelEndpointHint: '（任意）トンネルエンドポイント。形式：[ホスト名またはIP]:ポート',
      tunnelCredentialHint: 'トンネル認証情報または公開鍵。',
      thankYou: 'ありがとうございます',
      step4Introduction: 'セッションを構成中です。ピアリングステータスを後ほどご確認ください。',
      step4IntroductionReview: 'このセッションは手動レビューが必要です。まもなくリクエストを進めます。',
    },
    manage: {
      mySessions: 'マイセッション',
      myAccount: 'マイアカウント',
      manageSessions: 'セッション管理',
      managePosts: '投稿管理',
      manageConfig: 'サイト設定',
      manageNodes: 'ノード管理',
      settings: '設定',
      allSessions: 'すべてのセッション',
      session: {
        search: 'ASNまたはIPアドレスで検索...',
        node: 'ノード',
        type: 'インターフェイスタイプ',
        status: 'ステータス',
        action: 'アクション',
        info: '情報',
        newPeeringSession: '新しいピアリングセッション',
        statusCode: {
          '-1': 'レビュー待ち',
          '0': '無効',
          '1': '有効'
        },
        enable: '有効化',
        disable: '無効化',
        remove: '削除',
        approve: '承認',
        areYouSure: '本当によろしいですか？',
        ok: 'OK'
      },
      account: {
        setYourPassword: 'このサイトでのパスワードを設定する',
        password: 'パスワード',
        confirmPassword: '確認',
        setPassword: 'パスワードを設定する',
        successSetPassword: 'パスワードが正常に設定または解除されました。'
      },
      config: {
        changeConfig: 'このサイトの設定を変更する',
        save: '保存',
        netAsn: '管理ASN',
        netName: 'ネットワーク名',
        netDesc: 'ネットワークの説明',
        footerText: 'フッターテキスト',
        maintenanceText: 'メンテナンステキスト'
      },
      posts: {
        title: 'タイトル',
        category: 'カテゴリー',
        updatedAt: '更新日',
        createdAt: '作成日',
        addOrEdit: '投稿の追加または編集',
        add: '投稿の追加',
        view: '表示',
        edit: '編集',
        content: '内容',
        close: '閉じる'
      },
      nodes: {
        sessionCapacity: 'セッション容量',
        openPeering: 'ピアリングを開放',
        autoPeering: '自動ピアリング',
        public: '公開（可視性）',
        location: '場所',
        description: '説明',
        name: '名前',
        addOrEdit: 'ノードの追加または編集',
        add: 'ノードの追加',
        callbackUrl: 'コールバックURL'
      }
    }
  }
}
