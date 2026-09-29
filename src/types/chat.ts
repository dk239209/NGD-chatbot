/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GoogleChatSpace {
  name: string; // e.g. "spaces/AAAA..."
  type?: 'SPACE' | 'GROUP_CHAT' | 'DIRECT_MESSAGE';
  displayName?: string;
  spaceType?: string;
  spaceThreadingState?: string;
  singleUserBotDm?: boolean;
}

export interface GoogleChatMessage {
  name?: string;
  sender?: {
    name?: string;
    displayName?: string;
    type?: string;
  };
  createTime?: string;
  text?: string;
  formattedText?: string;
}

export interface ListSpacesResponse {
  spaces?: GoogleChatSpace[];
  nextPageToken?: string;
}

export interface ListMessagesResponse {
  messages?: GoogleChatMessage[];
  nextPageToken?: string;
}
