import { message } from 'ant-design-vue';
import config from '../config';
import { loggedIn, openNotification, splitMessageToVNodes } from './helper';

// Constants
const ERROR_MESSAGE_DURATION = 8;

// Enums
enum ResponseCode {
  OK = 0,
  SERVER_ERROR = 1,
  SERVICE_UNAVAILABLE = 2,
  UNAUTHORIZED = 3,
  BAD_REQUEST = 4,
  NOT_FOUND = 5,
  ROUTER_OPERATION_FAILED = 6,
  ROUTER_NOT_AVAILABLE = 7,
}

export enum SessionStatus {
  DELETED = 0,
  DISABLED = 1,
  ENABLED = 2,
  PENDING_APPROVAL = 3,
  QUEUED_FOR_SETUP = 4,
  QUEUED_FOR_DELETE = 5,
  PROBLEM = 6,
  TEARDOWN = 7,
}

export enum RoutingPolicy {
  FULL = 0,         // Send all valid routes.  Receive all valid routes.
  TRANSIT = 1,      // Send our valid self and downstream routes. Receive all valid routes.
  PEER = 2,         // Send our valid self and downstream routes. Receive remote owned valid and remote downstream routes.
  DOWNSTREAM = 3,   // Send all valid routes. Receive remote owned valid and remote downstream routes.
  UPSTREAM = 4,     // Receive all valid routes, send self routes and downstream routes to remote
}

// Types
type ResponseData =
  | string
  | AuthQueryResponse
  | AuthRequestResponse
  | AuthChallengeResponse
  | PostMetadaResponse
  | RoutersResponse
  | RouterInfoResponse
  | SessionsResponse
  | SessionMetricsResponse
  | GetCurrentSessionResponse
  | SetPasswordResponse
  | PostResponse
  | TokenRefreshResponse
  | SiteConfigDataResponse;

// Types for session metrics
export type RouteMetrics = {
  current: number;   // current route count
  metric: [number, number][]; // each metric is a pair [timestamp, value] where value is route count
};

export type RouteMetricStruct = {
  imported: RouteMetrics;
  exported: RouteMetrics;
};

export type BGPRoutesMetric = {
  ipv4: RouteMetricStruct;
  ipv6: RouteMetricStruct;
};

export type BGPMetric = {
  name: string;
  state: string;
  info: string;
  type: 'mpbgp' | 'ipv4' | 'ipv6' | ''; // 'mpbgp' for multiprotocol BGP, 'ipv4' for IPv4, 'ipv6' for IPv6, '' if not applicable
  routes: BGPRoutesMetric;
};

export type InterfaceTrafficMetric = {
  total: [number, number];   // [Tx, Rx] total traffic, not rate
  current: [number, number]; // [Tx, Rx] current traffic rate, bytes/second
  metric: [number, number, number][]; // each metric is [timestamp, Tx, Rx] in bytes/second
};

export type InterfaceMetric = {
  ipv4: string;         // Can be empty string
  ipv6: string;         // Can be empty string
  ipv6LinkLocal: string; // Can be empty string
  mac: string;          // Can be empty string
  mtu: number;
  status: string;       // Interface flags like "UP, BROADCAST, NOARP"
  traffic: InterfaceTrafficMetric;
};

export type RTTMetric = {
  current: number; // -1 means timeout or error
  loss: number;  // los rate, float64
  metric: [number, number][]; // each metric is [timestamp, value] where value -1 means timeout or error
};

export type SessionMetric = {
  uuid: string;
  asn: number;
  timestamp: number;    // metric generated timestamp
  bgp: BGPMetric[];
  interface: InterfaceMetric;
  rtt: RTTMetric;
  data: {
    info: string;       // Additional information
    passthrough: string; // Passthrough data
  } | '';
};

export type SessionMetricsResponse = {
  metrics: SessionMetric;
};

export type GetCurrentSessionResponse = {
  session: CurrentSessionMetadata;
};

