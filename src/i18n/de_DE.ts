export default {
  header: {
    home: 'Startseite',
    nodes: 'BGP',
    signIn: 'Anmelden',
    signOut: 'Abmelden',
    signOutConfirm: 'Sind Sie sicher, dass Sie sich abmelden möchten?',
  },
  packetHandler: {
    fetchException: 'Daten konnten nicht abgerufen werden.',
    errMsg400_BAD_REQUEST: 'Ihre Anfrage ist ungültig.\nÜberprüfen Sie das Eingabeformat und versuchen Sie es erneut.',
    errMsg404: 'Entschuldigung, die angeforderte Ressource ist derzeit nicht verfügbar.',
    errMsg405_METHOD_NOT_ALLOWED: 'Die Anfragemethode ist nicht zulässig.',
    errMsg500_SERVER_ERROR: 'Entschuldigung, unser Server hat ein Problem festgestellt.\nBitte versuchen Sie es erneut oder kontaktieren Sie uns bei Bedarf.',
    errMsg502_503: 'Entschuldigung, unser Dienst ist derzeit nicht verfügbar oder wird gewartet.\nBitte versuchen Sie es erneut oder kontaktieren Sie uns bei Bedarf.',
    err_UNAUTHORIZED: 'Bitte melden Sie sich an, um auf diese Ressource zuzugreifen.',
    err_ROUTER_NOT_AVAILABLE: 'Entschuldigung, der angeforderte Router ist nicht verfügbar.\nBitte versuchen Sie es erneut oder kontaktieren Sie uns bei Bedarf.',
    err_ROUTER_OPERATION_FAILED: 'Entschuldigung, bei der Konfiguration Ihrer Sitzung ist ein Fehler aufgetreten.\nBitte versuchen Sie es erneut oder kontaktieren Sie uns bei Bedarf.'
  },
  pages: {
    signIn: {
      step1: 'Abfrage',
      step2: 'Wählen',
      step3: 'Herausforderung',
      step4: 'Willkommen',
      step1Introduction: 'Stellen Sie sicher, dass Ihre Objekte von der DN42-Community zusammengeführt wurden und in der WHOIS-Datenbank abgefragt werden können.',
      asn: 'AS-Nummer',
      pleaseInput: 'Bitte eingeben oder überprüfen',
      signIn: 'Anmelden',
      couldNotFindAuthMethod: 'Entschuldigung, wir konnten keine verfügbaren Authentifizierungsmethoden für Ihr AS abrufen.\nMögliche Gründe:\n1. Ihre Objekte sind nicht zusammengeführt oder synchronisiert, oder es ist ein Fehler aufgetreten.\n2. Es wurden keine gültigen Einträge in admin-c oder mntner gefunden.\n3. Ihre Authentifizierungsmethoden werden von unserem System nicht unterstützt.\nBitte kontaktieren Sie uns für weitere Hilfe. Vielen Dank.',
      hi: 'Hallo,',
      signUp: 'Klicken Sie hier, um mehr über DN42 zu erfahren',
      queryingSignInMethod: 'Abrufen der Anmeldemethoden...',
      authenticateWith: 'Authentifizieren mit',
      useSitePassword: 'Verwenden Sie Ihr Passwort auf dieser Seite.',
      continue: 'Weiter',
      step2Introduction: 'Wir haben die folgenden Authentifizierungsmethoden für Ihr AS gefunden.\nTippen Sie auf eine Methode unten, um Details anzuzeigen.\nWählen Sie eine Methode aus, um fortzufahren.',
      errorOccurred: 'Entschuldigung, ein Fehler ist aufgetreten.\nBitte versuchen Sie es erneut oder kontaktieren Sie uns bei Bedarf.',
      pleaseWait: 'Bitte warten',
      step3Introduction: 'Bitte geben Sie den Herausforderungstext ein.\nFalls Sie sich mit einem Passwort anmelden, geben Sie Ihr Seitenpasswort ein.\nFalls Sie einen PGP-Schlüssel verwenden, fügen Sie Ihren vollständigen öffentlichen Schlüssel ein, signieren Sie die Herausforderung im Clear-Sign-Modus und fügen Sie den signierten Text zusammen mit Ihrem öffentlichen Schlüssel mit übereinstimmendem Fingerabdruck ein.\nFalls Sie einen SSH-Schlüssel verwenden, verbinden Sie sich mit unserem SSH-Server zur Validierung und fügen Sie den Herausforderungstext ein.\nVerweisen Sie ggf. auf den untenstehenden Befehl.',
      challengeHint: 'Passwort von, E-Mail von, PGP signieren mit, oder Verbinden mit',
      challengeText: 'Herausforderungstext',
      challengeTextPlaceholder: 'Seitenpasswort, SSH/E-Mail-Code oder signierte Nachricht im PEM-Format, armortiert',
      pgpPublicKey: 'PGP-Öffentlicher Schlüssel',
      signInFailed: 'Anmeldung fehlgeschlagen',
      welcomeBack: 'Willkommen zurück,',
      step4Introduction: 'Sie können nun Ihre Sitzung verwalten und neue Peerings konfigurieren.',
      manageSessions: 'Peering-Sitzungen verwalten',
      topPage: 'Startseite',
      authMethods: [
        'Mit Passwort',
        'Clear Sign (ASCII-Armored) mit PGP-Schlüssel',
        'SSH-Schlüssel validieren',
        'E-Mail senden für Herausforderungstext'
      ],
      authMethodsTiny: [
        'Passwort-Auth',
        'PGP-Auth',
        'SSH-Auth',
        'E-Mail-Auth'
      ]
    },
    posts: {
      pleaseWait: 'Bitte warten',
    },
    nodes: {
      search: 'Nach Name oder IP-Adresse suchen...',
      nodes: 'BGP-Netzwerkknoten',
      copied: 'Details kopiert',
      pleaseSignIn: 'Bitte zuerst anmelden.',
      statusOpen: 'OFFEN',
      statusOpenManuallyReview: 'OFFEN (MITARBEITERÜBERPRÜFUNG)',
      statusClosed: 'GESCHLOSSEN für Neuzugänge',
      statusFull: 'GESCHLOSSEN (VOLL)',
      statusCapacity: 'Kapazität'
    },
    peering: {
      couldNotGetData: 'Knotendaten konnten nicht abgerufen werden.',
      step1: 'Funktionen',
      step2: 'Schnittstelle',
      step3: 'Einrichten',
      step4: 'Fertig',
      linkType: 'Verbindungstyp',
      interface: 'Schnittstelle',
      bgpExtensions: 'BGP-Erweiterungen',
      openvpn: 'OpenVPN-Tunnel',
      wireguard: 'WireGuard-Tunnel',
      ipsec: 'IPSec-Tunnel',
      gre: 'GRE-Tunnel',
      direct: 'Direkt-Ethernet',
      'mp-bgp': 'Multi-Protokoll-BGP',
      'extended-nexthop': 'Erweiterter Nexthop',
      step1Introduction: 'Dieser Knoten unterstützt die folgenden Funktionen.\nWählen Sie eine oder mehrere, die Sie verwenden möchten.',
      step2Introduction: 'Diese Einstellungen helfen bei der Konfiguration Ihrer Schnittstelle.',
      useIpv4: 'IPv4 aktivieren',
      useIpv6: 'IPv6 ULA verwenden',
      useIpv6LinkLocal: 'IPv6 Link-Local verwenden',
      endpoint: 'Endpunkt',
      credential: 'Öffentlicher Schlüssel',
      mustEnableAtleastOneProtocol: 'Mindestens ein IP-Protokoll muss aktiviert sein.',
      mustEnterTunnelInformation: 'Tunnelinformationen, einschließlich Endpunkt und Anmeldedaten, sind erforderlich.',
      inputValid: 'Ungültige Informationen. Bitte überprüfen und erneut versuchen.',
      back: 'Zurück zur Änderung',
      backTop: 'Zurück zur Knotenübersicht',
      step3Introduction: 'Details Ihrer Peering-Anfrage. Bitte überprüfen.',
      ipv4: 'DN42 IPv4',
      ipv6: 'DN42 IPv6',
      asn: 'Peer-ASN',
      ipv6LinkLocal: 'IPv6 Link-Local',
      tunnelEndpointHint: '(Optional) Tunnelendpunkt im Format: [Hostname oder IP]:Port',
      tunnelCredentialHint: 'Ihr Tunnel-Anmeldedaten oder öffentlicher Schlüssel.',
      thankYou: 'Vielen Dank',
      step4Introduction: 'Ihre Sitzung wird konfiguriert. Überprüfen Sie den Status Ihres Peerings später.',
      step4IntroductionReview: 'Diese Sitzung erfordert eine manuelle Überprüfung. Wir werden Ihre Anfrage bald bearbeiten.',
    },
    manage: {
      mySessions: 'Meine Sitzungen',
      myAccount: 'Mein Konto',
      manageSessions: 'Sitzungen verwalten',
      managePosts: 'Beiträge verwalten',
      manageConfig: 'Seiteneinstellungen',
      manageNodes: 'Knoten verwalten',
      settings: 'Einstellungen',
      allSessions: 'Alle Sitzungen',
      session: {
        search: 'Nach ASN oder IP-Adresse suchen...',
        node: 'Knoten',
        type: 'Schnittstellentyp',
        status: 'Status',
        action: 'Aktion',
        info: 'Info',
        newPeeringSession: 'Neue Peering-Sitzung',
        statusCode: {
          '-1': 'Warten auf Überprüfung',
          '0': 'Deaktiviert',
          '1': 'Aktiviert'
        },
        enable: 'Aktivieren',
        disable: 'Deaktivieren',
        remove: 'Entfernen',
        approve: 'Genehmigen',
        areYouSure: 'Sind Sie sicher?',
        ok: 'OK'
      },
      account: {
        setYourPassword: 'Passwort für diese Seite festlegen',
        password: 'Passwort',
        confirmPassword: 'Bestätigen',
        setPassword: 'Passwort festlegen',
        successSetPassword: 'Passwort erfolgreich festgelegt oder gelöscht.'
      },
      config: {
        changeConfig: 'Seiteneinstellungen ändern',
        save: 'Speichern',
        netAsn: 'Admin-ASN',
        netName: 'Netzwerkname',
        netDesc: 'Netzwerkbeschreibung',
        footerText: 'Fußzeilentext',
        maintenanceText: 'Wartungstext'
      },
      posts: {
        title: 'Titel',
        category: 'Kategorie',
        updatedAt: 'Aktualisiert am',
        createdAt: 'Erstellt am',
        addOrEdit: 'Beitrag hinzufügen oder bearbeiten',
        add: 'Beitrag hinzufügen',
        view: 'Ansehen',
        edit: 'Bearbeiten',
        content: 'Inhalt',
        close: 'Schließen'
      },
      nodes: {
        sessionCapacity: 'Sitzungskapazität',
        openPeering: 'Peering öffnen',
        autoPeering: 'Automatisches Peering',
        public: 'Öffentlich (Sichtbarkeit)',
        location: 'Standort',
        description: 'Beschreibung',
        name: 'Name',
        addOrEdit: 'Knoten hinzufügen oder bearbeiten',
        add: 'Knoten hinzufügen',
        callbackUrl: 'Callback-URL'
      }
    }
  }
}
