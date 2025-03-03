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
  PENDING_REVIEW = -1,
  DISABLED = 0,
  ENABLED = 1,
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
  | SetPasswordResponse
  | PostResponse
  | TokenRefreshResponse
  | SiteConfigDataResponse;

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
    | 'direct')[];
  extensions:
  (| 'mp-bgp'
    | 'extended-nexthop')[];
  public?: boolean; /* only available in /admin */
  callbackUrl?: string; /* only available in /admin */
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
  | 'direct';
  extensions:
  (| 'mp-bgp'
    | 'extended-nexthop')[];
  interface: string,
  endpoint: string,
  credential: string,
  data:
  | { info: string; passthrough: string }
  | '';
};

export type SiteConfigDataResponse = {
  netAsn: string;
  netDesc: string;
  netName: string;
  footerText: string;
  maintenanceText: string;
};