export type CurrentSessionMetadata = {
  uuid: string;
  asn: number;
  status: SessionStatus;
  ipv4: string | null; // Can be null if not used
  ipv6: string | null; // Can be null if not used
  ipv6LinkLocal: string | null; // Can be null if not used
  type: 'wireguard' | 'openvpn' | 'ipsec' | 'gre' | 'ip6gre' | 'direct';
  extensions: ('mp-bgp' | 'extended-nexthop')[];
  interface: string;
  endpoint: string | null; // Can be null if not used
  credential: string | null; // Can be null if not used
  data: {
    info: string;
    passthrough: string;
  } | '';
  mtu: number;
  policy: RoutingPolicy;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
};

interface ResponsePacket {
  code: ResponseCode;
  message: string;
  data: ResponseData;
  token?: string;
}

export interface GeneralResponse {
  success: boolean;
  status?: number;
  response?: ResponseData;
}

// API Request Function
export const makeRequest = async (
  t: (i18n: string) => string,
  path: string,
  data?: any,
  suppressErrorMessage = false // Default value for suppressErrorMessage
): Promise<GeneralResponse> => {

  // Prepare request options
  const options: RequestInit = {
    method: data ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-PeerAPI-Version': config.package,
    },
    body: data ? JSON.stringify(data) : undefined, // Only include body if data is provided
  };

  // Add Authorization header if necessary
  if (path !== '/auth' && !path.startsWith('/list')) {
    const token = localStorage.getItem('token');
    if (token) {
      options.headers = { ...options.headers, Authorization: `Bearer ${token}` };
    }
  }

  try {
    const resp = await fetch(`${config.apiPrefix}${path}`, options);

    // Handle non-200 status codes with specific messages
    if (resp.status !== 200) {
      handleHttpError(resp.status, t, suppressErrorMessage);
      return { success: false, status: resp.status };
    }

    const respData: ResponsePacket = await resp.json();

    if (respData.code !== ResponseCode.OK) {
      handleApiError(respData.code, t, suppressErrorMessage);
      return { success: false, status: resp.status };
    }

    return { success: true, status: resp.status, response: respData.data };

  } catch (error) {
    openNotification("topLeft", "error", t('notification.error'), t('packetHandler.errMsg500_SERVER_ERROR'), ERROR_MESSAGE_DURATION)

    console.error(error);
    return { success: false };
  }
};

// Helper Functions for Error Handling

const handleHttpError = (statusCode: number, t: (i18n: string) => string, suppressErrorMessage?: boolean) => {
  // Handle specific actions for unauthorized access (401)
  if (statusCode === 401) clearLocalStorageAndLogout();

  if (suppressErrorMessage) return;

  const errorMessages: Record<number, string> = {
    400: t('packetHandler.errMsg400_BAD_REQUEST'),
    404: t('packetHandler.errMsg404'),
    405: t('packetHandler.errMsg405_METHOD_NOT_ALLOWED'),
    500: t('packetHandler.errMsg500_SERVER_ERROR'),
    502: t('packetHandler.errMsg502_503'),
    503: t('packetHandler.errMsg502_503'),
  };

  const messageContent = errorMessages[statusCode] || t('packetHandler.errMsg500_SERVER_ERROR')
  openNotification("topLeft", "error", t('notification.error'), messageContent, ERROR_MESSAGE_DURATION)
};

const handleApiError = (code: ResponseCode, t: (i18n: string) => string, suppressErrorMessage?: boolean) => {

  if (suppressErrorMessage) return;

  const errorMessages: Record<ResponseCode, string> = {
    [ResponseCode.ROUTER_NOT_AVAILABLE]: t('packetHandler.err_ROUTER_NOT_AVAILABLE'),
    [ResponseCode.ROUTER_OPERATION_FAILED]: t('packetHandler.err_ROUTER_OPERATION_FAILED'),
    [ResponseCode.OK]: '',
    [ResponseCode.SERVER_ERROR]: '',
    [ResponseCode.SERVICE_UNAVAILABLE]: '',
    [ResponseCode.UNAUTHORIZED]: '',
    [ResponseCode.BAD_REQUEST]: '',
    [ResponseCode.NOT_FOUND]: ''
  };

  const messageContent = errorMessages[code] || '';

  message.error(splitMessageToVNodes(messageContent), ERROR_MESSAGE_DURATION);
};

