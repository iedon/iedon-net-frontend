/**
 * 
 *    iEdon-Net PeerAPI Frontend     
 *          Configutation            
 * 
 */

import pkg from '../package.json'

export default {
    root: '/',
    package: `${pkg.name}/${pkg.version}`,
    apiPrefix: 'https://api.iedon.com/dn42/peerapi',
    pingIntervalMs: 180000,
    configFallback: {
        netAsn: '4242422189',
        netName: 'iedon.dn42',
        netDesc: 'IEDON-NET',
        footerText: '',
        maintenanceText: ''
    },
    gravatarUrlPrefix: 'https://www.gravatar.com/avatar/',
    openAuthCallback: {
      // Compatibility:
      // will handle token to our type -> kioubit: 'https://iedon.net/openAuth?type=kioubit',
      kioubit: 'https://iedon.net/openAuth?token=kioubit.dn42',
    }
}