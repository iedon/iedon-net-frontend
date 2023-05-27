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
    apiPrefix: 'https://api.iedon.com/dn42',
    pingIntervalMs: 90000,
    configFallback: {
        netAsn: '4242422189',
        netName: 'iedon.dn42',
        netDesc: 'IEDON-NET',
        footerText: 'Running in fallback mode',
        maintenanceText: ''
    },
    gravatarUrlPrefix: 'https://www.gravatar.com/avatar/'
}