const clearLocalStorageAndLogout = () => {
  ['token', 'person', 'asn', 'email'].forEach(item => localStorage.removeItem(item));
  loggedIn.value = false;
};

export enum AvailableAuthMethod {
  PASSWORD = 0,
  PGP_ASCII_ARMORED_CLEAR_SIGN = 1,
  SSH_SERVER_AUTH = 2,
  EMAIL = 3
}

export type AuthQueryResponse = {
  person: string;
  authState: string;
  availableAuthMethods: Array<{
    id: string;
    type: AvailableAuthMethod;
    data?: string;
  }>;
}

export type AuthRequestResponse = {
  authState: string;
  authChallenge: string;
}

export type AuthChallengeResponse = {
  authResult: boolean;
  token: string;
};

export type AuthOpenResponse = AuthChallengeResponse & {
  asn: number;
  person?: string;
  email?: string;
};

export interface PostMetadata {
  postId: number;
  category: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostResponse extends PostMetadata {
  content: string;
}

export type PostMetadaResponse = {
  posts: PostMetadata[];
}

export type RoutersResponse = {
  routers: RouterMetadata[];
}

export type RouterInfoResponse = {
  info: string;
  passthrough: string;
}

export type SessionsResponse = {
  sessions: SessionMetadata[];
}

export type SetPasswordResponse = { success: boolean };
export type TokenRefreshResponse = { token: string };

export type RouterMetadata = {
  uuid: string;
  name: string;
  description: string;
  location: string;
  openPeering: boolean;
  autoPeering: boolean;
  sessionCapacity: number;
  sessionCount: number;
  ipv4: string | '';
  ipv6: string | '';
  ipv6LinkLocal: string | '';
  linkTypes:
  (| 'wireguard'
    | 'openvpn'
    | 'ipsec'
    | 'gre'
    | 'ip6gre'
    | 'direct')[];
  extensions:
  (| 'mp-bgp'
    | 'extended-nexthop')[];
  metric?: {
    version: string; // e.g., "iEdon-PeerAPI-Agent/1.0 (linux; amd64; go1.24.4)"
    kernel: string; // e.g., "Linux 6.11.11-2-pve amd64"
    loadAvg: string; // e.g., "1.35 1.64 1.53"
    uptime: number; // e.g., 169829.75 (in seconds)
    rs: string; // e.g., "BIRD 2.0.12\nRouter ID is
    tx: number; // e.g., 1519580408 (in bytes)
    rx: number; // e.g., 1984586137 (in bytes)
    tcp: number; // e.g., 36 (TCP connections)
    udp: number; // e.g., 16 (UDP connections)
    timestamp: number; // e.g., 1749547951037 (timestamp in milliseconds)
  };
  public?: boolean; /* only available in /admin */
  callbackUrl?: string; /* only available in /admin */
  agentSecret?: string; /* only available in /admin */
};

export type SessionMetadata = {
  uuid: string;
  router: string;
  status: SessionStatus;
  ipv4: string;
  ipv6: string;
  ipv6LinkLocal: string;
  type:
  | 'wireguard'
  | 'openvpn'
  | 'ipsec'
  | 'gre'
  | 'ip6gre'
  | 'direct';
  extensions:
  (| 'mp-bgp'
    | 'extended-nexthop')[]; interface: string,
  endpoint: string,
  credential: string,
  policy: RoutingPolicy,
  lastError: string | null,
  data:
  | { info: string; passthrough: string }
  | '',
  bgpStatus?: {
    name: string;
    state: string;
    info: string;
    type: 'mpbgp' | 'ipv4' | 'ipv6' | ''; // 'mpbgp' for multiprotocol BGP, 'ipv4' for IPv4, 'ipv6' for IPv6, '' if not applicable
  }[];
  createdAt: string;
  updatedAt: string;
};

export type SiteConfigDataResponse = {
  netAsn: string;
  netDesc: string;
  netName: string;
  footerText: string;
  maintenanceText: string;
};
