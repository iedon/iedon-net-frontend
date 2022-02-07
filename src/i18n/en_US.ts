export default {
    header: {
        home: 'Home',
        nodes: 'Nodes',
        privacy: 'Privacy Policy',
        privacyPolicyContent: 'This site requires JavaScript and localStorage technologies to work.\nWe do not collect any personal information.\nBUT we may log your IP address, session status for debugging purposes.',
        signIn: 'Sign In',
        signOut: 'Sign out',
        signOutConfirm: 'Are you really want to sign out?',
    },
    packetHandler: {
        fetchException: 'Failed to fetch data.',
        errMsg400_BAD_REQUEST: 'Your request is not valid.\nCheck your input format and try again.',
        errMsg404: 'Sorry, your requested resource is currently not available.',
        errMsg405_METHOD_NOT_ALLOWED: 'Your request method is not allowed.',
        errMsg500_SERVER_ERROR: 'Sorry, our server has encountered some problems.\nPlease try again or feel free to contact us.',
        errMsg502_503: 'Sorry, our service is not available or under maintenance.\nPlease try again or feel free to contact us.',
        err_UNAUTHORIZED: 'You need to sign in before accessing this resource.',
        err_ROUTER_NOT_AVAILABLE: 'Sorry, the router you requested is not available.\nPlease try again or feel free to contact us.',
        err_ROUTER_OPERATION_FAILED: 'Sorry, something wrong while configuring your session.\nPlease try again or feel free to contact us.'
    },
    pages: {
        signIn: {
            step1: 'Query',
            step2: 'Choose',
            step3: 'Challenge',
            step4: 'Welcome',
            step1Introduction: 'Please make sure that your objects are already merged by DN42 community and can be queried from the WHOIS database.',
            asn: 'AS Number',
            pleaseInput: 'Please input or check',
            signIn: 'Sign In',
            couldNotFindAuthMethod: 'Sorry, we are unable to retrieve possible authentication methods from your AS.\nPossible reasons are:\n1. Your objects are not merged and synchronized. Or, there is an error occurred.\n2. We could not find possible entries from admin-c and mntner.\n3. Your authentication methods are not supported by our system.\nPlease feel free to contact us and get further help. Thank you.',
            hi: 'Hi,',
            signUp: 'Click here to learn more about DN42',
            queryingSignInMethod: 'Querying sign in methods...',
            authenticateWith: 'Authenticate with',
            useSitePassword: 'Use your password on this site.',
            continue: 'Continue',
            step2Introduction: 'We have found these supported authentication methods from your AS.\nTap methods listed below to see details.\nPick up one you would like to continue with.',
            errorOccurred: 'Sorry, an error occurred.\nPlease try again or feel free to contact us.',
            pleaseWait: 'Please wait',
            step3Introduction: 'Please enter challenge text.\nIf you sign-in with your password on our site, please enter your password.\nIf you sign-in with your PGP key, please paste your armored full public key, SIGN the challenge message in PEM CLEAR TEXT mode and then paste it here.\nIf you sign-in with your SSH key, CONVERT it to PEM and then do like PGP.',
            challengeHint: 'Password of, E-mail from or Clear sign with',
            challengeText: 'Challenge text',
            challengeTextPlaceholder: 'Site password, authentication code from e-mail or signed clear text message in PEM format, armored',
            pgpPublicKey: 'PGP public key',
            signInFailed: 'Sign in failed',
            welcomeBack: 'Welcome back,',
            step4Introduction: 'You can now manage your session and configure new peerings.',
            manageSessions: 'Manage peering sessions',
            topPage: 'Top page'
        },
        posts: {
            pleaseWait: 'Please wait',
        },
        nodes: {
            nodes: 'BGP Network Nodes',
            copied: 'Detail has been copied',
            pleaseSignIn: 'Please sign in first.',
            statusOpen: 'OPEN.',
            statusOpenManuallyReview: 'OPEN (STAFF REVIEW).',
            statusClosed: 'CLOSED for newcomer.',
            statusFull: 'CLOSED for FULL.',
            statusCapacity: 'Capacity'
        },
        peering: {
            couldNotGetData: 'Could not get node data.',
            step1: 'Features',
            step2: 'Interface',
            step3: 'Set up',
            step4: 'Done',
            linkType: 'Link Type',
            interface: 'Interface',
            bgpExtensions: 'BGP Extensions',
            openvpn: 'OpenVPN Tunnel',
            wireguard: 'WireGuard Tunnel',
            ipsec: 'IPSec Tunnel',
            gre: 'GRE Tunnel',
            direct: 'Direct Ethernet',
            'mp-bgp': 'Multi-protocol BGP',
            'extended-nexthop': 'Extended Nexthop',
            step1Introduction: 'This node supports the following features.\nPick up one or more you would like to use.',
            step2Introduction: 'This helps when you are configuring your interface.',
            useIpv4: 'Enable IPv4',
            useIpv6: 'Enable IPv6',
            useIpv6LinkLocal: 'Use IPv6 Link Local',
            endpoint: 'Endpoint',
            credential: 'Public key',
            mustEnableAtleastOneProtocol: 'You must enable at least one IP protocol.',
            mustEnterTunnelInformation: 'You must enter tunnel information, including endpoint and credential.',
            inputValid: 'Your information is not valid. Check and try again.',
            back: 'Back to modify',
            step3Introduction: 'Your application for peering. Please have a check.',
            ipv4: 'Your IPv4',
            ipv6: 'Your IPv6',
            asn: 'Peer ASN',
            ipv6LinkLocal: 'Your IPv6 Link Local',
            tunnelEndpointHint: 'Your Tunnel Endpoint. Format: [Hostname or IP]:Port',
            tunnelCredentialHint: 'Your Tunnel Credential or public key.',
            thankYou: 'Thank you',
            step4Introduction: 'We\'re now configuring your session. Come and check your peering status later.',
            step4IntroductionReview: 'This session needs manually review. We will soon proceed with your request.',
        },
        manage: {
            mySessions: 'My Sessions',
            myAccount: 'My Account',
            manageSessions: 'Manage Sessions',
            managePosts: 'Manage Posts',
            manageConfig: 'Site Settings',
            manageNodes: 'Manage Nodes',
            settings: 'Settings',
            allSessions: 'All Sessions',
            session: {
                node: 'Node',
                type: 'Interface Type',
                status: 'Status',
                action: 'Action',
                info: 'Info',
                newPeeringSession: 'New Peering Session',
                statusCode: {
                    '-1': 'Pending Review',
                    '0': 'Disabled',
                    '1': 'Enabled'
                },
                enable: 'Enable',
                disable: 'Disable',
                remove: 'Remove',
                approve: 'Approve',
                areYouSure: 'Are you sure?',
                ok: 'OK'
            },
            account: {
                setYourPassword: 'Set your password on this site',
                password: 'Password',
                confirmPassword: 'Confirm',
                setPassword: 'Set password',
                successSetPassword: 'You have successfully set or cleared your password on this site.'
            },
            config: {
                changeConfig: 'Change configuration of this site',
                save: 'Save',
                netAsn: 'Admin ASN',
                netName: 'Network Name',
                netDesc: 'Network Description',
                footerText: 'Footer Text',
                maintenanceText: 'Maintenace Text'
            },
            posts: {
                title: 'Title',
                category: 'Category',
                updatedAt: 'Updated At',
                createdAt: 'Created At',
                addOrEdit: 'Add or edit post',
                add: 'Add post',
                view: 'View',
                edit: 'Edit',
                content: 'Content',
                close: 'Close'
            },
            nodes: {
                sessionCapacity: 'Session Capacity',
                openPeering: 'Open Peering',
                autoPeering: 'Auto Peering',
                public: 'Public (Visibility)',
                location: 'Location',
                description: 'Description',
                name: 'Name',
                addOrEdit: 'Add or edit node',
                add: 'Add node',
                callbackUrl: 'Callback URL'
            }
        }
    }
}