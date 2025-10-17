/**
 * 
 *    iEdon-Net PeerAPI Frontend     
 *          Configutation            
 * 
 */

import pkg from '../package.json'

export default {
  root: '/',
  version: pkg.version,
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
  },
  lgUrl: {
    '19f6a4dc-6367-4774-a88d-9e9672ef20ad': 'https://lg.iedon.net/detail/hk-hkg/',
    '24fa31db-9397-40d9-864d-42091bbbeeaa': 'https://lg.iedon.net/detail/jp-kot/',
    '36b076c8-b49a-4b45-90ea-8fd745a28356': 'https://lg.iedon.net/detail/us-lax/',
    '40ca6d20-048d-4cb2-89be-e94f99af6781': 'https://lg.iedon.net/detail/jp-118/',
    '63a50273-1d5d-47c5-a862-df0678409e24': 'https://lg.iedon.net/detail/sg-sin/',
    '6e60ff7d-6d12-4453-9dd5-c1fc83ec2cb6': 'https://lg.iedon.net/detail/us-sjc/',
    'b2754a85-a4fe-46c0-a392-1988a548b688': 'https://lg.iedon.net/detail/de-fra/',
    'c88b0ffa-d9f7-4672-86e6-064b4b68aa05': 'https://lg.iedon.net/detail/jp-tyo/',
    'ca5196a1-ab8d-430d-a918-b386ad5c1632': 'https://lg.iedon.net/detail/cn-czx/',
    'a916ec9a-d4ce-4b8a-82ce-692a3fc44779': 'https://lg.iedon.net/detail/uk-lon/',
    'a331daff-40bd-478c-ac0d-a7b14bbcbaae': 'https://lg.iedon.net/detail/us-nyc/',
    '4d05d0ac-bbb5-4e91-9577-288fc8b6885e': 'https://lg.iedon.net/detail/cn-ntg/',
    'fc2f74f8-31d4-46f6-b595-7e705aca96d3': 'https://lg.iedon.net/detail/cn-sha/',
  },
  grafana: {
    urlPrefix: 'https://grafana.iedon.net/d/iew2sc5/network-overview?kiosk=true&orgId=2&from=now-1h&refresh=5m&to=now&timezone=utc',
    queryStringForLocating: {
      router: 'var-router_public',
      session: 'var-peer',
    }
  },
  mapDn42Url: 'https://map.iedon.net',
  metricPageRefreshInterval: 300000, // 5 minutes
}
