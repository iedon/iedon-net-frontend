import { message } from 'ant-design-vue'
import config from "../config"
import { loggedIn, splitMessageToVNodes } from './helper'

enum ResponseCode {
    OK = 0,
    SERVER_ERROR = 1,
    UNAUTHORIZED = 2,
    BAD_REQUEST = 3,
    METHOD_NOT_ALLOWED = 4,
    ROUTER_OPERATION_FAILED = 5,
    ROUTER_NOT_AVAILABLE = 6
}

type ResponsePacket = {
    code: ResponseCode,
    message: string,
    data: string | any,
    token?: string
}

const ERROR_MESSAGE_DURATION = 8
export const makeRequest = async (t: (i18n: string) => string, path: string, data?: any, supressErrorMessage?: boolean): Promise<null | object | string> => {
    const _data = data || ''
    if (path !== '/auth') {
        const token = localStorage.getItem('token')
        if (token) Object.assign(_data, { token })
    }
    const options = {
        method:"POST",
        headers: {
            'Content-Type': 'application/json',
            'X-PeerAPI-Version': config.package
        },
        body: JSON.stringify(_data)
    }
    try {
        const resp = await fetch(`${config.apiPrefix}${path}`, options)
        if (resp.status !== 200) {
            switch (resp.status) {
                case 400: if (!supressErrorMessage) message.error(splitMessageToVNodes(t('packetHandler.errMsg400_BAD_REQUEST')), ERROR_MESSAGE_DURATION); break;
                case 404: if (!supressErrorMessage) message.error(splitMessageToVNodes(t('packetHandler.errMsg404')), ERROR_MESSAGE_DURATION); break;
                case 405: if (!supressErrorMessage) message.error(splitMessageToVNodes(t('packetHandler.errMsg405_METHOD_NOT_ALLOWED')), ERROR_MESSAGE_DURATION); break;
                case 500: if (!supressErrorMessage) message.error(splitMessageToVNodes(t('packetHandler.errMsg500_SERVER_ERROR')), ERROR_MESSAGE_DURATION); break;
                default: case 502: case 503: if (!supressErrorMessage) message.error(splitMessageToVNodes(t('packetHandler.errMsg502_503')), ERROR_MESSAGE_DURATION); break;
            }
            return null
        }

        const respData: ResponsePacket = await resp.json()
        if (respData.data === undefined || respData.data === null) throw new Error('Invalid response received from server.')
        if (respData.code !== ResponseCode.OK) {
            switch (respData.code) {
                case ResponseCode.UNAUTHORIZED: {
                    localStorage.removeItem('token')
                    localStorage.removeItem('person')
                    localStorage.removeItem('asn')
                    localStorage.removeItem('email')
                    loggedIn.value = false
                    if (!supressErrorMessage) message.error(splitMessageToVNodes(t('packetHandler.err_UNAUTHORIZED')), ERROR_MESSAGE_DURATION); 
                } break;
                case ResponseCode.METHOD_NOT_ALLOWED: if (!supressErrorMessage) message.error(splitMessageToVNodes(t('packetHandler.errMsg405_METHOD_NOT_ALLOWED')), ERROR_MESSAGE_DURATION); break;
                case ResponseCode.SERVER_ERROR: if (!supressErrorMessage) message.error(splitMessageToVNodes(t('packetHandler.errMsg500_SERVER_ERROR')), ERROR_MESSAGE_DURATION); break;
                case ResponseCode.BAD_REQUEST: if (!supressErrorMessage) message.error(splitMessageToVNodes(t('packetHandler.errMsg400_BAD_REQUEST')), ERROR_MESSAGE_DURATION); break;
                case ResponseCode.ROUTER_NOT_AVAILABLE: if (!supressErrorMessage) message.error(splitMessageToVNodes(t('packetHandler.err_ROUTER_NOT_AVAILABLE')), ERROR_MESSAGE_DURATION); break;
                case ResponseCode.ROUTER_OPERATION_FAILED: if (!supressErrorMessage) message.error(splitMessageToVNodes(t('packetHandler.err_ROUTER_OPERATION_FAILED')), ERROR_MESSAGE_DURATION); break;
                default: if (!supressErrorMessage) message.error(splitMessageToVNodes(t('packetHandler.errMsg502_503')), ERROR_MESSAGE_DURATION); break;
            }
            return null
        }

        if (respData.token) {
            localStorage.setItem('token', respData.token)
        }

        return respData.data
    } catch (error) {
        message.error(splitMessageToVNodes(t('packetHandler.errMsg500_SERVER_ERROR')), ERROR_MESSAGE_DURATION);
        console.error(error)
        return null
    }
}

export interface AuthQueryResponse {
    person: string,
    authState: string,
    availableAuthMethods: {
        id: string,
        type: 'password' | 'e-mail' | 'pgp-fingerprint' | 'ssh-rsa' | 'ssh-dsa' | 'ssh-ecdsa' | 'ssh-ed25519',
        data?: string
    }[]
}

export interface AuthRequestResponse {
    authState: string,
    authChallenge: string
}

export interface AuthChallengeResponse {
    authResult: boolean,
    token: string
}

export type PostMetadata = {
    postId: number,
    category: string,
    title: string,
    createdAt: string,
    updatedAt: string
}

export interface Post extends PostMetadata {
    content: string
}

export interface PostMetadaResponse {
    posts: PostMetadata[]
}

export type RouterMetadata = {
    uuid: string,
    name: string,
    description: string,
    location: string,
    openPeering: boolean,
    autoPeering: boolean,
    sessionCapacity: number,
    sessionCount: number,
    ipv4: string | '',
    ipv6: string | '',
    ipv6LinkLocal: string | '',
    linkTypes: ('wireguard' | 'openvpn' | 'ipsec' | 'gre' | 'direct')[],
    extensions: ('mp-bgp'|'extended-nexthop')[],
    /* only available in /admin */
    public?: boolean,
    callbackUrl?: string
}

export interface RoutersResponse {
    routers: RouterMetadata[]
}

export interface RouterInfoResponse {
    info: string,
    passthrough: string
}

export enum SessionStatus {
    PENDING_REVIEW = -1,
    DISABLED = 0,
    ENABLED = 1
}

export type SessionMetadata = {
    uuid: string,
    router: string,
    status: SessionStatus,
    ipv4: string,
    ipv6: string,
    ipv6LinkLocal: string,
    type: 'wireguard' | 'openvpn' | 'ipsec' | 'gre' | 'direct',
    extensions: ('mp-bgp'|'extended-nexthop')[],
    interface: string,
    endpoint: string,
    credential: string,
    data: {
        info: string,
        passthrough: string
    } | ''
}
export interface SessionsResponse {
    sessions: SessionMetadata[]
}

export type SetPasswordResponse = {
    success: boolean
}

export type SiteConfigData = {
    netAsn: string,
    netDesc: string,
    netName: string,
    footerText: string,
    maintenanceText: string
}
