export default {
  meta: {
    description: 'iEdon Networks (iEdon-Net), fondé en 2017. Membre du réseau DN42 depuis mars 2019.',
    keywords: 'DN42,iEdon,4242422189,iEdon-Net,AutoPeer,Peer,NEONETWORK,ICVPN,CHAOSVPN,BGP,peering automatique,connexion peering,ASN,nœud pair,temps réel,BGP,réseau,routage,BIRD,FRR,FRRouting',
    ogTitle: 'iEdon Networks (iEdon-Net)',
    ogSiteName: 'iEdon-Net'
  },
  header: {
    home: 'Accueil',
    nodes: 'Peering',
    posts: 'Articles',
    signIn: 'Connexion',
    signOut: 'Déconnexion',
    signOutConfirm: 'Êtes-vous sûr de vouloir vous déconnecter ?',
  },
  notification: {
    error: 'Erreur',
    info: 'Information',
    warning: 'Avertissement',
    success: 'Succès',
    maintenance: 'Maintenance'
  },
  packetHandler: {
    fetchException: 'Échec de la récupération des données.',
    errMsg400_BAD_REQUEST: 'Votre requête est invalide.\nVeuillez vérifier le format et réessayer.',
    errMsg404: 'Désolé, la ressource demandée est actuellement indisponible.',
    errMsg405_METHOD_NOT_ALLOWED: 'La méthode de requête n’est pas autorisée.',
    errMsg500_SERVER_ERROR: 'Désolé, notre serveur a rencontré un problème.\nVeuillez réessayer ou nous contacter si besoin.',
    errMsg502_503: 'Désolé, le service est indisponible ou en maintenance.\nVeuillez réessayer ou nous contacter si besoin.',
    err_UNAUTHORIZED: 'Veuillez vous connecter pour accéder à cette ressource.',
    err_ROUTER_NOT_AVAILABLE: 'Désolé, le routeur demandé est indisponible.\nVeuillez réessayer ou nous contacter si besoin.',
    err_ROUTER_OPERATION_FAILED: 'Désolé, une erreur est survenue lors de la configuration de votre session.\nVeuillez réessayer ou nous contacter si besoin.'
  },
  pages: {
    signIn: {
      step1: 'Requête',
      step2: 'Choisir',
      step3: 'Défi',
      step4: 'Bienvenue',
      step1Introduction: 'Assurez-vous que vos objets ont été fusionnés par la communauté DN42 et sont consultables dans la base WHOIS.',
      asn: 'Numéro AS',
      pleaseInput: 'Veuillez saisir ou vérifier',
      signIn: 'Connexion',
      couldNotFindAuthMethod: 'Désolé, nous n’avons pas pu récupérer les méthodes d’authentification disponibles pour votre AS.\nRaisons possibles :\n1. Vos objets ne sont pas fusionnés ou synchronisés, ou une erreur est survenue.\n2. Aucun enregistrement valide dans admin-c ou mntner.\n3. Méthodes d’authentification non prises en charge par notre système.\nContactez-nous pour toute assistance. Merci.',
      hi: 'Bonjour,',
      youCanAlso: 'Vous pouvez aussi',
      authWithKioubit: 'Authentifier avec Kioubit.dn42',
      signUp: 'Cliquez ici pour en savoir plus sur DN42',
      queryingSignInMethod: 'Récupération des méthodes de connexion…',
      authenticateWith: 'Authentifier avec',
      useSitePassword: 'Utilisez votre mot de passe du site.',
      continue: 'Continuer',
      step2Introduction: 'Nous avons trouvé les méthodes d’authentification suivantes pour votre AS.\nAppuyez sur une méthode ci-dessous pour voir les détails et choisissez-en une pour continuer.',
      errorOccurred: 'Désolé, une erreur est survenue.\nVeuillez réessayer ou nous contacter si besoin.',
      pleaseWait: 'Veuillez patienter',
      step3Introduction: 'Veuillez saisir le texte du défi.\nSi vous utilisez l’authentification par e-mail, vérifiez votre boîte de réception (y compris les spams). Essayez une autre méthode si vous ne recevez pas l’e-mail.\nPour le mot de passe, saisissez votre mot de passe du site.\nPour la clé PGP, collez votre clé publique, signez le message du défi en mode clear sign, puis collez la sortie signée et la clé publique avec l’empreinte correspondante.\nPour la clé SSH, connectez-vous à notre serveur SSH pour valider et collez le texte du défi.\nRéférez-vous à la commande ci-dessous si besoin.',
      challengeHint: 'Mot de passe, e-mail, signature PGP ou connexion SSH',
      challengeText: 'Texte du défi',
      challengeTextPlaceholder: 'Mot de passe, code e-mail/SSH ou message signé au format PEM',
      pgpPublicKey: 'Clé publique PGP',
      signInFailed: 'Échec de la connexion',
      welcomeBack: 'Bon retour,',
      step4Introduction: 'Vous pouvez maintenant gérer votre session et configurer de nouveaux peering.',
      manageSessions: 'Gérer les sessions de peering',
      topPage: 'Accueil',
      authMethods: [
        'Utiliser le mot de passe',
        'Signature clear sign avec clé PGP',
        'Valider la clé SSH',
        'Recevoir le texte du défi par e-mail'
      ],
      authMethodsTiny: [
        'Mot de passe',
        'PGP',
        'SSH',
        'E-mail'
      ]
    },
    posts: {
      pleaseWait: 'Veuillez patienter',
    },
    nodes: {
      search: 'Recherche par nom ou adresse IP…',
      nodes: 'Nœuds réseau BGP',
      subTitle: 'Choisissez un routeur BGP pour établir une connexion de peering',
      copied: 'Détails copiés',
      pleaseSignIn: 'Veuillez d’abord vous connecter.',
      statusOpen: 'OUVERT',
      statusOpenManuallyReview: 'OUVERT (VÉRIFICATION STAFF)', statusClosed: 'FERMÉ aux nouveaux',
      statusFull: 'FERMÉ (COMPLET)',
      statusCapacity: 'Capacité',
      routerOffline: 'Routeur hors ligne',
      routerOfflineDescription: 'Ce routeur semble hors ligne (dernière mise à jour il y a plus de 15 minutes). Veuillez réessayer plus tard ou contacter l’administrateur.',
      maintenanceMode: 'Mode maintenance',
      connectionTypes: 'Types de connexion',
      uptime: 'Uptime',
      loadAvg: 'Charge moyenne',
      txRx: 'TX / RX',
      tcpUdp: 'TCP / UDP',
      router: 'Routeur',
      kernel: 'Noyau',
      agent: 'API',
      totalRouters: 'Nombre total de routeurs',
      totalSessions: 'Sessions configurées',
      availableForAuto: 'Peering instantané',
    },
    peering: {
      couldNotGetData: 'Impossible de récupérer les données du nœud.',
      step1: 'Fonctionnalités',
      step2: 'Interface',
      step3: 'Configuration',
      step4: 'Terminé',
      linkType: 'Type de lien',
      interface: 'Interface',
      bgpExtensions: 'Extensions BGP',
      routingPolicy: 'Politique de routage (Votre rôle)',
      routingPolicyTypes: {
        FULL: 'Table complète',
        FULL_DESC: '⭐ Par défaut et recommandé pour DN42. Envoyer et recevoir toutes les routes valides.',
        TRANSIT: 'Transit',
        TRANSIT_DESC: 'Envoyer les routes locales et descendantes. Recevoir toutes les routes valides.',
        PEER: 'Peer',
        PEER_DESC: 'Envoyer les routes locales et descendantes. Recevoir les vôtres et celles de vos "descendants" (AS Path ≤ 2).',
        DOWNSTREAM: 'Descendant',
        DOWNSTREAM_DESC: 'Envoyer toutes les routes valides. Recevoir les vôtres et celles de vos "descendants" (AS Path ≤ 2).',
        UPSTREAM: 'Amont (Admin)',
        UPSTREAM_DESC: 'Recevoir toutes les routes valides, envoyer les locales et descendantes au distant.'
      },
      v4v6force: '💡 Ajoutez le préfixe “v4.” ou “v6.” à notre point de terminaison pour forcer l’utilisation d’IPv4 ou IPv6, si pris en charge.',
      openvpn: 'OpenVPN',
      wireguard: 'WireGuard',
      ipsec: 'IPSec',
      gre: 'GRE (IPv4)',
      ip6gre: 'GRE (IPv6)',
      direct: 'Ethernet direct',
      'mp-bgp': 'BGP multiprotocole',
      'extended-nexthop': 'Nexthop étendu',
      step1Introduction: 'Ce nœud prend en charge les fonctionnalités suivantes.\nSélectionnez-en une ou plusieurs. La politique de routage est une fonctionnalité DN42, utilisez les communautés BGP (65535, 65281) et (65535, 65282) avec "Table complète" pour contrôler la propagation des routes avec précision.',
      step2Introduction: 'Ces paramètres aident à configurer votre interface.',
      useIpv4: 'Activer IPv4',
      useIpv6: 'Utiliser IPv6 ULA',
      useIpv6LinkLocal: 'Utiliser et préférer IPv6 Link Local',
      endpoint: 'Point de terminaison',
      credential: 'Clé publique',
      mtu: 'MTU interface',
      mustEnableAtleastOneProtocol: 'Au moins un protocole IP doit être activé.',
      mustEnterTunnelInformation: 'Les informations du tunnel, y compris le point de terminaison et les identifiants, sont requises.',
      inputValid: 'Informations invalides. Veuillez vérifier et réessayer.',
      inputValidMTU: 'Veuillez saisir une valeur MTU valide (1280-9999).',
      back: 'Retour à la modification',
      backTop: 'Retour',
      step3Introduction: 'Détails de votre demande de peering. Veuillez vérifier.',
      ipv4: 'DN42 IPv4',
      ipv6: 'DN42 IPv6',
      asn: 'ASN du peer',
      ipv6LinkLocal: 'IPv6 Link Local',
      tunnelEndpointHint: '(Optionnel) Point de terminaison du tunnel au format : Nom d’hôte ou IP:Port',
      tunnelCredentialHint: 'Votre identifiant de tunnel ou clé publique.',
      thankYou: 'Merci',
      step4Introduction: 'Nous configurons votre session. Vérifiez l’état du peering plus tard.',
      step4IntroductionReview: 'Cette session nécessite une vérification manuelle. Nous traiterons votre demande sous peu.',
      reuseExistingConfig: 'Conserver le même point de terminaison ou port (notre côté) que ma configuration précédente',
    },
    landing: {
      subTitle: 'iEdon Networks (iEdon-Net), depuis 2017. Membre du réseau DN42 depuis mars 2019.',
      startPeering: 'Peering instantané',
      viewGlobalMap: 'Voir la carte mondiale',
      globalNetworkMap: 'Carte du réseau mondial',
      mapDescription: 'Explorez notre réseau mondial de nœuds DN42 et de sessions de peering.',
      whyChoose: 'Pourquoi choisir notre réseau ?',
      automaticPeering: 'Peering automatique',
      automaticPeeringDescription: 'Configurez automatiquement les sessions de peering sans intervention manuelle.\nNotre système gère les détails techniques pour vous.',
      globalNetwork: 'Réseau mondial',
      globalNetworkDescription: 'Connectez-vous depuis plusieurs emplacements dans le monde pour un routage optimal et une redondance sur le réseau DN42.',
      secureAndReliable: 'Sécurisé et fiable',
      secureAndReliableDescription: 'Chiffrement standard de l’industrie avec WireGuard et autres.\nHaute disponibilité avec garantie de 42 % de temps de fonctionnement. ^_^ Aussi fun que DN42 lui-même.',
    },
    manage: {
      closeMenu: 'Fermer le menu',
      openMenu: 'Ouvrir le menu',
      mySessions: 'Mes sessions',
      myAccount: 'Mon compte',
      manageSessions: 'Gérer les sessions',
      managePosts: 'Gérer les articles',
      manageConfig: 'Paramètres du site',
      manageNodes: 'Gérer les nœuds',
      settings: 'Paramètres',
      allSessions: 'Toutes les sessions',
      session: {
        search: 'Recherche par ASN ou adresse IP…',
        node: 'Nœud',
        type: 'Type d’interface',
        status: 'Statut',
        action: 'Action',
        info: 'Info',
        viewMetrics: 'Voir les métriques',
        newPeeringSession: 'Nouvelle session de peering',
        showMyConnectivityInMap: 'Afficher sur Map.dn42',
        statusCode: {
          '0': 'Supprimé',
          '1': 'Désactivé',
          '2': 'Activé',
          '3': 'En attente d’approbation',
          '4': 'En file d’attente pour configuration',
          '5': 'En file d’attente pour suppression',
          '6': 'Problème détecté',
          '7': 'Démantelé',
        },
        enable: 'Activer',
        disable: 'Désactiver',
        remove: 'Supprimer',
        approve: 'Approuver',
        edit: 'Modifier',
        areYouSure: 'Êtes-vous sûr ?',
        ok: 'OK'
      },
      account: {
        setYourPassword: 'Définir le mot de passe du site',
        password: 'Mot de passe',
        confirmPassword: 'Confirmer',
        setPassword: 'Définir le mot de passe',
        successSetPassword: 'Mot de passe défini ou effacé avec succès.',
        hint1: 'Votre mot de passe est protégé par bcrypt avec 10 tours de salage.',
        hint2: 'Une fois défini, vous pouvez l’utiliser pour vous connecter au site.',
        hint3: 'Laissez vide et enregistrez pour effacer le mot de passe et désactiver la connexion par mot de passe.',
      },
      config: {
        changeConfig: 'Modifier la configuration du site',
        save: 'Enregistrer',
        netAsn: 'ASN administrateur',
        netName: 'Nom du réseau',
        netDesc: 'Description du réseau',
        footerText: 'Texte du pied de page',
        maintenanceText: 'Texte de maintenance'
      },
      posts: {
        title: 'Titre',
        category: 'Catégorie',
        updatedAt: 'Mis à jour le',
        createdAt: 'Créé le',
        addOrEdit: 'Ajouter ou modifier un article',
        add: 'Ajouter un article',
        view: 'Voir',
        edit: 'Modifier',
        content: 'Contenu',
        close: 'Fermer'
      },
      nodes: {
        sessionCapacity: 'Capacité de session',
        openPeering: 'Peering ouvert',
        autoPeering: 'Peering automatique',
        public: 'Public (Visibilité)',
        location: 'Emplacement',
        description: 'Description',
        name: 'Nom',
        addOrEdit: 'Ajouter ou modifier un nœud', add: 'Ajouter un nœud',
        callbackUrl: 'URL de rappel'
      }
    },
    metrics: {
      sessionMetrics: 'Métriques de session',
      back: 'Retour',
      clickToCopy: 'Cliquer pour copier',
      refresh: 'Rafraîchir',
      sessionId: 'ID de session',
      interaceType: 'Type d’interface',
      interfaceName: 'Nom de l’interface',
      bgpExtensions: 'Extensions BGP',
      routingPolicy: 'Politique de routage',
      mtu: 'MTU',
      sessionInfo: 'Infos session',
      lastUpdated: 'Dernière mise à jour',
      loadingMetrics: 'Chargement des métriques…',
      noMetricsFound: 'Aucune métrique trouvée',
      noMetricsFoundDesc: 'Impossible de trouver les données de métriques pour cette session.',
      goBack: 'Retour',
      fetchError: 'Échec de la récupération des métriques',
      invalidSession: 'Paramètres de session invalides',
      noData: 'Aucune donnée disponible',
      notAvailable: 'N/A',
      loading: 'Chargement…',
      none: 'Aucun',
      unknown: 'Inconnu',
      sessionDetails: 'Détails de la session',
      nextUpdate: 'Prochaine mise à jour',
      networkInfo: 'Informations réseau',
      ipv4Address: 'Adresse IPv4',
      ipv6Address: 'Adresse IPv6',
      ipv6LinkLocal: 'IPv6 Link Local',
      bgpMetrics: 'Métriques BGP',
      received: 'Importé',
      advertised: 'Exporté',
      bgpDetails: 'Détails BGP',
      bgpSession: 'Session BGP',
      routesReceivedIPv4: 'IPv4 importé',
      routesAdvertisedIPv4: 'IPv4 exporté',
      routesReceivedIPv6: 'IPv6 importé',
      routesAdvertisedIPv6: 'IPv6 exporté',
      interfaceMetrics: 'Métriques interface',
      interfaceDetails: 'Détails interface',
      rxBytes: 'Octets reçus',
      txBytes: 'Octets envoyés',
      bytes: 'Octets',
      txCurrent: 'Envoi actuel',
      rxCurrent: 'Réception actuelle',
      bgpStatus: {
        Close: 'Arrêté',
        Established: 'Établi',
        Idle: 'Inactif/IP interface incorrect',
        Active: 'Échec de connexion',
        Connect: 'Connexion',
        Open: 'Négociation',
        OpenSent: 'Négociation',
        OpenConfirm: 'Confirmation',
        Unknown: 'Inconnu',
        No: 'Aucune donnée',
      },
      networkMetrics: 'Métriques réseau',
      rtt: 'RTT',
      currentRtt: 'RTT actuel',
      packetLoss: 'Perte de paquets',
      timeout: 'Timeout',
      interfaceIPv4: 'IPv4',
      interfaceIPv6: 'IPv6',
      interfaceIPv6LinkLocal: 'IPv6 Link Local',
      interfaceMAC: 'Adresse MAC',
      interfaceMTU: 'MTU',
      interfaceStatus: 'Statut',
      currentRates: 'TX/RX actuel',
      txTotal: 'TX total',
      rxTotal: 'RX total',
      bgpPeerName: 'Nom du peer (cliquer pour ouvrir Looking Glass)',
      bgpState: 'État',
      bgpSince: 'Depuis',
      sessionStatus: 'Statut de session',
      detailedMetrics: 'Métriques détaillées',
      clickToViewDetails: 'Cliquer pour voir les détails',
      clickToViewChart: 'Cliquer pour voir le graphique',
      timeAgo: {
        seconds: 'il y a quelques secondes',
        minute: 'il y a une minute',
        minutes: 'il y a quelques minutes',
        hour: 'il y a une heure',
        hours: 'il y a quelques heures',
        day: 'il y a un jour',
        days: 'il y a quelques jours'
      }
    }
  }
}
